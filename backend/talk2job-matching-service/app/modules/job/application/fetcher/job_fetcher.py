from app.modules.job.infrastructure.external.jsearch_client import JSearchService


def fetch_all_jobs():
    """
    Fetch jobs from API for multiple queries and locations.
    """
    service = JSearchService()

    # 1. Define specific search pairs (Job Title + Location)
    # This allows us to target different markets (Local & International)
    search_configs = [
        # Local Jobs (Morocco)
        {"query": "Full Stack Developer", "location": "Morocco"},
        {"query": "Backend Python Developer", "location": "Casablanca"},
        {"query": "Java Spring Boot", "location": "Rabat"},
        # Hybrid/Remote focused (Global)
        {"query": "Frontend React Developer", "location": "Morocco"},
        {"query": "Mobile Flutter Developer", "location": "Oujda"},
        # Infrastructure (No fixed location - let the API decide)
        {"query": "DevOps Engineer", "location": None},
        {"query": "Cloud Architect AWS", "location": None},
        {"query": ".NET Core Engineer", "location": "France"},
    ]

    all_jobs = []
    seen_ids = set()

    for config in search_configs:
        query = config["query"]
        loc = config["location"]

        try:
            # Informative print to see what's happening in the terminal
            print(f"🔍 Fetching: '{query}' in [{loc if loc else 'Anywhere'}]...")

            # Pass both query and location to our updated Service
            jobs = service.fetch_jobs(query=query, location=loc)

            count_new = 0
            for job in jobs:
                job_id = job.get("job_id")

                # 2. Deduplication: Avoid adding the same job if it appears in multiple searches
                if job_id and job_id not in seen_ids:
                    all_jobs.append(job)
                    seen_ids.add(job_id)
                    count_new += 1

            print(f"✅ Found {count_new} new jobs for this search.")

        except Exception as e:
            print(f"❌ Error fetching {query}: {e}")
            continue

    print(f"\n Sync Complete: Total {len(all_jobs)} unique jobs collected.")
    return all_jobs
