from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.player_model import Player
from schemas.player_schema import PlayerCreate

router = APIRouter()


# =========================
# CREATE PLAYER
# =========================
@router.post("/players")
def create_player(
    player: PlayerCreate,
    db: Session = Depends(get_db)
):

    new_player = Player(
        name=player.name,
        age=player.age,
        position=player.position,
        number=player.number,
        team_id=player.team_id,
        status = "pending"
    )

    db.add(new_player)
    db.commit()
    db.refresh(new_player)

    return new_player


# =========================
# GET PLAYERS
# =========================
@router.get("/players")
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()


# =========================
# APPROVE PLAYER
# =========================
@router.put("/players/{player_id}/approve")
def approve_player(
    player_id: int,
    db: Session = Depends(get_db)
):

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:
        return {
            "error": "Jugador no encontrado"
        }

    player.status = "approved"

    player.rejection_reason = None

    db.commit()

    db.refresh(player)

    return player

# =========================
# REJECT PLAYER
# =========================
@router.put("/players/{player_id}/reject")
def reject_player(
    player_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        return {
            "error": "Jugador no encontrado"
        }

    # 🔥 ESTADO REAL
    player.status = "rejected"

    # 🔥 MOTIVO
    player.rejection_reason = data.get(
        "reason",
        ""
    )

    db.commit()

    db.refresh(player)

    return player
# =========================
# DELETE PLAYER
# =========================
@router.delete("/players/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db)):

    player = db.query(Player).filter(Player.id == player_id).first()

    if not player:
        return {"error": "Jugador no encontrado"}

    db.delete(player)
    db.commit()

    return {"message": "Jugador eliminado"}


# =========================
# UPDATE PLAYER
# =========================
@router.put("/players/{player_id}")
def update_player(player_id: int, data: dict, db: Session = Depends(get_db)):

    player = db.query(Player).filter(Player.id == player_id).first()

    if not player:
        return {"error": "Jugador no encontrado"}

    player.name = data.get("name", player.name)
    player.position = data.get("position", player.position)

    db.commit()
    db.refresh(player)

    return player