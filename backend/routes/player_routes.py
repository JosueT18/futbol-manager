from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.player_model import Player

from schemas.player_schema import PlayerCreate

router = APIRouter()


@router.post("/players")
def create_player(player: PlayerCreate):

    db: Session = SessionLocal()

    new_player = Player(
        name=player.name,
        age=player.age,
        position=player.position,
        number=player.number,
        team_id=player.team_id
    )

    db.add(new_player)

    db.commit()

    db.refresh(new_player)

    return {
        "message": "Jugador creado"
    }


@router.get("/players")
def get_players():

    db: Session = SessionLocal()

    players = db.query(Player).all()

    return players

@router.put("/players/{player_id}/approve")
def approve_player(player_id: int):

    db = SessionLocal()

    player = db.query(Player).filter(Player.id == player_id).first()

    if not player:
        return {"error": "Jugador no encontrado"}

    player.approved = True

    db.commit()

    db.refresh(player)

    return {
        "message": "Jugador aprobado"
    }

@router.delete("/players/{player_id}")
def delete_player(player_id: int):

    db = SessionLocal()

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:
        return {
            "error": "Jugador no encontrado"
        }

    db.delete(player)

    db.commit()

    return {
        "message": "Jugador eliminado"
    }

@router.put("/players/{player_id}")
def update_player(player_id: int, data: dict):

    db = SessionLocal()

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        return {
            "error": "Jugador no encontrado"
        }

    player.name = data.get("name")
    player.position = data.get("position")

    db.commit()

    db.refresh(player)

    return {
        "message": "Jugador actualizado"
    }