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
    can_manage_player,
    validate_same_team,
)

router = APIRouter()


# =========================
# CREATE PLAYER
# ADMIN + DIRECTOR + TECNICO
# =========================
@router.post("/players")
def create_player(
    player: PlayerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [

        "Administrador",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        player.team_id
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
# FILTER BY ROLE
# =========================
@router.get("/players")
def get_players(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # ADMIN + COMISION
    # VE TODO
    # =========================
    if current_user.role in [

        "Administrador",

        "Comision",
    ]:

        players = db.query(Player).all()

        return players

    # =========================
    # RESTO
    # SOLO SU EQUIPO
    # =========================
    players = db.query(Player).filter(
        Player.team_id ==
        current_user.team_id
    ).all()

    return players


# =========================
# APPROVE PLAYER
# ADMIN + COMISION + DIRECTOR + TECNICO
# =========================
@router.put("/players/{player_id}/approve")
def approve_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [

        "Administrador",

        "Comision",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # PLAYER
    # =========================
    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        player.team_id
    )

    # =========================
    # APPROVE
    # =========================
    player.status = "approved"

    player.rejection_reason = None

    db.commit()

    db.refresh(player)

    return player


# =========================
# REJECT PLAYER
# ADMIN + COMISION + DIRECTOR + TECNICO
# =========================
@router.put("/players/{player_id}/reject")
def reject_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [

        "Administrador",

        "Comision",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # PLAYER
    # =========================
    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        player.team_id
    )

    # =========================
    # REJECT
    # =========================
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
# ADMIN + DIRECTOR + TECNICO
# =========================
@router.delete("/players/{player_id}")
def delete_player(
    player_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [

        "Administrador",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # PLAYER VALIDATION
    # =========================
    player = can_manage_player(
        current_user,
        player_id,
        db
    )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        player.team_id
    )

    db.delete(player)

    db.commit()

    return {
        "message": "Jugador eliminado"
    }


# =========================
# UPDATE PLAYER
# ADMIN + DIRECTOR + TECNICO + COMISION
# =========================
@router.put("/players/{player_id}")
def update_player(
    player_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [

        "Administrador",

        "Director",

        "Tecnico",

        "Comision",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # PLAYER VALIDATION
    # =========================
    player = can_manage_player(
        current_user,
        player_id,
        db
    )

    # =========================
    # NEW VALUES
    # =========================
    new_number = data.get(
        "number",
        player.number
    )

    new_team_id = data.get(
        "team_id",
        player.team_id
    )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        new_team_id
    )

    # =========================
    # VALIDATE NUMBER
    # =========================
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
    if int(
        data.get(
            "age",
            player.age
        )
    ) <= 0:

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
    if "name" in data:

        if not data["name"].strip():

            raise HTTPException(
                status_code=400,
                detail="El nombre es obligatorio"
            )

        player.name = data["name"].strip()

    if "age" in data:

        player.age = int(data["age"])

    if "position" in data:

        if not data["position"].strip():

            raise HTTPException(
                status_code=400,
                detail="La posición es obligatoria"
            )

        player.position = data["position"].strip()

    player.number = int(new_number)

    player.team_id = new_team_id

    # =========================
    # STATS
    # =========================
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

    # =========================
    # VALIDATE NEGATIVE STATS
    # =========================
    stats = [

        player.goals,

        player.yellow_cards,

        player.red_cards,

        player.matches_played,
    ]

    for stat in stats:

        if stat < 0:

            raise HTTPException(
                status_code=400,
                detail="Las estadísticas no pueden ser negativas"
            )

    db.commit()

    db.refresh(player)

    return player