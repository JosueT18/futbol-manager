from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.match_model import Match

from models.team_model import Team

from schemas.match_schema import (
    MatchCreate,
    MatchUpdate
)

router = APIRouter(
    prefix="/matches",
    tags=["Matches"]
)


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
# GET ALL MATCHES
# =========================
@router.get("/")
def get_matches():

    db: Session = SessionLocal()

    matches = (
        db.query(Match)
        .all()
    )

    return matches


# =========================
# GET MATCH
# =========================
@router.get("/{match_id}")
def get_match(match_id: int):

    db: Session = SessionLocal()

    match = (
        db.query(Match)
        .filter(
            Match.id == match_id
        )
        .first()
    )

    return match


# =========================
# CREATE MATCH
# =========================
@router.post("/")
def create_match(
    match: MatchCreate
):

    db: Session = SessionLocal()

    new_match = Match(

        home_team_id=
        match.home_team_id,

        away_team_id=
        match.away_team_id,

        home_score=
        match.home_score,

        away_score=
        match.away_score,

        date=
        match.date,

        stadium=
        match.stadium,

        status=
        match.status,
    )

    db.add(new_match)

    db.commit()

    db.refresh(new_match)

    return new_match


# =========================
# UPDATE MATCH
# =========================
@router.put("/{match_id}")
def update_match(
    match_id: int,
    match_data: MatchUpdate
):

    db: Session = SessionLocal()

    match = (
        db.query(Match)
        .filter(
            Match.id == match_id
        )
        .first()
    )

    if not match:

        return {
            "error": "Partido no encontrado"
        }

    update_data = (
        match_data.dict(
            exclude_unset=True
        )
    )

    for key, value in update_data.items():

        setattr(
            match,
            key,
            value
        )

    db.commit()

    db.refresh(match)

    # =========================
    # UPDATE TEAM STATS
    # =========================
    if match.status == "finished":

        home_team = (
            db.query(Team)
            .filter(
                Team.id ==
                match.home_team_id
            )
            .first()
        )

        away_team = (
            db.query(Team)
            .filter(
                Team.id ==
                match.away_team_id
            )
            .first()
        )

        # PJ
        home_team.pj += 1
        away_team.pj += 1

        # RESULT
        if (
            match.home_score >
            match.away_score
        ):

            home_team.pg += 1
            away_team.pp += 1

        elif (
            match.home_score <
            match.away_score
        ):

            away_team.pg += 1
            home_team.pp += 1

        else:

            home_team.pe += 1
            away_team.pe += 1

        db.commit()

    return match


# =========================
# DELETE MATCH
# =========================
@router.delete("/{match_id}")
def delete_match(
    match_id: int
):

    db: Session = SessionLocal()

    match = (
        db.query(Match)
        .filter(
            Match.id == match_id
        )
        .first()
    )

    if not match:

        return {
            "error": "Partido no encontrado"
        }

    db.delete(match)

    db.commit()

    return {
        "message":
        "Partido eliminado"
    }