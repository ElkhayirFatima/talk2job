import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL")

# JSearch API Key
JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY")


# GROQ API Configuration
class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = "llama-3.3-70b-versatile"

    # Gemini API Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


settings = Settings()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "app/modules/cv/uploads")
