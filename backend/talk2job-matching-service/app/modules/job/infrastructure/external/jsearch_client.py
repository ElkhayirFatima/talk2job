import requests
from app.core.config import JSEARCH_API_KEY


class JSearchService:
    """
    External API client to fetch jobs from JSearch
    """

    BASE_URL = "https://jsearch.p.rapidapi.com/search"

    def fetch_jobs(self, query="software engineer", location="None"):
        """
        Fetch jobs from JSearch API
        """

        headers = {
            "X-RapidAPI-Key": JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }
        final_query = f"{query} in {location}" if location else f"{query} "
        params = {
            "query": final_query,
            "page": "1",
            "num_pages": "1",
            "remote_jobs_only": "false",
        }

        response = requests.get(self.BASE_URL, headers=headers, params=params)

        if response.status_code != 200:
            print(f"ERROR: {response.status_code} - {response.text}")
            return []

        data = response.json()
        return data.get("data", [])
