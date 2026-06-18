from numpy.strings import title

from app.modules.job.infrastructure.repository.job_repository import JobRepository
from app.modules.job.domain.models.job_model import Job
from app.core.extractor.skill_extractor import SkillExtractor
from app.core.normalizer.skill_normalizer import normalize_skill_list
from app.core.vector_service import VectorService
import time

extractor = SkillExtractor()
vector_service = VectorService()


def save_jobs(db, jobs):
    """
    Use case: save jobs with deduplication
    """
    # 1. LIMIT: Only process the first 20 jobs to avoid hitting LLM Quotas (Rate Limits)
    limited_jobs = jobs[:20]
    inserted = 0
    excluded = ["manager", "director", "head", "lead", "architect", "principal"]

    repository = JobRepository(db)
    print(f"Starting sync for {len(limited_jobs)} jobs...")
    for job in limited_jobs:
        job_title_lower = job.get("job_title", "").lower()
        if any(word in job_title_lower for word in excluded):
            print(f"Skipping {job_title_lower} (Excluded role)")
            continue

        job_id = job.get("job_id")
        if not job_id:
            continue

        # 2. Database Deduplication (Permanent)
        existing = db.query(Job).filter(Job.job_id == job_id).first()
        if existing:
            # Skip if already exists to save API tokens
            continue
        try:
            description = job.get("job_description", "")

            # 3. LLM Extraction (The SkillExtractor uses the LLM Router inside)
            extraction_results = extractor.extract_skills(description)

            # 4. SKIP LOGIC: If LLM fails to return skills, do NOT save an empty job
            # This prevents polluting the DB with "empty" entries when Rate Limits are hit
            if not extraction_results or not extraction_results.get("core_skills"):
                print(
                    f"⚠️ Skipping job {job_id}: Extraction failed (likely Rate Limit)"
                )
                continue

            # Seniority Extraction (Bonus)
            seniority = extraction_results.get("seniority_level", "Mid-level")
            # 5. Normalization & Formatting
            normalized_core = normalize_skill_list(
                extraction_results.get("core_skills", [])
            )
            normalized_secondary = normalize_skill_list(
                extraction_results.get("secondary_skills", [])
            )

            core_text = ", ".join(normalized_core)
            secondary_text = ", ".join(normalized_secondary)
            job_summary = extraction_results.get("summary", "")

            # 6. Generate Embeddings (Vectorization)
            summary_vector = vector_service.get_embeddings(job_summary)
            core_skills_vector = vector_service.get_embeddings(core_text)
            secondary_skills_vector = vector_service.get_embeddings(secondary_text)

            # 7. Location Logic
            city = job.get("job_city")
            country = job.get("job_country")
            location_final = (
                f"{city}, {country}"
                if city and country
                else (city or country or "Remote")
            )

            # 6. Prepare Job Data (Matching the new Job Model)
            job_data = {
                "job_id": job_id,
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": location_final,
                "description": description,
                "seniority_level": seniority,
                "job_url": job.get("job_apply_link"),
                "is_remote": job.get("job_is_remote", False),
                "core_skills": core_text,
                "secondary_skills": secondary_text,
                "job_summary": job_summary,
                "summary_vector": summary_vector,
                "core_skills_vector": core_skills_vector,
                "secondary_skills_vector": secondary_skills_vector,
            }

            # 9. Commit to DB
            repository.create_job(job_data)
            inserted += 1
            print(f"✅ Saved & Vectorized: {job.get('job_title')} in {location_final}")

            # 10. RATE LIMITING: Pause for 2 seconds between jobs to respect Free Tier limits
            time.sleep(2)
        except Exception as e:
            print(f"⚠️ Error processing job {job_id}: {e}")
            continue

    # Commit all changes at the end
    db.commit()
    return inserted
