import hashlib
from sqlalchemy.orm import Session
from models import Activity


def generate_hash(data):
    raw = f"{data.teacher_id}-{data.activity_type}-{data.created_at}-{data.subject}-{data.class_name}"
    return hashlib.sha256(raw.encode()).hexdigest()


def create_activity(db: Session, activity):
    hash_key = generate_hash(activity)

    existing = db.query(Activity).filter(
        Activity.hash_key == hash_key
    ).first()

    if existing:
        return existing  # duplicate ignored

    db_activity = Activity(
        teacher_id=activity.teacher_id,
        teacher_name=activity.teacher_name,
        activity_type=activity.activity_type,
        created_at=activity.created_at,
        subject=activity.subject,
        class_name=activity.class_name,
        hash_key=hash_key,
    )

    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity
