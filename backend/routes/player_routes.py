from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.player_model import Player

from schemas.player_schema import (
    PlayerCreate,
)

from utils.dependencies import (
    get_current_user,
)

router = APIRouter()


# =========================
# CREATE PLAYER
# ADMIN ONLY
# =========================
@router.post("/players")
def create_player(
    player: PlayerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "Administrador":

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
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
    # CREATE PLAYER
    # =========================
    new_player = Player(

        name=player.name.strip(),

        lastname=player.lastname.strip(),

        age=player.age,

        position=player.position.strip(),

        number=player.number,

        team_id=player.team_id,

        status="pending",

        rejection_reason=None,

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
# TODOS PUEDEN VER
# =========================
@router.get("/players")
def get_players(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Administrador ve todo
    if current_user.role == "Administrador":

        return db.query(Player).all()

    # Director, Tecnico, Comision y Jugador
    return db.query(Player).filter(
        Player.team_id == current_user.team_id
    ).all()    


# =========================
# APPROVE PLAYER
# ADMIN + COMISION + DIRECTOR
# =========================
@router.put("/players/{player_id}/approve")
def approve_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",        
        "Director",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:        

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )
    
    if current_user.role != "Administrador":

        if player.team_id != current_user.team_id:

            raise HTTPException(
                status_code=403,
                detail="No puedes gestionar jugadores de otro equipo"
        )

    player.status = "approved"

    player.rejection_reason = None

    db.commit()

    db.refresh(player)

    return player


# =========================
# REJECT PLAYER
# ADMIN + COMISION + DIRECTOR
# =========================
@router.put("/players/{player_id}/reject")
def reject_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",       
        "Director",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )
    if current_user.role != "Administrador":

        if player.team_id != current_user.team_id:

            raise HTTPException(
                status_code=403,
                detail="No puedes gestionar jugadores de otro equipo"
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
    current_user=Depends(get_current_user)
):

    if current_user.role != "Administrador":

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

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
# ADMIN ONLY
# =========================
@router.put("/players/{player_id}")
def update_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "Administrador":

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

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
    # UPDATE DATA
    # =========================
    if "name" in data:

        player.name = data["name"].strip()

    if "lastname" in data:

        player.lastname = data["lastname"].strip()

    if "age" in data:

        player.age = int(data["age"])

    if "position" in data:

        player.position = data["position"].strip()

    if "number" in data:

        player.number = int(data["number"])

    if "team_id" in data:

        player.team_id = int(data["team_id"])

    if "goals" in data:

        player.goals = int(data["goals"])

    if "yellow_cards" in data:

        player.yellow_cards = int(data["yellow_cards"])

    if "red_cards" in data:

        player.red_cards = int(data["red_cards"])

    if "matches_played" in data:

        player.matches_played = int(
            data["matches_played"]
        )

    db.commit()

    db.refresh(player)

    return player