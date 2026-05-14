from fastapi import APIRouter

from database.connection import SessionLocal

from models.formation_model import Formation
from models.formation_player_model import FormationPlayer
from models.player_model import Player


router = APIRouter()


@router.post("/formations")
def create_formation(data: dict):

    db = SessionLocal()

    formation = Formation(

        name=data.get("name"),

        players_per_team=data.get(
            "players_per_team"
        ),

        team_id=data.get("team_id")
    )

    db.add(formation)

    db.commit()

    db.refresh(formation)

    return {
        "message": "Formación creada",
        "formation_id": formation.id
    }


@router.get("/formations")
def get_formations():

    db = SessionLocal()

    formations = db.query(
        Formation
    ).all()

    return formations

@router.post("/formation-players")
def add_player_to_formation(data: dict):

    db = SessionLocal()

    formation = db.query(Formation).filter(
        Formation.id == data.get("formation_id")
    ).first()

    player = db.query(Player).filter(
        Player.id == data.get("player_id")
    ).first()

    if not formation:
        return {
            "error": "Formación no encontrada"
        }

    if not player:
        return {
            "error": "Jugador no encontrado"
        }

    if player.team_id != formation.team_id:
        return {
            "error": "El jugador no pertenece al equipo"
        }

    formation_player = FormationPlayer(

        formation_id=data.get("formation_id"),

        player_id=data.get("player_id"),

        is_starter=data.get("is_starter"),

        position=data.get("position")
    )

    db.add(formation_player)

    db.commit()

    db.refresh(formation_player)

    return {
        "message": "Jugador agregado a formación"
    }