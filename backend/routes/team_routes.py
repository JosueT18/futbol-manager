from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Body,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

import shutil
import uuid
import os

from database.connection import get_db

from models.team_model import Team

from schemas.team_schema import TeamCreate

from utils.dependencies import (
    admin_required,
    director_required,
)

router = APIRouter()


# =========================
# CREATE TEAM
# ADMIN + DIRECTOR
# =========================
@router.post("/teams")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        director_required
    )
):

    # =========================
    # VALIDATE NAME
    # =========================
    existing_team = db.query(Team).filter(
        Team.name == team.name
    ).first()

    if existing_team:

        raise HTTPException(
            status_code=400,
            detail="El equipo ya existe"
        )

    # =========================
    # CREATE TEAM
    # =========================
    new_team = Team(

        name=team.name.strip(),

        city=team.city.strip(),

        tecnico=team.tecnico.strip(),

        pj=team.pj or 0,

        pg=team.pg or 0,

        pe=team.pe or 0,

        pp=team.pp or 0,

        points=team.points or 0,

        logo=team.logo,
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return new_team


# =========================
# GET TEAMS
# PUBLIC
# =========================
@router.get("/teams")
def get_teams(
    db: Session = Depends(get_db)
):

    teams = db.query(Team).all()

    result = []

    for team in teams:

        approved_players = [

            player

            for player in team.players

            if player.status == "approved"
        ]

        result.append({

            "id": team.id,

            "name": team.name,

            "city": team.city,

            "tecnico": team.tecnico,

            "pj": team.pj,

            "pg": team.pg,

            "pe": team.pe,

            "pp": team.pp,

            "gf": getattr(team, "gf", 0),

            "gc": getattr(team, "gc", 0),

            "points": team.points,

            "logo": team.logo,

            "players": approved_players,
        })

    return result


# =========================
# DELETE TEAM
# ADMIN ONLY
# =========================
@router.delete("/teams/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        admin_required
    )
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    # =========================
    # VALIDATE PLAYERS
    # =========================
    if team.players:

        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el equipo porque tiene jugadores asociados"
        )

    # =========================
    # DELETE LOGO
    # =========================
    if team.logo:

        logo_path = team.logo.replace(
            "/",
            ""
        )

        if os.path.exists(logo_path):

            os.remove(logo_path)

    # =========================
    # DELETE TEAM
    # =========================
    db.delete(team)

    db.commit()

    return {
        "message": "Equipo eliminado"
    }


# =========================
# UPDATE TEAM
# ADMIN + DIRECTOR
# =========================
@router.put("/teams/{team_id}")
def update_team(
    team_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        director_required
    )
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    # =========================
    # BASIC DATA
    # =========================
    team.name = data.get(
        "name",
        team.name
    )

    team.city = data.get(
        "city",
        team.city
    )

    team.tecnico = data.get(
        "tecnico",
        team.tecnico
    )

    # =========================
    # STATS
    # =========================
    team.pj = data.get(
        "pj",
        team.pj
    )

    team.pg = data.get(
        "pg",
        team.pg
    )

    team.pe = data.get(
        "pe",
        team.pe
    )

    team.pp = data.get(
        "pp",
        team.pp
    )

    team.gf = data.get(
        "gf",
        getattr(team, "gf", 0)
    )

    team.gc = data.get(
        "gc",
        getattr(team, "gc", 0)
    )

    team.logo = data.get(
        "logo",
        team.logo
    )

    # =========================
    # AUTO POINTS
    # =========================
    team.points = (
        (team.pg * 3)
        + team.pe
    )

    db.commit()

    db.refresh(team)

    return team


# =========================
# UPLOAD LOGO
# ADMIN + DIRECTOR
# =========================
@router.post("/teams/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user=Depends(
        director_required
    )
):

    # =========================
    # CREATE FOLDER
    # =========================
    os.makedirs(
        "uploads",
        exist_ok=True
    )

    # =========================
    # VALIDATE EXTENSION
    # =========================
    allowed_extensions = [
        "jpg",
        "jpeg",
        "png",
        "webp",
    ]

    file_extension = (
        file.filename
        .split(".")[-1]
        .lower()
    )

    if file_extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail="Formato de imagen no permitido"
        )

    # =========================
    # UNIQUE NAME
    # =========================
    filename = (
        f"{uuid.uuid4()}.{file_extension}"
    )

    file_path = (
        f"uploads/{filename}"
    )

    # =========================
    # SAVE FILE
    # =========================
    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # =========================
    # RESPONSE
    # =========================
    return {
        "logo": f"/uploads/{filename}"
    }