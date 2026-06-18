from app.modules.cv.infrastructure.repository.resume_repository import ResumeRepository
from app.modules.job.infrastructure.repository.job_repository import JobRepository
from app.modules.matching.application.matcher.insight_generator import (
    MatchInsightGenerator,
)
from app.modules.matching.application.matcher.insight_generator import (
    MatchInsightGenerator,
)
from app.modules.matching.application.matcher.semantic_matcher import SemanticMatcher
from app.modules.matching.application.ranker.job_ranker import JobRanker
from app.modules.matching.infrastructure.vector_store.langchain_pgvector import (
    SQLVectorAdapter,
)
from sqlalchemy.orm import Session


class MatchingService:
    def __init__(self, db: Session):
        self.db = db
        self.matcher = SemanticMatcher()
        self.ranker = JobRanker()

    # 1. CV vs ONE JOB
    def match_cv_to_job_id(self, db: Session, cv_id: str, job_id: str) -> dict:
        """
        Calculates a robust hybrid score using:
        1. Semantic Similarity (Summary Vectors)
        2. Skill Overlap (Core & Secondary Skills)
        """
        # Fetch CV + JOB from DB
        cv = ResumeRepository(db).get_by_id(cv_id)
        job_repo = JobRepository(db)
        job = job_repo.get_job_by_id(job_id)

        if not cv:
            return {"status": "Error", "message": "CV not found"}

        if not cv.raw_text or len(cv.raw_text.strip()) < 10:
            return {"status": "Error", "message": "CV text is too short or empty"}

        if not job:
            return {"status": "Job not found"}

        # 2. Semantic Score - Summary Context (40%)
        summary_score = self.matcher.calculate_similarity(
            cv.summary_vector, job.summary_vector
        )
        # 3. Semantic Score - Core Skills (50%)
        # This solves the "AWS vs GCP" or "Git vs GitHub" problem
        core_skills_score = self.matcher.calculate_similarity(
            cv.core_skills_vector, job.core_skills_vector
        )
        # 4. Semantic Score - Secondary Skills (10%)
        secondary_skills_score = self.matcher.calculate_similarity(
            cv.secondary_skills_vector, job.secondary_skills_vector
        )

        # 5. Hybrid Weighted Final Score
        base_score = (
            (summary_score * 0.40)
            + (core_skills_score * 0.50)
            + (secondary_skills_score * 0.10)
        ) * 100

        final_score = self.matcher.apply_seniority_adjustment(
            base_score, cv.seniority_level, job.seniority_level
        )

        insight = MatchInsightGenerator.get_insight(
            name=cv.user_name or "Candidate",
            user_level=cv.seniority_level,
            job_level=job.seniority_level,
            job_title=job.title,
            score=final_score,
            top_skill=(
                cv.core_skills.split(",")[0] if cv.core_skills else "your core stack"
            ),
        )

        # Job (Core + Secondary)
        all_job_skills_str = f"{job.core_skills or ''}, {job.secondary_skills or ''}"
        all_job_skills_list = [
            s.strip() for s in all_job_skills_str.split(",") if s.strip()
        ]

        # CV (Core + Secondary)
        all_cv_skills_str = f"{cv.core_skills or ''}, {cv.secondary_skills or ''}"
        all_cv_skills_list = [
            s.strip() for s in all_cv_skills_str.split(",") if s.strip()
        ]
        return {
            "match_score": final_score,
            "difficulty_level": insight["status"],
            "insight_message": insight["message"],
            "status": "Success",
            "breakdown": {
                "summary_semantic": round(summary_score * 100, 2),
                "core_skills_semantic": round(core_skills_score * 100, 2),
                "secondary_skills_semantic": round(secondary_skills_score * 100, 2),
            },
            "job_skills": all_job_skills_list,
            "cv_skills": all_cv_skills_list,
            "status": "Success",
        }

    # 2. CV vs ALL JOBS (ranking)
    async def get_recommendations(
        self, db: Session, cv_id: str, min_score: float = 60.0
    ):
        """
        Global Search: Orchestrates the ranking process and filters by a minimum relevance score.
        """
        # Fetch the complete CV record with all skill vectors
        cv = ResumeRepository(db).get_by_id(cv_id)
        if not cv:
            return {"status": "Error", "message": "CV not found"}

        if not cv.raw_text or len(cv.raw_text.strip()) < 10:
            return {"status": "Error", "message": "CV text is too short"}

        try:
            # Stage 1 (Vector Search) + Stage 2 (FlashRank) are inside get_ranked_jobs
            ranked_results = self.ranker.get_ranked_jobs(
                db=db, cv=cv, score_threshold=min_score
            )

            return {
                "status": "Success",
                "search_criteria": {
                    "min_score_applied": min_score,
                    "total_found": len(ranked_results),
                },
                "recommendations": ranked_results,
            }
        except Exception as e:
            print(f"Ranking Service Error: {e}")
            return {
                "status": "Error",
                "message": "An error occurred during the ranking process.",
            }
