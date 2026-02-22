import pandas as pd
from backend.database import SessionLocal
from backend.crud import create_activity
from backend.schemas import ActivityCreate

FILE_PATH = "activities.xlsx"

db = SessionLocal()

print("📥 Reading Excel file...")
df = pd.read_excel(FILE_PATH)

print("Columns found:", list(df.columns))
print(f"✅ Loaded {len(df)} rows")

success = 0
duplicates = 0
errors = 0

for index, row in df.iterrows():
    try:
        activity = ActivityCreate(
            teacher_id=str(row["Teacher_id"]),
            teacher_name=str(row["Teacher_name"]),
            activity_type=str(row["Activity_type"]).strip().lower(),
            created_at=pd.to_datetime(row["Created_at"]),
            subject=str(row["Subject"]),
            grade=int(row["Grade"]),
        )

        result = create_activity(db, activity)

        if result:
            success += 1
        else:
            duplicates += 1

    except Exception as e:
        print(f"❌ Row {index} failed:", e)
        errors += 1

print("\n🎯 Import Summary")
print("Inserted:", success)
print("Duplicates skipped:", duplicates)
print("Errors:", errors)
