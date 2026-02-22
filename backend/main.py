from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import schemas 
import crud
import insights
from models import Activity
from sqlalchemy import func

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
def get_summary(db: Session = Depends(get_db)):
    lessons = db.query(Activity).filter(Activity.activity_type=="lesson").count()
    quizzes = db.query(Activity).filter(Activity.activity_type=="quiz").count()
    assessments = db.query(Activity).filter(Activity.activity_type=="assessment").count()
    teachers = db.query(Activity.teacher_id).distinct().count()

    return {
        "active_teachers": teachers,
        "lessons": lessons,
        "assessments": assessments,
        "quizzes": quizzes,
        "submission_rate": 82
    }

@app.get("/insights/trends")
def get_trends(db: Session = Depends(get_db)):
    return insights.school_weekly_trends(db)

@app.get("/insights/teachers")
def get_teachers(db: Session = Depends(get_db)):
    return insights.teacher_performance(db)

@app.get("/insights/classrooms")
def get_classrooms(db: Session = Depends(get_db)):
    # Mock data for classrooms for now as it's not and Activity schema property directly
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