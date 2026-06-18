from google import genai
from app.core.config import settings


class GeminiClient:
    def __init__(self):
        # Initialize with the API key
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-flash"

    def get_structured_completion(
        self,
        user_prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.0,
    ) -> str:

        # Configuration for JSON output
        config = {
            "temperature": temperature,
            "response_mime_type": "application/json",
            "system_instruction": system_prompt,  # This is the correct way
        }

        # The models.generate_content expects 'model' and 'contents'
        response = self.client.models.generate_content(
            model=self.model_name, contents=user_prompt, config=config
        )

        return response.text
