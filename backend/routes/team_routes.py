from fastapi import APIRouter
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.team_model import Team
from schemas.team_schema import TeamCreate
from fastapi import APIRouter,Body

router = APIRouter()


@router.post("/teams")
def create_team(team: TeamCreate):

    db: Session = SessionLocal()

    new_team = Team(
        name=team.name,
        city=team.city,
        tecnico=team.tecnico
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

@router.delete("/teams/{team_id}")
def delete_team(team_id: int):

    db = SessionLocal()

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:
        return {
            "error": "Equipo no encontrado"
        }

    if team.players:
        return {
            "error": "No se puede eliminar el equipo porque tiene jugadores asociados"
        }

    db.delete(team)

    db.commit()

    return {
        "message": "Equipo eliminado"
    }

@router.put("/teams/{team_id}")
def update_team(
    team_id: int,
    data: dict = Body(...)
    ):

    db = SessionLocal()

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:
        return {
            "error": "Equipo no encontrado"
        }

    team.name = data.get("name")

    team.city = data.get("city")

    team.tecnico = data.get("tecnico")

    db.commit()

    return {
        "message": "Equipo actualizado"
    }