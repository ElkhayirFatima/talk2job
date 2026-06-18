from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)


def test_upload_cv_success():
    file_path = "tests/samples/test_pdf.pdf"

    # On s'assure que le dossier existe pour le test
    with open(file_path, "rb") as f:

        response = client.post(
            "/api/v1/parsing/parse",
            files={"file": ("test_pdf.pdf", f, "application/pdf")},
        )

    if response.status_code != 200:
        print(f"DEBUG: Status {response.status_code}")
        print(f"DEBUG: Body {response.json()}")

    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["status"] == "stored_and_parsed"
