from fastapi import APIRouter

from sqlalchemy.orm import Session

from database.connection import SessionLocal

from models.match_model import Match

from models.team_model import Team

from schemas.match_schema import (
    MatchCreate,
    MatchUpdate
)

router = APIRouter()


# =========================
# GET DB
# =========================
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# =========================
# GET MATCHES
# =========================
@router.get("/matches")
def get_matches():

    db: Session = SessionLocal()

    matches = db.query(Match).all()

    return matches


# =========================
# CREATE MATCH
# =========================
@router.post("/matches")
def create_match(
    match: MatchCreate
):

    db: Session = SessionLocal()

    new_match = Match(

        home_team_id=
        match.home_team_id,

        away_team_id=
        match.away_team_id,

        stadium=
        match.stadium,

        tournament=
        match.tournament,

        match_date=
        match.match_date,
    )

    db.add(new_match)

    db.commit()

    db.refresh(new_match)

    return new_match


# =========================
# UPDATE MATCH RESULT
# =========================
@router.put("/matches/{match_id}")
def update_match(
    match_id: int,
    data: MatchUpdate
):

    db: Session = SessionLocal()

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        return {
            "error": "Partido no encontrado"
        }

    # =========================
    # UPDATE MATCH
    # =========================
    match.home_score = data.home_score

    match.away_score = data.away_score

    match.status = data.status

    # =========================
    # TEAMS
    # =========================
    home_team = db.query(Team).filter(
        Team.id == match.home_team_id
    ).first()

    away_team = db.query(Team).filter(
        Team.id == match.away_team_id
    ).first()

    # =========================
    # UPDATE PJ
    # =========================
    home_team.pj += 1

    away_team.pj += 1

    # =========================
    # WINNER
    # =========================
    if data.home_score > data.away_score:

        home_team.pg += 1

        away_team.pp += 1

        home_team.points += 3

    elif data.home_score < data.away_score:

        away_team.pg += 1

        home_team.pp += 1

        away_team.points += 3

    else:

        home_team.pe += 1

        away_team.pe += 1

        home_team.points += 1

        away_team.points += 1

    db.commit()

    return {
        "message": "Partido actualizado correctamente"
    }


# =========================
# DELETE MATCH
# =========================
@router.delete("/matches/{match_id}")
def delete_match(
    match_id: int
):

    db: Session = SessionLocal()

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        return {
            "error": "Partido no encontrado"
        }

    db.delete(match)

    db.commit()

    return {
        "message": "Partido eliminado"
    }