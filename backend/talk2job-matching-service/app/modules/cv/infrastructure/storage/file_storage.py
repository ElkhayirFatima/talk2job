import os
import uuid
import shutil


class FileStorageService:
    @staticmethod
    def save_file(file, upload_dir: str) -> str:
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        extension = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{uuid.uuid4()}{extension}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_path

    @staticmethod
    def delete_file(path: str):
        if os.path.exists(path):
            os.remove(path)
