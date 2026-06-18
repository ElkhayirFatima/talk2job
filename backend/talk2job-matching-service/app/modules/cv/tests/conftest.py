import pytest
import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.main import app

os.environ["UPLOAD_DIR"] = "tests/test_storage"
os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"

# 1. Setup a Test Database (SQLite is fastest for unit tests)
TEST_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 2. Setup a Temporary Upload Folder
TEST_UPLOAD_DIR = "tests/test_storage"


@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    # Setup: Create folder and database tables
    if not os.path.exists(TEST_UPLOAD_DIR):
        os.makedirs(TEST_UPLOAD_DIR)
    Base.metadata.create_all(bind=engine)

    yield  # --- This is where the tests run ---

    # Teardown: Clean up everything after tests are done
    if os.path.exists(TEST_UPLOAD_DIR):
        shutil.rmtree(TEST_UPLOAD_DIR)
    if os.path.exists("test_temp.db"):
        os.remove("test_temp.db")


@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


# 3. Override the FastAPI dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
