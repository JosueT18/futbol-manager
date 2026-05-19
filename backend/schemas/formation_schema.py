from pydantic import BaseModel

from typing import List


# =========================
# FORMATION PLAYER
# =========================
class FormationPlayerCreate(BaseModel):

    player_id: int

    position_x: int

    position_y: int

    # titular / suplente
    role: str


# =========================
# FORMATION CREATE
# =========================
class FormationCreate(BaseModel):

    # Nombre personalizado
    name: str

    # 4-3-3 / 4-4-2 / custom
    tactic: str

    # 11 / 9 / 7 / 5
    match_type: int

    team_id: int

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