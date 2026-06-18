import httpx
import logging

logger = logging.getLogger(__name__)


def check_url_status(url: str) -> bool:
    """
    Performs an HTTP request to verify if a job URL is still alive.
    Optimized to use HEAD requests first, with a streaming GET fallback.
    """
    if not url:
        return False

    # Use a standard browser User-Agent to avoid getting immediately blocked by CDNs (like Cloudflare)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        with httpx.Client(timeout=10.0, follow_redirects=True) as client:
            # 1. Attempt a lightweight HEAD request first (fetches headers only, no body)
            response = client.head(url, headers=headers)

            # 2. Handle servers that explicitly block HEAD requests (returning 403 Forbidden or 405 Method Not Allowed)
            if response.status_code in [403, 405]:
                # Fallback to GET, but stream the response to close the connection immediately after receiving headers
                with client.stream("GET", url, headers=headers) as get_resp:
                    return get_resp.status_code == 200

            # 3. URL is active and accessible
            if response.status_code == 200:
                return True

            # 4. 404 Not Found or 410 Gone indicate the job listing is permanently deleted
            if response.status_code in [404, 410]:
                return False

            # For any other status codes (e.g., 500, 503), give the benefit of the doubt to avoid false deactivations
            return True

    except httpx.RequestError as exc:
        # If the external site is temporarily down or times out, log the error and keep the job active
        logger.error(f"Network error or timeout while checking URL {url}: {exc}")
        return True
