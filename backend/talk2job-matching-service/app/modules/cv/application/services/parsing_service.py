import os
import hashlib
from sqlalchemy.orm import Session
from fastapi import UploadFile

# Infrastructure Imports: Handle file storage and document parsing
from app.modules.cv.infrastructure.storage.file_storage import FileStorageService
from app.modules.cv.infrastructure.parsers.document_factory import DocumentFactory
from app.modules.cv.domain.models.resume_model import Resume
from app.modules.cv.infrastructure.repository.resume_repository import ResumeRepository

# Core Imports: Shared AI tools for extraction, normalization, and vectorization
from app.core.extractor.skill_extractor import SkillExtractor
from app.core.normalizer.skill_normalizer import normalize_skill_list
from app.core.vector_service import VectorService


class ParsingService:
    def __init__(self, db: Session):
        """
        Initialize the service with a database session and core AI components.
        """
        self.db = db
        self.extractor = SkillExtractor()
        self.vectorizer = VectorService()
        self.repo = ResumeRepository(self.db)

    async def process_resume(
        self, file: UploadFile, upload_dir: str, user_id: str, user_name: str
    ):
        """
        Orchestrates the full pipeline : Hashing -> Duplicate Check -> Upload -> Parse -> AI Extract -> Store.
        """
        # STEP 0: Read file content and generate SHA-256 Hash to prevent duplicates
        # We read it here before saving to storage to check if we already have it
        file_content = await file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        # STEP 1: Check if this user already uploaded this exact file
        existing_resume = self.repo.get_by_hash(user_id, file_hash)
        if existing_resume:
            # If duplicate found, we skip AI processing and return the existing record
            print(f"DEBUG: Duplicate found for hash {file_hash}")
            return existing_resume

        # Reset file pointer after reading content so it can be saved physically
        # (This is important because await file.read() moves the cursor to the end)
        await file.seek(0)

        # STEP 2: Physically save the file
        file_path = FileStorageService.save_file(file, upload_dir)
        try:
            # STEP 3: Text Extraction
            extension = os.path.splitext(file.filename)[1].lower()
            raw_content = DocumentFactory.get_text(file_path, extension)

            # STEP 4: AI Skill Extraction (Groq/Gemini)
            extraction_results = self.extractor.extract_skills(raw_content)

            # STEP 5: Normalization
            normalized_core = normalize_skill_list(
                extraction_results.get("core_skills", [])
            )
            normalized_secondary = normalize_skill_list(
                extraction_results.get("secondary_skills", [])
            )

            core_skills_text = ", ".join(normalized_core)
            secondary_skills_text = ", ".join(normalized_secondary)
            profile_summary = extraction_results.get("summary", "")
            seniority = extraction_results.get("seniority_level", "Junior")

            # STEP 6: Vectorization
            summary_vector = self.vectorizer.get_embeddings(profile_summary)
            core_skills_vector = self.vectorizer.get_embeddings(core_skills_text)
            secondary_skills_vector = self.vectorizer.get_embeddings(
                secondary_skills_text
            )

            # STEP 7: Manage Active Status
            # Before creating the new active resume, deactivate all old ones for this user
            self.repo.deactivate_all_user_resumes(user_id)

            # STEP 8: Create new Resume record with is_active=True
            new_resume = Resume(
                user_id=user_id,  # Linked to our Auth user
                user_name=user_name,  # Name of the user
                file_hash=file_hash,  # Our unique file fingerprint
                is_active=True,  # Set as the default for matching
                filename=file.filename,
                file_path=file_path,
                raw_text=raw_content,
                core_skills=core_skills_text,
                secondary_skills=secondary_skills_text,
                cv_summary=profile_summary,
                seniority_level=seniority,
                summary_vector=summary_vector,
                core_skills_vector=core_skills_vector,
                secondary_skills_vector=secondary_skills_vector,
            )

            return self.repo.create(new_resume)

        except Exception as e:
            # CLEANUP: Delete physical file if processing fails
            FileStorageService.delete_file(file_path)
            print(f"Error during resume processing: {str(e)}")
            raise e
