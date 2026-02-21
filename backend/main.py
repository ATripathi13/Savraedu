from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import schemas 
import crud
import insights
from models import Activity

Base.metadata.create_all(bind=engine)

app = FastAPI()


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
