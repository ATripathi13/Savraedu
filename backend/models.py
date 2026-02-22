from sqlalchemy import Column, String, DateTime, Integer
from backend.database import Base
import uuid

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = Column(String, index=True)
    teacher_name = Column(String)
    activity_type = Column(String)  # lesson / quiz / assessment
    created_at = Column(DateTime)
    subject = Column(String)
    grade = Column(Integer)

    # Prevent duplicate entries
    hash_key = Column(String, unique=True, index=True)
