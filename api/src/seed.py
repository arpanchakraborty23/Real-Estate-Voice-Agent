import csv
from sqlalchemy.orm import Session
from .services.database import SessionLocal
from .config.models import Builder, Property


CSV_PATH = "recommandation-system/data/client_data.csv"


def seed_database():
    db: Session = SessionLocal()

    try:
        with open(CSV_PATH, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                builder = db.query(Builder).filter_by(builder_id=row['builder_id']).first()
                if not builder:
                    builder = Builder(
                        builder_id=row['builder_id'],
                        builder_name=row['builder_name'],
                        builder_phone=row['builder_phone'],
                        builder_email=row['builder_email'],
                    )
                    db.add(builder)

                property = Property(
                    property_id=row['property_id'],
                    builder_id=row['builder_id'],
                    project_name=row['project_name'],
                    property_type=row['property_interest'],
                    bedrooms=int(row['bedroom_count']),
                    location=row['location'],
                    price=float(row['price']),
                    status=row['status'],
                    amenities=row['amenities'],
                    description=row['note'],
                )
                db.add(property)

        db.commit()
        print("Database seeded successfully from CSV.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
