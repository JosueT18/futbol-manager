from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.formation_model import Formation
from models.formation_player_model import FormationPlayer

from schemas.formation_schema import (
    FormationCreate,
    FormationResponse
)

router = APIRouter()


# =========================
# DB
# =========================
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# =========================
# CREATE FORMATION
# =========================
@router.post(
    "/formations",
    response_model=FormationResponse
)
def create_formation(
    formation: FormationCreate,
    db: Session = Depends(get_db)
):

    new_formation = Formation(

        name=formation.name,

        tactic=formation.tactic,

        match_type=formation.match_type,

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

    # =========================
    # UPDATE FORMATION
    # =========================
    formation.name = formation_data.name

    formation.tactic = formation_data.tactic

    formation.match_type = (
        formation_data.match_type
    )

    formation.team_id = formation_data.team_id

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

    db.delete(formation)

    db.commit()

    return {
        "message":
        "Formación eliminada correctamente"
    }