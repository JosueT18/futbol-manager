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
    get_current_user,
    validate_same_team,
)

router = APIRouter()


# =========================
# CREATE TEAM
# ADMIN ONLY
# =========================
@router.post("/teams")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        admin_required
    )
):

    existing_team = db.query(Team).filter(
        Team.name == team.name.strip()
    ).first()

    if existing_team:

        raise HTTPException(
            status_code=400,
            detail="El equipo ya existe"
        )

    if not team.name.strip():

        raise HTTPException(
            status_code=400,
            detail="El nombre es obligatorio"
        )

    if not team.city.strip():

        raise HTTPException(
            status_code=400,
            detail="La ciudad es obligatoria"
        )

    if not team.tecnico.strip():

        raise HTTPException(
            status_code=400,
            detail="El técnico es obligatorio"
        )

    new_team = Team(

        name=team.name.strip(),

        city=team.city.strip(),

        tecnico=team.tecnico.strip(),

        pj=team.pj or 0,

        pg=team.pg or 0,

        pe=team.pe or 0,

        pp=team.pp or 0,

        gf=team.gf or 0,

        gc=team.gc or 0,

        points=((team.pg or 0) * 3)
        + (team.pe or 0),

        logo=team.logo,
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return new_team


# =========================
# GET TEAMS
# FILTER BY ROLE
# =========================
@router.get("/teams")
def get_teams(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    # =========================
    # ADMIN + COMISION
    # VE TODOS LOS EQUIPOS
    # =========================
    if current_user.role in [

        "Administrador",

        "Comision",
    ]:

        teams = db.query(Team).all()

    # =========================
    # DIRECTOR + TECNICO + JUGADOR
    # SOLO SU EQUIPO
    # =========================
    else:

        teams = db.query(Team).filter(
            Team.id ==
            current_user.team_id
        ).all()

    # =========================
    # RESPONSE
    # =========================
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

            "gf": team.gf,

            "gc": team.gc,

            "points": team.points,

            "logo": team.logo,

            "players": approved_players,
        })

    return result

# =========================
# UPDATE TEAM
# ADMIN + DIRECTOR + TECNICO
# =========================
@router.put("/teams/{team_id}")
def update_team(
    team_id: int,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    if current_user.role not in [

        "Administrador",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    # =========================
    # VALIDAR MISMO EQUIPO
    # =========================
    validate_same_team(
        current_user,
        team.id
    )

    # =========================
    # VALIDAR NOMBRE DUPLICADO
    # =========================
    if "name" in data:

        existing_team = db.query(Team).filter(
            Team.id != team_id,
            Team.name == data["name"].strip()
        ).first()

        if existing_team:

            raise HTTPException(
                status_code=400,
                detail="Ya existe un equipo con ese nombre"
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

        team.name = data["name"].strip()

    if "city" in data:

        if not data["city"].strip():

            raise HTTPException(
                status_code=400,
                detail="La ciudad es obligatoria"
            )

        team.city = data["city"].strip()

    if "tecnico" in data:

        if not data["tecnico"].strip():

            raise HTTPException(
                status_code=400,
                detail="El técnico es obligatorio"
            )

        team.tecnico = data["tecnico"].strip()

    # =========================
    # STATS
    # =========================
    if "pj" in data:

        team.pj = int(data["pj"])

    if "pg" in data:

        team.pg = int(data["pg"])

    if "pe" in data:

        team.pe = int(data["pe"])

    if "pp" in data:

        team.pp = int(data["pp"])

    if "gf" in data:

        team.gf = int(data["gf"])

    if "gc" in data:

        team.gc = int(data["gc"])

    if "logo" in data:

        team.logo = data["logo"]

    # =========================
    # VALIDAR POSITIVOS
    # =========================
    numeric_fields = [

        team.pj,

        team.pg,

        team.pe,

        team.pp,

        team.gf,

        team.gc,
    ]

    for value in numeric_fields:

        if value < 0:

            raise HTTPException(
                status_code=400,
                detail="Los valores no pueden ser negativos"
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

    if team.players:

        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el equipo porque tiene jugadores asociados"
        )

    # =========================
    # DELETE LOGO
    # =========================
    if team.logo:

        logo_path = team.logo.lstrip("/")

        if os.path.exists(logo_path):

            os.remove(logo_path)

    db.delete(team)

    db.commit()

    return {
        "message": "Equipo eliminado"
    }


# =========================
# UPLOAD LOGO
# =========================
@router.post("/teams/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user=Depends(
        get_current_user
    )
):

    if current_user.role not in [

        "Administrador",

        "Director",

        "Tecnico",
    ]:

        raise HTTPException(
            status_code=403,
            detail="Sin permisos"
        )

    os.makedirs(
        "uploads",
        exist_ok=True
    )

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

    filename = (
        f"{uuid.uuid4()}.{file_extension}"
    )

    file_path = (
        f"uploads/{filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "logo": f"/uploads/{filename}"
    }