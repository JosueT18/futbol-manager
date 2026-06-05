from fastapi import (
    Depends,
    HTTPException,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from jose import jwt, JWTError

from sqlalchemy.orm import Session

from database.connection import get_db

from models.user_model import User
from models.team_model import Team
from models.player_model import Player

from utils.security import (
    SECRET_KEY,
    ALGORITHM,
)

# =========================
# SECURITY
# =========================
security = HTTPBearer()

# =========================
# GET CURRENT USER
# =========================
def get_current_user(

    credentials:
    HTTPAuthorizationCredentials
    = Depends(security),

    db: Session = Depends(get_db)
):

    try:

        token = credentials.credentials

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]
        )

        # =========================
        # TOKEN DATA
        # =========================
        user_id = payload.get("id")

        if user_id is None:

            raise HTTPException(

                status_code=401,

                detail="Token inválido"
            )

        # =========================
        # FIND USER
        # =========================
        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if not user:

            raise HTTPException(

                status_code=401,

                detail="Usuario no encontrado"
            )

        # =========================
        # USER ACTIVE
        # =========================
        if not user.active:

            raise HTTPException(

                status_code=403,

                detail="Usuario desactivado"
            )

        return user

    except JWTError:

        raise HTTPException(

            status_code=401,

            detail="Token inválido"
        )

# =========================
# ADMIN ONLY
# =========================
def admin_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role != "Administrador":

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# DIRECTOR ONLY
# =========================
def director_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Director",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# COMISION ONLY
# =========================
def commission_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Comision",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# TECNICO ONLY
# =========================
def tecnico_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Tecnico",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# STAFF
# =========================
def staff_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Director",

        "Comision",

        "Tecnico",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# ADMIN OR DIRECTOR
# =========================
def admin_or_director_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Director",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# ADMIN OR STAFF
# =========================
def admin_or_staff_required(
    current_user: User =
    Depends(get_current_user)
):

    if current_user.role not in [

        "Administrador",

        "Director",

        "Comision",

        "Tecnico",
    ]:

        raise HTTPException(

            status_code=403,

            detail="Sin permisos"
        )

    return current_user

# =========================
# SAME TEAM VALIDATION
# =========================
def validate_same_team(

    current_user: User,

    target_team_id: int
):

    # ADMIN
    if current_user.role == "Administrador":

        return True

    # DIRECTOR
    if current_user.role == "Director":

        if current_user.team_id != target_team_id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar tu equipo"
            )

    # TECNICO
    if current_user.role == "Tecnico":

        if current_user.team_id != target_team_id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar tu equipo"
            )

    return True

# =========================
# CAN MANAGE TEAM
# =========================
def can_manage_team(

    current_user: User,

    team_id: int,

    db: Session
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(

            status_code=404,

            detail="Equipo no encontrado"
        )

    # ADMIN
    if current_user.role == "Administrador":

        return True

    # DIRECTOR
    if current_user.role == "Director":

        if current_user.team_id != team.id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar tu equipo"
            )

        return True

    # TECNICO
    if current_user.role == "Tecnico":

        if current_user.team_id != team.id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar tu equipo"
            )

        return True

    raise HTTPException(

        status_code=403,

        detail="Sin permisos"
    )

# =========================
# CAN MANAGE PLAYER
# =========================
def can_manage_player(

    current_user: User,

    player_id: int,

    db: Session
):

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(

            status_code=404,

            detail="Jugador no encontrado"
        )

    # ADMIN
    if current_user.role == "Administrador":

        return player

    # DIRECTOR
    if current_user.role == "Director":

        if current_user.team_id != player.team_id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar jugadores de tu equipo"
            )

        return player

    # TECNICO
    if current_user.role == "Tecnico":

        if current_user.team_id != player.team_id:

            raise HTTPException(

                status_code=403,

                detail="Solo puedes gestionar jugadores de tu equipo"
            )

        return player

    # COMISION
    if current_user.role == "Comision":

        return player

    raise HTTPException(

        status_code=403,

        detail="Sin permisos"
    )