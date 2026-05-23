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


router = APIRouter()


# =========================
# CREATE TEAM
# =========================
@router.post("/teams")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db)
):

    new_team = Team(
        name=team.name,
        city=team.city,
        tecnico=team.tecnico,
        pj=team.pj,
        pg=team.pg,
        pe=team.pe,
        pp=team.pp,
        points=team.points,
        logo=team.logo,
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return new_team


# =========================
# GET TEAMS
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

            "points": team.points,

            "logo": team.logo,

            "players": approved_players,
        })

    return result


# =========================
# DELETE TEAM
# =========================
@router.delete("/teams/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db)
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    if team.players:

        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el equipo porque tiene jugadores asociados"
        )

    db.delete(team)

    db.commit()

    return {
        "message": "Equipo eliminado"
    }


# =========================
# UPDATE TEAM
# =========================
@router.put("/teams/{team_id}")
def update_team(
    team_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

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

    team.logo = data.get(
        "logo",
        team.logo
    )

    # CALCULAR PUNTOS
    team.points = (
        (team.pg * 3)
        + team.pe
    )

    db.commit()

    db.refresh(team)

    return team


# =========================
# UPLOAD LOGO
# =========================
@router.post("/teams/upload-logo")
async def upload_logo(
    file: UploadFile = File(...)
):

    # CREAR CARPETA
    os.makedirs(
        "uploads",
        exist_ok=True
    )

    # VALIDAR EXTENSION
    allowed_extensions = [
        "jpg",
        "jpeg",
        "png",
        "webp"
    ]

    file_extension = (
        file.filename.split(".")[-1].lower()
    )

    if file_extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail="Formato de imagen no permitido"
        )

    # NOMBRE UNICO
    filename = (
        f"{uuid.uuid4()}.{file_extension}"
    )

    file_path = (
        f"uploads/{filename}"
    )

    # GUARDAR ARCHIVO
    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # RESPUESTA
    return {
        "logo": f"/uploads/{filename}"
    }