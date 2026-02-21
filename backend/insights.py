from sqlalchemy.orm import Session
from models import Activity
from collections import defaultdict
from datetime import datetime


def overview(db: Session):
    data = defaultdict(lambda: {"lessons": 0, "quizzes": 0, "assessments": 0, "name": ""})

    for a in db.query(Activity).all():
        d = data[a.teacher_id]
        d["name"] = a.teacher_name

        if a.activity_type == "lesson":
            d["lessons"] += 1
        elif a.activity_type == "quiz":
            d["quizzes"] += 1
        elif a.activity_type == "assessment":
            d["assessments"] += 1

    result = []
    for tid, d in data.items():
        result.append({
            "teacher_id": tid,
            "teacher_name": d["name"],
            "lessons": d["lessons"],
            "quizzes": d["quizzes"],
            "assessments": d["assessments"]
        })

    return result


def weekly_trends(db: Session, teacher_id: str):
    activities = db.query(Activity).filter(
        Activity.teacher_id == teacher_id
    ).all()

    weekly = defaultdict(lambda: {"lessons": 0, "quizzes": 0, "assessments": 0})

    for a in activities:
        week = a.created_at.strftime("%Y-W%U")

        if a.activity_type == "lesson":
            weekly[week]["lessons"] += 1
        elif a.activity_type == "quiz":
            weekly[week]["quizzes"] += 1
        elif a.activity_type == "assessment":
            weekly[week]["assessments"] += 1

    return [{"week": w, **data} for w, data in weekly.items()]
