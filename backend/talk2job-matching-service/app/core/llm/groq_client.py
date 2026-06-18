from groq import Groq
from app.core.config import settings


class GroqClient:

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    def get_structured_completion(
        self,
        user_prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.0,
    ) -> str:
        """
        Sends a completion request to Groq.

        Args:
            user_prompt:   The user-turn message (CV text + instructions).
            system_prompt: Optional system-turn message (role definition + rules).
                           When provided, it is injected as the first message
                           with role "system", which gives the model stronger
                           instruction-following than embedding rules in the
                           user turn.
            temperature:   Sampling temperature. Defaults to 0.0 for maximum
                           determinism — critical for strict JSON extraction.

        Returns:
            Raw response string from the model.
        """
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": user_prompt})

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=temperature,
        )

        return completion.choices[0].message.content
