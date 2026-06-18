import os
from pathlib import Path
from flashrank import Ranker
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_compressors import FlashrankRerank
from sqlalchemy.orm import Session
from app.modules.cv.infrastructure.repository.resume_repository import ResumeRepository
from app.modules.matching.infrastructure.vector_store.langchain_pgvector import (
    SQLVectorAdapter,
)
from app.modules.matching.application.matcher.semantic_matcher import SemanticMatcher
from app.modules.matching.application.matcher.insight_generator import (
    MatchInsightGenerator,
)

FLASHRANK_MODEL = os.getenv("FLASHRANK_MODEL", "ms-marco-MultiBERT-L-12")
FLASHRANK_CACHE_DIR = os.getenv("FLASHRANK_CACHE_DIR", str(Path.home() / ".cache" / "flashrank"))


class JobRanker:
    def __init__(self):
        client = Ranker(model_name=FLASHRANK_MODEL, cache_dir=FLASHRANK_CACHE_DIR)
        self.reranker = FlashrankRerank(client=client)
        self.matcher = SemanticMatcher()

    def get_ranked_jobs(self, db: Session, cv, score_threshold: float = 60.0):
        """
        Executes a two-stage ranking pipeline:
        Stage 1: Fast Vector Search (Top K candidates via pgvector)
        Stage 2: Deep Re-ranking (Semantic refinement via FlashRank)
        """

        # 1. Retrieve candidate documents using hybrid vector similarity (Summary + Core Skills)
        candidate_docs = SQLVectorAdapter.get_nearest_jobs_as_documents(
            db=db, cv=cv, k=100  # Initial pool for re-ranking
        )
        if not candidate_docs:
            return []

        # 2. Build a rich query context combining summary and skills for better re-ranking precision
        query_context = (
            f"Candidate Summary: {cv.cv_summary}. "
            f"Core Technical Skills: {cv.core_skills}. "
            f"Secondary Skills and Tools: {cv.secondary_skills}."
        )

        # 3. Perform cross-attention re-ranking to sort candidates by actual contextual relevance
        ranked_docs = self.reranker.compress_documents(candidate_docs, query_context)

        # 4. Format and serialize the top N results
        recommendations = []
        for doc in ranked_docs:
            raw_score = round(float(doc.metadata.get("relevance_score", 0)) * 100, 2)

            job_level = doc.metadata.get("seniority_level", "Junior")
            final_score = self.matcher.apply_seniority_adjustment(
                raw_score, cv.seniority_level, job_level
            )

            if final_score >= score_threshold:
                insight = MatchInsightGenerator.get_insight(
                    name=cv.user_name or "Candidate",
                    user_level=cv.seniority_level,
                    job_level=job_level,
                    job_title=doc.metadata.get("job_title"),
                    score=final_score,
                    top_skill=(
                        cv.core_skills.split(",")[0]
                        if cv.core_skills
                        else "your core stack"
                    ),
                )

                recommendations.append(
                    {
                        "job_id": doc.metadata.get("job_id"),
                        "title": doc.metadata.get("job_title"),
                        "company": doc.metadata.get("company_name"),
                        "location": doc.metadata.get("location"),
                        "ranking_score": final_score,
                        "difficulty_level": insight[
                            "status"
                        ],  # (Ideal Match, Challenging...)
                        "insight_message": insight["message"],
                        "summary": doc.page_content[:250] + "...",
                        "job_url": doc.metadata.get("job_url", "#"),
                    }
                )

        return sorted(recommendations, key=lambda x: x["ranking_score"], reverse=True)
