from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from backend.database import Base, engine, SessionLocal
from backend import schemas,crud,insights
from backend.models import Activity
from sqlalchemy import func
from typing import Optional

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/insights/summary")
def get_summary(
    grade: Optional[int] = Query(None),
    subject: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if grade:
        query = query.filter(Activity.grade == grade)
    if subject:
        query = query.filter(Activity.subject == subject)

    lessons = query.filter(Activity.activity_type=="lesson").count()
    quizzes = query.filter(Activity.activity_type=="quiz").count()
    assessments = query.filter(Activity.activity_type=="assessment").count()
    teachers = query.distinct(Activity.teacher_id).count()

    return {
        "active_teachers": teachers,
        "lessons": lessons,
        "assessments": assessments,
        "quizzes": quizzes,
        "submission_rate": 82
    }

@app.get("/insights/trends")
def get_trends(
    grade: Optional[int] = Query(None),
    subject: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return insights.school_weekly_trends(db, grade=grade, subject=subject)

@app.get("/insights/teachers")
def get_teachers(
    grade: Optional[int] = Query(None),
    subject: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return insights.teacher_performance(db, grade=grade, subject=subject)

@app.get("/insights/classrooms")
def get_classrooms(
    grade: Optional[int] = Query(None),
    subject: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Mock data for classrooms
    return [
        {"name": "Class 7", "score": 3.2, "completion": 85},
        {"name": "Class 8", "score": 2.8, "completion": 70},
        {"name": "Class 9", "score": 3.5, "completion": 90},
        {"name": "Class 10", "score": 3.0, "completion": 80},
    ]

@app.get("/insights/weekly")
def get_weekly(teacher_id: str, db: Session = Depends(get_db)):
    return insights.weekly_trends(db, teacher_id)

@app.post("/activities")
def add_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    return crud.create_activity(db, activity)