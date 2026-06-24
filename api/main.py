import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from api.src.services.database import SessionLocal, engine
from api.src.config.models import Base
from src.seed import seed_database


def test_database_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[PASS] Database connection")
    except Exception as e:
        print(f"[FAIL] Database connection: {e}")
        raise


def test_tables_exist():
    try:
        Base.metadata.create_all(bind=engine)
        inspector = __import__("sqlalchemy", fromlist=["inspect"]).inspect(engine)
        tables = inspector.get_table_names()
        assert "builders" in tables, "builders table missing"
        assert "properties" in tables, "properties table missing"
        print(f"[PASS] Tables created: {tables}")
    except Exception as e:
        print(f"[FAIL] Tables creation: {e}")
        raise


def test_seed():
    try:
        seed_database()
        db = SessionLocal()
        count = db.query(__import__("src.models", fromlist=["Property"]).Property).count()
        assert count > 0, f"No properties seeded (got {count})"
        print(f"[PASS] Seeded {count} properties")
        db.close()
    except Exception as e:
        print(f"[FAIL] Seed: {e}")
        raise


def test_query():
    try:
        db = SessionLocal()
        Property = __import__("src.models", fromlist=["Property"]).Property
        apts = db.query(Property).filter_by(property_type="Apartment").count()
        villas = db.query(Property).filter_by(property_type="Villa").count()
        print(f"[PASS] Query: {apts} apartments, {villas} villas")
        db.close()
    except Exception as e:
        print(f"[FAIL] Query: {e}")
        raise


def main():
    print("=" * 40)
    print("Running tests for recommendation-system")
    print("=" * 40)
    tests = [
        test_database_connection,
        test_tables_exist,
        test_seed,
        test_query,
    ]
    for test in tests:
        test()
    print("=" * 40)
    print("All tests passed!")
    print("=" * 40)


if __name__ == "__main__":
    main()
