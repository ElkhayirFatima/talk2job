import json
import re
from app.core.llm.groq_client import GroqClient
from app.core.llm.gemini_client import GeminiClient


class SkillExtractor:

    SYSTEM_PROMPT = """You are a CV analysis engine. You perform two tasks: skill extraction and profile summarization.

## TASK 1 — SKILL EXTRACTION

### Non-Negotiable Rules
- Extract ONLY skills that appear VERBATIM or in direct abbreviated form in the text.
- NEVER infer, relate, or associate. Seeing "React" does NOT justify adding "JavaScript". Seeing "GCP" does NOT justify adding "AWS".
- NEVER add a skill that is not explicitly written, even if it is logically implied.

### Atomization
Split compound or slash-separated terms into individual skills:
- "GitLab CI/CD" → "GitLab", "CI/CD"
- "HTML/CSS" → "HTML", "CSS"
- Do NOT split single-token acronyms: "NLP", "ETL", "BERT" stay as-is.

### Normalization (label only — do NOT change the technology)
- "ReactJS" / "React.js" → "React"
- "NodeJS" / "Node.js" → "Node.js"
- "Postgres" → "PostgreSQL"
- "k8s" → "Kubernetes"
- "JS" → "JavaScript", "TS" → "TypeScript"

### Hard Skills Only
Include: languages, frameworks, libraries, databases, cloud services, DevOps tools, protocols, platforms.
Exclude: soft skills, job titles, vague concepts ("scalable systems", "best practices", "agile mindset").

## TASK 2 — SKILL CLASSIFICATION

Classify each extracted skill into exactly one of two buckets:

**core_skills**: Skills with clear signals of strong, professional, or repeated usage.
Look for signals like: years of experience mentioned, used in professional roles, listed as primary stack, repeated across multiple positions.

**secondary_skills**: Skills with weak or shallow signals.
Look for signals like: mentioned once, used only in academic/personal projects, listed under "familiar with" or "exposure to", no depth indicators.

If no signal is available to distinguish, default to secondary_skills.

## TASK 3 — PROFILE SUMMARY

Write a 2–3 line factual summary of the candidate's technical profile.
- Base it ONLY on what is written in the CV.
- Reflect actual specialization (e.g., backend, data engineering, MLOps, fullstack).
- State primary stack and domain focus.
- Do NOT use filler phrases like "passionate developer", "strong communicator", or "eager to learn".
- Do NOT exaggerate seniority or scope.

Good example: "Backend engineer with professional experience in Python and FastAPI, primarily working on REST API development and PostgreSQL databases. Has handled deployment workflows using Docker and GitHub Actions in project contexts."
Bad example: "Highly skilled and passionate full-stack developer with expertise across all modern technologies."

## TASK 4 — SENIORITY CLASSIFICATION
Classify the candidate into exactly one of three levels: "Junior", "Mid-level", or "Senior".

### Classification Rules
- **Junior**: Assign if the text mentions "Student", "Intern", "Stagiaire", "Junior", "Entry-level", or if the total experience is between 0 to 2 years.
- **Senior**: Assign if the text mentions "Senior", "Lead", "Principal", "Architect", or if the total experience is 5 years or more.
- **Mid-level**: Assign for any experience between 2 to 5 years, or if the profile does not clearly fit "Junior" or "Senior" criteria.

### Non-Negotiable Rules for Seniority
- Base classification ONLY on what is explicitly written in the text.
- Do NOT infer seniority from the complexity of listed technologies.
- Do NOT upgrade a level because the tech stack appears advanced.
- If no keywords and no calculable experience are found → default to "Junior".

## OUTPUT FORMAT
Return ONLY a valid JSON object. No explanation, no markdown, no code fences.
Response must start with { and end with }.

{
  "core_skills": ["skill1", "skill2"],
  "secondary_skills": ["skill3", "skill4"],
  "summary": "2-3 line factual profile summary.",
  "seniority_level": "Junior | Mid-level | Senior"
}

If no information is found, return: {"core_skills": [], "secondary_skills": [], "summary": "Insufficient technical information.", "seniority_level": "Junior"}"""

    # -------------------------------------------------------------------------

    def __init__(self):
        self.groq = GroqClient()
        self.gemini = GeminiClient()

    # -------------------------------------------------------------------------

    def extract_skills(self, text: str) -> dict:
        """
        Extracts and classifies technical skills from CV text,
        and generates a factual profile summary using Groq with Gemini fallback.
        """
        empty = {
            "core_skills": [],
            "secondary_skills": [],
            "summary": "",
            "seniority_level": "Junior",
        }

        if not text or len(text.strip()) < 5:
            return empty

        user_prompt = f"""## CV TEXT TO ANALYZE

{text}

Return ONLY the JSON object. No explanation, no markdown."""

        # ROUTER LOGIC: Try Groq first, fallback to Gemini if Groq fails or returns invalid JSON
        try:
            print(" [Router] Trying Groq...")
            response = self.groq.get_structured_completion(
                system_prompt=self.SYSTEM_PROMPT, user_prompt=user_prompt
            )
            clean_json = self._clean_json_response(response)
            data = json.loads(clean_json)
            return self._validate(data, empty)
        except Exception as e:
            print(f"⚠️ [Router] Groq failed: {e}")

            try:
                print("[Router] Switching to Gemini Fallback...")
                response = self.gemini.get_structured_completion(
                    system_prompt=self.SYSTEM_PROMPT, user_prompt=user_prompt
                )
                clean_json = self._clean_json_response(response)
                data = json.loads(clean_json)
                return self._validate(data, empty)

            except json.JSONDecodeError as je:
                print(f"❌ [Router] Gemini also returned invalid JSON: {je}")
                return empty
            except Exception as e2:
                print(f"❌ [Router] Critical: Both LLMs failed. Error: {e2}")
                return empty

    # -------------------------------------------------------------------------

    def _clean_json_response(self, text: str) -> str:
        """
        Strips markdown code fences and extracts the first valid
        JSON object from the model response, if any surrounding
        noise is present.
        """
        # Remove opening/closing markdown fences (e.g. ```json ... ```)
        text = re.sub(r"^```[a-zA-Z]*\s*", "", text.strip())
        text = re.sub(r"\s*```$", "", text)

        # Fallback: extract the first {...} block if noise remains
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return match.group(0)

        return text.strip()

    # -------------------------------------------------------------------------

    def _validate(self, data: dict, fallback: dict) -> dict:
        """
        Ensures the parsed response matches the expected schema.
        Guards against missing keys, wrong types, or null values
        that small/fast models occasionally produce.
        """
        valid_levels = ["Junior", "Mid-level", "Senior"]
        extracted_level = data.get("seniority_level")
        return {
            "core_skills": self._clean_list(data.get("core_skills")),
            "secondary_skills": self._clean_list(data.get("secondary_skills")),
            "summary": (
                data.get("summary", "").strip()
                if isinstance(data.get("summary"), str)
                else fallback["summary"]
            ),
            "seniority_level": (
                extracted_level
                if extracted_level in valid_levels
                else fallback["seniority_level"]
            ),
        }

    # -------------------------------------------------------------------------

    def _clean_list(self, value) -> list:
        """
        Coerces a skill list to a clean list of non-empty strings.
        Returns an empty list if the value is missing or malformed.
        """
        if not isinstance(value, list):
            return []
        return [str(s).strip() for s in value if isinstance(s, str) and s.strip()]
