from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.formation_model import Formation
from models.formation_player_model import FormationPlayer
from models.team_model import Team

from schemas.formation_schema import (
    FormationCreate,
    FormationResponse
)

from utils.dependencies import (
    get_current_user,
    validate_same_team,
)

router = APIRouter()


# =========================
# CREATE FORMATION
# =========================
@router.post(
    "/formations",
    response_model=FormationResponse
)
def create_formation(
    formation: FormationCreate,
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
    # VALIDATE TEAM
    # =========================
    team = db.query(Team).filter(
        Team.id == formation.team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        formation.team_id
    )

    # =========================
    # CREATE FORMATION
    # =========================
    new_formation = Formation(

        name=formation.name.strip(),

        tactic=formation.tactic.strip(),

        match_type=formation.match_type.strip(),

        team_id=formation.team_id
    )

    db.add(new_formation)

    db.commit()

    db.refresh(new_formation)

    # =========================
    # PLAYERS
    # =========================
    for player in formation.players:

        formation_player = FormationPlayer(

            formation_id=new_formation.id,

            player_id=player.player_id,

            position_x=player.position_x,

            position_y=player.position_y,

            role=player.role
        )

        db.add(formation_player)

    db.commit()

    db.refresh(new_formation)

    return new_formation


# =========================
# GET FORMATIONS
# =========================
@router.get(
    "/formations",
    response_model=list[FormationResponse]
)
def get_formations(
    db: Session = Depends(get_db)
):

    formations = db.query(
        Formation
    ).all()

    return formations


# =========================
# GET FORMATION
# =========================
@router.get(
    "/formations/{formation_id}",
    response_model=FormationResponse
)
def get_formation(
    formation_id: int,
    db: Session = Depends(get_db)
):

    formation = db.query(
        Formation
    ).filter(
        Formation.id == formation_id
    ).first()

    if not formation:

        raise HTTPException(
            status_code=404,
            detail="Formación no encontrada"
        )

    return formation


# =========================
# UPDATE FORMATION
# =========================
@router.put(
    "/formations/{formation_id}",
    response_model=FormationResponse
)
def update_formation(
    formation_id: int,
    formation_data: FormationCreate,
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
    # GET FORMATION
    # =========================
    formation = db.query(
        Formation
    ).filter(
        Formation.id == formation_id
    ).first()

    if not formation:

        raise HTTPException(
            status_code=404,
            detail="Formación no encontrada"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        formation.team_id
    )

    # =========================
    # UPDATE FORMATION
    # =========================
    formation.name = formation_data.name.strip()

    formation.tactic = formation_data.tactic.strip()

    formation.match_type = (
        formation_data.match_type.strip()
    )

    formation.team_id = (
        formation_data.team_id
    )

    # =========================
    # DELETE OLD PLAYERS
    # =========================
    db.query(
        FormationPlayer
    ).filter(
        FormationPlayer.formation_id
        ==
        formation.id
    ).delete()

    # =========================
    # ADD NEW PLAYERS
    # =========================
    for player in formation_data.players:

        new_player = FormationPlayer(

            formation_id=formation.id,

            player_id=player.player_id,

            position_x=player.position_x,

            position_y=player.position_y,

            role=player.role
        )

        db.add(new_player)

    db.commit()

    db.refresh(formation)

    return formation


# =========================
# DELETE FORMATION
# =========================
@router.delete(
    "/formations/{formation_id}"
)
def delete_formation(
    formation_id: int,
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
    # GET FORMATION
    # =========================
    formation = db.query(
        Formation
    ).filter(
        Formation.id == formation_id
    ).first()

    if not formation:

        raise HTTPException(
            status_code=404,
            detail="Formación no encontrada"
        )

    # =========================
    # SAME TEAM VALIDATION
    # =========================
    validate_same_team(
        current_user,
        formation.team_id
    )

    # =========================
    # DELETE FORMATION
    # =========================
    db.delete(formation)

    db.commit()

    return {
        "message":
        "Formación eliminada correctamente"
    }