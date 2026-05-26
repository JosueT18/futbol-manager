from fastapi import APIRouter, Depends, HTTPException
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

    # VALIDAR NUMERO REPETIDO
    existing_number = db.query(Player).filter(
        Player.team_id == player.team_id,
        Player.number == player.number
    ).first()

    if existing_number:

        raise HTTPException(
            status_code=400,
            detail="El número ya existe en este equipo"
        )

    new_player = Player(
        name=player.name,
        age=player.age,
        position=player.position,
        number=player.number,
        team_id=player.team_id,

        # NUEVOS JUGADORES
        # ENTRAN APROBADOS
        status="pending",

        goals=player.goals or 0,
        yellow_cards=player.yellow_cards or 0,
        red_cards=player.red_cards or 0,
        matches_played=0
    )

    db.add(new_player)

    db.commit()

    db.refresh(new_player)

    return new_player


# =========================
# GET PLAYERS
# =========================
@router.get("/players")
def get_players(
    db: Session = Depends(get_db)
):

    players = db.query(Player).all()

    return players


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

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

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

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    player.status = "rejected"

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
def delete_player(
    player_id: int,
    db: Session = Depends(get_db)
):

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    db.delete(player)

    db.commit()

    return {
        "message": "Jugador eliminado"
    }


# =========================
# UPDATE PLAYER
# =========================
@router.put("/players/{player_id}")
def update_player(
    player_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    # =========================
    # VALIDAR NUMERO REPETIDO
    # =========================
    new_number = data.get(
        "number",
        player.number
    )

    new_team_id = data.get(
        "team_id",
        player.team_id
    )

    existing_number = db.query(Player).filter(
        Player.id != player_id,
        Player.team_id == new_team_id,
        Player.number == new_number
    ).first()

    if existing_number:

        raise HTTPException(
            status_code=400,
            detail="El número ya existe en este equipo"
        )

    # =========================
    # UPDATE DATA
    # =========================
    player.name = data.get(
        "name",
        player.name
    )

    player.age = data.get(
        "age",
        player.age
    )

    player.position = data.get(
        "position",
        player.position
    )

    player.number = new_number

    player.team_id = new_team_id

    player.goals = data.get(
        "goals",
        player.goals
    )

    player.yellow_cards = data.get(
        "yellow_cards",
        player.yellow_cards
    )

    player.red_cards = data.get(
        "red_cards",
        player.red_cards
    )

    player.matches_played = data.get(
        "matches_played",
        player.matches_played
    )

    db.commit()

    db.refresh(player)

    return player