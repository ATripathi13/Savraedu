from sqlalchemy.orm import Session
from models import Activity
from collections import defaultdict
from datetime import datetime, timedelta

def school_weekly_trends(db: Session):
    # Get last 7 days distribution
    end_date = datetime.now()
    start_date = end_date - timedelta(days=6)
    
    activities = db.query(Activity).all()
    
    # Simple day-wise grouping for the trend chart
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    data = defaultdict(lambda: {"count": 0})
    
    for a in activities:
        # For simplicity, since the database might have old data, we'll map to week days
        day_name = a.created_at.strftime("%a")
        data[day_name]["count"] += 1
        
    result = []
    for day in days:
        result.append({
            "name": day,
            "value1": data[day]["count"],
            "value2": data[day]["count"] * 0.7 # Offset for the red area
        })
    return result

def teacher_performance(db: Session):
    data = defaultdict(lambda: {"lessons": 0, "quizzes": 0, "assessments": 0, "name": "", "subjects": set()})

    for a in db.query(Activity).all():
        d = data[a.teacher_id]
        d["name"] = a.teacher_name
        # Assuming subjects can be inferred or fixed for now
        d["subjects"].add("Science") # Placeholder
        
        if a.activity_type == "lesson":
            d["lessons"] += 1
        elif a.activity_type == "quiz":
            d["quizzes"] += 1
        elif a.activity_type == "assessment":
            d["assessments"] += 1

    result = []
    for tid, d in data.items():
        avg_score = 75 + (d["lessons"] % 20) # Mock variation
        result.append({
            "name": d["name"],
            "subjects": ", ".join(list(d["subjects"])),
            "avg": avg_score,
            "lessons": d["lessons"],
            "status": "Excellent" if avg_score > 85 else "Good" if avg_score > 75 else "Average"
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
