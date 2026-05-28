from fastapi import (
    Depends,
    HTTPException,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from jose import jwt

from sqlalchemy.orm import Session

from database.connection import (
    get_db,
)

from models.user_model import User

from utils.security import (
    SECRET_KEY,
    ALGORITHM,
)

security = HTTPBearer()


# =========================
# GET CURRENT USER
# =========================
def get_current_user(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security),

    db: Session =
    Depends(get_db)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("id")

        if not user_id:

            raise HTTPException(
                status_code=401,
                detail="Token inválido"
            )

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if not user:

            raise HTTPException(
                status_code=401,
                detail="Usuario no encontrado"
            )

        # =========================
        # USER INACTIVE
        # =========================
        if not user.active:

            raise HTTPException(
                status_code=403,
                detail="Usuario desactivado"
            )

        return user

    except Exception:

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
# DIRECTOR OR ADMIN
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
# COMISION OR ADMIN
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
# TECNICO OR ADMIN
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
# SAME TEAM VALIDATION
# PREPARADO PARA TECNICO
# =========================
def validate_same_team(
    current_user: User,
    target_team_id: int
):

    # =========================
    # ADMIN VE TODO
    # =========================
    if current_user.role == "Administrador":

        return True

    # =========================
    # TECNICO SOLO SU EQUIPO
    # =========================
    if current_user.role == "Tecnico":

        if current_user.team_id != target_team_id:

            raise HTTPException(
                status_code=403,
                detail="Solo puedes gestionar tu equipo"
            )

    return True