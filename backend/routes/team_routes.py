from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from database.connection import get_db

from models.team_model import Team

from schemas.team_schema import TeamCreate


router = APIRouter()


@router.post("/teams")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db)
):

    new_team = Team(
        name=team.name,
        city=team.city,
        tecnico=team.tecnico,
        pj=team.pj,
        pg=team.pg,
        pe=team.pe,
        pp=team.pp,
        points=team.points
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return {
        "message": "Equipo creado"
    }


@router.get("/teams")
def get_teams(
    db: Session = Depends(get_db)
):

    teams = db.query(Team).all()

    for team in teams:

        team.players = [
            player
            for player in team.players
            if player.status == "approved"
        ]

    return teams


@router.delete("/teams/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db)
):

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
    data: dict = Body(...),
    db: Session = Depends(get_db)
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:
        return {
            "error": "Equipo no encontrado"
        }

    team.name = data.get(
    "name",
    team.name
    )

    team.city = data.get(
    "city",
    team.city
    )

    team.tecnico = data.get(
    "tecnico",
    team.tecnico
    )

    team.pj = data.get(
    "pj",
    team.pj
    )

    team.pg = data.get(
    "pg",
    team.pg
    )

    team.pe = data.get(
    "pe",
    team.pe
    )

    team.pp = data.get(
    "pp",
    team.pp
    )

# CALCULAR PUNTOS
    team.points = (
    (team.pg * 3)
    +
    team.pe
    )

    db.commit()

    return {
        "message": "Equipo actualizado"
    }