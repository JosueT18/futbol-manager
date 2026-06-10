from pydantic import BaseModel

# =========================
# PLAYER
# =========================
class FormationPlayerBase(BaseModel):

    player_id: int

    role: str

    position_x: float

    position_y: float


class FormationPlayerCreate(
    FormationPlayerBase
):
    pass


class FormationPlayerResponse(
    FormationPlayerBase
):

    id: int

    class Config:

        from_attributes = True


# =========================
# FORMATION
# =========================
class FormationBase(BaseModel):

    name: str

    tactic: str

    match_type: int

    team_id: int


class FormationCreate(
    FormationBase
):

    players: list[
        FormationPlayerCreate
    ]


class FormationResponse(
    FormationBase
):

    id: int

    players: list[
        FormationPlayerResponse
    ] = []

    class Config:

        from_attributes = True