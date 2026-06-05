from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.connection import get_db

from models.match_event_model import MatchEvent
from models.match_model import Match
from models.player_model import Player

from schemas.match_event_schema import (
    MatchEventCreate
)

from utils.dependencies import (
    get_current_user
)

router = APIRouter()


# =========================
# CREATE EVENT
# =========================
@router.post("/match-events")
def create_match_event(
    data: MatchEventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # =========================
    # VALIDATE ROLE
    # =========================
    if current_user.role not in [
        "Administrador",
        "Comision",
        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # MATCH
    # =========================
    match = db.query(Match).filter(
        Match.id == data.match_id
    ).first()

    if not match:

        raise HTTPException(
            status_code=404,
            detail="Partido no encontrado"
        )

    # =========================
    # PLAYER
    # =========================
    player = db.query(Player).filter(
        Player.id == data.player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Jugador no encontrado"
        )

    # =========================
    # CREATE EVENT
    # =========================
    event = MatchEvent(

        match_id=data.match_id,

        player_id=data.player_id,

        team_id=data.team_id,

        event_type=data.event_type,

        minute=data.minute,
    )

    db.add(event)

    # =========================
    # UPDATE SCORE AUTOMATIC
    # =========================
    if data.event_type == "goal":

        # LOCAL
        if data.team_id == match.home_team_id:

            match.home_score = (
                match.home_score or 0
            ) + 1

        # VISITANTE
        elif data.team_id == match.away_team_id:

            match.away_score = (
                match.away_score or 0
            ) + 1

    db.commit()

    db.refresh(event)

    return event


# =========================
# GET EVENTS BY MATCH
# =========================
@router.get("/match-events/{match_id}")
def get_match_events(
    match_id: int,
    db: Session = Depends(get_db)
):

    events = db.query(MatchEvent).filter(
        MatchEvent.match_id == match_id
    ).all()

    result = []

    for event in events:

        result.append({

            "id":
                event.id,

            "match_id":
                event.match_id,

            "player_id":
                event.player_id,

            "team_id":
                event.team_id,

            "event_type":
                event.event_type,

            "minute":
                event.minute,

            "player": {

                "id":
                    event.player.id,

                "name":
                    event.player.name,

                "lastname":
                    event.player.lastname,
            }
            if event.player else None
        })

    return result