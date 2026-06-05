from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.connection import get_db

from models.match_model import Match
from models.team_model import Team
from models.match_event_model import MatchEvent

from schemas.match_schema import (
    MatchCreate,
    MatchUpdate,
)

from utils.dependencies import (
    get_current_user,
)

router = APIRouter()


# =========================
# CREATE MATCH
# =========================
@router.post("/matches")
def create_match(
    match: MatchCreate,
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

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    # =========================
    # VALIDATE TEAMS
    # =========================
    if (
        match.home_team_id ==
        match.away_team_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Un equipo no puede jugar contra sí mismo"
        )

    # =========================
    # VALIDATE EXIST
    # =========================
    home_team = db.query(Team).filter(
        Team.id == match.home_team_id
    ).first()

    away_team = db.query(Team).filter(
        Team.id == match.away_team_id
    ).first()

    if not home_team or not away_team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    # =========================
    # CREATE MATCH
    # =========================
    new_match = Match(

        home_team_id=
            match.home_team_id,

        away_team_id=
            match.away_team_id,

        round_number=
            match.round_number,

        match_date=
            match.match_date,

        stadium=
            match.stadium,

        home_score=0,

        away_score=0,

        status="scheduled",
    )

    db.add(new_match)

    db.commit()

    db.refresh(new_match)

    return new_match


# =========================
# GET MATCHES
# =========================
@router.get("/matches")
def get_matches(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    matches = db.query(Match).all()

    result = []

    for match in matches:

        # =========================
        # EVENTS
        # =========================
        events = []

        for event in match.events:

            player_name = ""

            if event.player:

                player_name = (
                    f"{event.player.name} "
                    f"{event.player.lastname}"
                )

            events.append({

                "id":
                    event.id,

                "event_type":
                    event.event_type,

                "minute":
                    event.minute,

                "player_id":
                    event.player_id,

                "player_name":
                    player_name,

                "team_id":
                    event.team_id,
            })

        result.append({

            "id":
                match.id,

            "home_team_id":
                match.home_team_id,

            "away_team_id":
                match.away_team_id,

            "home_team":
                match.home_team.name
                if match.home_team
                else "",

            "away_team":
                match.away_team.name
                if match.away_team
                else "",

            "home_logo":
                match.home_team.logo
                if match.home_team
                else None,

            "away_logo":
                match.away_team.logo
                if match.away_team
                else None,

            "round_number":
                match.round_number,

            "match_date":
                match.match_date,

            "stadium":
                match.stadium,

            "home_score":
                match.home_score,

            "away_score":
                match.away_score,

            "status":
                match.status,

            # =========================
            # EVENTS
            # =========================
            "events":
                events,
        })

    # =========================
    # ORDER FIXTURE
    # =========================
    result.sort(
        key=lambda x: (
            x["round_number"],
            x["match_date"]
            if x["match_date"]
            else ""
        )
    )

    return result


# =========================
# UPDATE MATCH
# =========================
@router.put("/matches/{match_id}")
def update_match(
    match_id: int,
    data: MatchUpdate,
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

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        raise HTTPException(
            status_code=404,
            detail="Partido no encontrado"
        )

    # =========================
    # TECNICO ONLY OWN TEAM
    # =========================
    if current_user.role == "Tecnico":

        if current_user.team_id not in [

            match.home_team_id,

            match.away_team_id,
        ]:

            raise HTTPException(
                status_code=403,
                detail="No puedes editar este partido"
            )

    # =========================
    # UPDATE
    # =========================
    match.home_score = data.home_score

    match.away_score = data.away_score

    match.status = data.status

    db.commit()

    db.refresh(match)

    return match