from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.player_model import Player

from schemas.player_schema import PlayerCreate

from utils.dependencies import (
    admin_required,
    director_required,
    commission_required,
)

router = APIRouter()


# =========================
# CREATE PLAYER
# ADMIN + DIRECTOR
# =========================
@router.post("/players")
def create_player(
    player: PlayerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        director_required
    )
):

    # =========================
    # VALIDATE NUMBER
    # =========================
    existing_number = db.query(Player).filter(
        Player.team_id == player.team_id,
        Player.number == player.number
    ).first()

    if existing_number:

        raise HTTPException(
            status_code=400,
            detail="El número ya existe en este equipo"
        )

    # =========================
    # VALIDATE POSITIVE
    # =========================
    if player.age <= 0:

        raise HTTPException(
            status_code=400,
            detail="La edad debe ser positiva"
        )

    if player.number <= 0:

        raise HTTPException(
            status_code=400,
            detail="El número debe ser positivo"
        )

    # =========================
    # CREATE PLAYER
    # =========================
    new_player = Player(

        name=player.name.strip(),

        age=player.age,

        position=player.position.strip(),

        number=player.number,

        team_id=player.team_id,

        # =========================
        # ALWAYS PENDING
        # =========================
        status="pending",

        rejection_reason=None,

        # =========================
        # INITIAL STATS
        # =========================
        goals=0,

        yellow_cards=0,

        red_cards=0,

        matches_played=0
    )

    db.add(new_player)

    db.commit()

    db.refresh(new_player)

    return new_player


# =========================
# GET PLAYERS
# PUBLIC
# =========================
@router.get("/players")
def get_players(
    db: Session = Depends(get_db)
):

    players = db.query(Player).all()

    return players


# =========================
# APPROVE PLAYER
# ADMIN + COMMISSION
# =========================
@router.put("/players/{player_id}/approve")
def approve_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        commission_required
    )
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
# ADMIN + COMMISSION
# =========================
@router.put("/players/{player_id}/reject")
def reject_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        commission_required
    )
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
# ADMIN ONLY
# =========================
@router.delete("/players/{player_id}")
def delete_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        admin_required
    )
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
# ADMIN + DIRECTOR
# =========================
@router.put("/players/{player_id}")
def update_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        director_required
    )
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
    # VALIDATE NUMBER
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
    # VALIDATE POSITIVE
    # =========================
    if int(data.get("age", player.age)) <= 0:

        raise HTTPException(
            status_code=400,
            detail="La edad debe ser positiva"
        )

    if int(new_number) <= 0:

        raise HTTPException(
            status_code=400,
            detail="El número debe ser positivo"
        )

    # =========================
    # BASIC DATA
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

    # =========================
    # STATS
    # ONLY IF PRESENT
    # =========================
    if "goals" in data:

        player.goals = data.get(
            "goals",
            player.goals
        )

    if "yellow_cards" in data:

        player.yellow_cards = data.get(
            "yellow_cards",
            player.yellow_cards
        )

    if "red_cards" in data:

        player.red_cards = data.get(
            "red_cards",
            player.red_cards
        )

    if "matches_played" in data:

        player.matches_played = data.get(
            "matches_played",
            player.matches_played
        )

    db.commit()

    db.refresh(player)

    return player