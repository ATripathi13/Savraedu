from pydantic import BaseModel
from datetime import datetime

class ActivityCreate(BaseModel):
    teacher_id: str
    teacher_name: str
    activity_type: str
    created_at: datetime
    subject: str
    grade: int
