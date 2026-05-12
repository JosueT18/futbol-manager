from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.team_model import Team

from schemas.team_schema import TeamCreate

router = APIRouter()


@router.post("/teams")
def create_team(team: TeamCreate):

    db: Session = SessionLocal()

    new_team = Team(
        name=team.name,
        city=team.city
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return {
        "message": "Equipo creado"
    }


@router.get("/teams")
def get_teams():

    db: Session = SessionLocal()

    teams = db.query(Team).all()

    return teams