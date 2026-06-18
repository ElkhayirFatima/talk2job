import jwt
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# This enables the "Authorize" button in Swagger UI (Locked Padlock icon)
security = HTTPBearer()

# Fetching configuration from environment variables (Local .env or GitLab CI)
SECRET_KEY = os.getenv("AppSettings__Token")
ISSUER = os.getenv("AppSettings__Issuer")
AUDIENCE = os.getenv("AppSettings__Audience")
ALGORITHM = "HS512"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    JWT Authentication Middleware:
    1. Extracts the token from the Authorization header.
    2. Verifies the signature using the Secret Key.
    3. Validates Issuer and Audience.
    4. Returns the User ID (Subject).
    """

    # Check if Secret Key is properly loaded
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error: Secret Key missing",
        )

    # Extract the actual JWT string from the HTTPBearer object
    token = credentials.credentials

    try:
        # Decode and verify the JWT
        payload = jwt.decode(
            token,
            SECRET_KEY.encode(),
            algorithms=[ALGORITHM],
            issuer=ISSUER,
            audience=AUDIENCE,
        )

        # ASP.NET Identity stores the User ID in this specific URI claim
        # We also check for 'nameid' as a fallback
        user_id = payload.get(
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ) or payload.get("nameid")
        user_name = payload.get(
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        )

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User identifier (UID) not found in token",
            )

        # Return User ID as string (since C# uses GUIDs/Strings for IDs)
        return {
            "id": str(user_id),
            "name": str(user_name) if user_name else "Candidate",
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please login again.",
        )
    except jwt.InvalidTokenError as e:
        # Catch-all for any other JWT issues (wrong signature, issuer, etc.)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}"
        )
