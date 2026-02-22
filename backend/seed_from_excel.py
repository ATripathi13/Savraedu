import pandas as pd
from pathlib import Path
from backend.database import SessionLocal
from backend.models import Activity
import hashlib


BASE_DIR = Path(__file__).resolve().parent
FILE_PATH = BASE_DIR / "activities.xlsx"


def seed_from_excel():
    db = SessionLocal()

    if db.query(Activity).first():
        print("✅ Data already exists — skipping seed")
        db.close()
        return

    print("📥 Reading Excel file...")

    if not FILE_PATH.exists():
        print("❌ Excel file not found")
        db.close()
        return

    df = pd.read_excel(FILE_PATH)
    df.columns = [c.lower() for c in df.columns]
    df["created_at"] = pd.to_datetime(df["created_at"])

    for _, row in df.iterrows():
        data = row.to_dict()

        hash_key = hashlib.md5(str(data).encode()).hexdigest()

        activity = Activity(
            teacher_id=data["teacher_id"],
            teacher_name=data["teacher_name"],
            activity_type=data["activity_type"],
            subject=data["subject"],
            grade=data["grade"],
            created_at=data["created_at"],
            hash_key=hash_key,
        )

        db.add(activity)

    db.commit()
    db.close()

    print("✅ Excel seed completed")
