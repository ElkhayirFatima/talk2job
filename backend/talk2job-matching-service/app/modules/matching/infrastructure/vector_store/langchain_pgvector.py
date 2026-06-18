from langchain_core.documents import Document
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func


class SQLVectorAdapter:
    """
    Adapter to bridge the SQLAlchemy 'jobs' table with LangChain Document format.
    Allows for efficient similarity searches without duplicating data in external stores.
    """

    @staticmethod
    def get_nearest_jobs_as_documents(db: Session, cv, k: int = 100) -> List[Document]:

        # Format vectors for pgvector casting
        summary_vec = f"[{','.join(map(str, cv.summary_vector))}]"
        core_vec = f"[{','.join(map(str, cv.core_skills_vector))}]"
        secondary_vec = f"[{','.join(map(str, cv.secondary_skills_vector))}]"

        # Use Weighted Cosine Distance: 60% Summary context, 40% Hard Core Skills match
        sql_query = text("""
            SELECT id, job_id, title, company, location, description, job_url, seniority_level,
               ((summary_vector <=> CAST(:sum_vec AS vector)) * 0.5 + 
                (core_skills_vector <=> CAST(:core_vec AS vector)) * 0.4 +
                (secondary_skills_vector <=> CAST(:sec_vec AS vector)) * 0.1) as combined_distance
            FROM jobs
            WHERE summary_vector IS NOT NULL 
            AND core_skills_vector IS NOT NULL 
            AND secondary_skills_vector IS NOT NULL
            ORDER BY combined_distance ASC
            LIMIT :limit
        """)
        results = db.execute(
            sql_query,
            {
                "sum_vec": summary_vec,
                "core_vec": core_vec,
                "sec_vec": secondary_vec,
                "limit": k,
            },
        )

        documents = []
        for row in results:
            documents.append(
                Document(
                    page_content=row.description or "",
                    metadata={
                        "job_id": row.job_id,
                        "job_title": row.title,
                        "company_name": row.company,
                        "location": row.location,
                        "job_url": row.job_url or "#",
                        "vector_distance": float(row.combined_distance),
                        "seniority_level": row.seniority_level,
                    },
                )
            )

        return documents
