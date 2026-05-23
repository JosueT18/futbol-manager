from pydantic import BaseModel

from typing import List


# =========================
# FORMATION PLAYER CREATE
# =========================
class FormationPlayerCreate(BaseModel):

    # ID jugador
    player_id: int

    # Posición en cancha
    position_x: int

    position_y: int

    # starter / substitute
    role: str


# =========================
# FORMATION CREATE
# =========================
class FormationCreate(BaseModel):

    # Nombre personalizado
    name: str

    # Ej:
    # 4-3-3
    # 4-4-2
    # custom
    tactic: str

    # Tipo:
    # 11 / 9 / 7 / 5
    match_type: int

    # Equipo
    team_id: int

    # Lista jugadores
    players: List[
        FormationPlayerCreate
    ]


# =========================
# FORMATION PLAYER RESPONSE
# =========================
class FormationPlayerResponse(BaseModel):

    id: int

    player_id: int

    position_x: int

    position_y: int

    role: str

    class Config:

        from_attributes = True


# =========================
# FORMATION RESPONSE
# =========================
class FormationResponse(BaseModel):

    id: int

    name: str

    tactic: str

    match_type: int

    team_id: int

    players: List[
        FormationPlayerResponse
    ]

    class Config:

        from_attributes = True