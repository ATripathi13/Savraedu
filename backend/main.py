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


@app.post("/activities")
def add_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    return crud.create_activity(db, activity)


@app.get("/insights/overview")
def get_overview(db: Session = Depends(get_db)):
    return insights.overview(db)


@app.get("/insights/weekly")
def get_weekly(teacher_id: str, db: Session = Depends(get_db)):
    return insights.weekly_trends(db, teacher_id)


@app.get("/summary")
def summary(db: Session = Depends(get_db)):
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