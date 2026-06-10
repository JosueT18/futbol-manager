from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
)

from typing import Optional
from typing import List
from schemas.player_schema import PlayerResponse


# =========================
# CREATE TEAM
# =========================
class TeamCreate(BaseModel):

    # =========================
    # BASIC DATA
    # =========================
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    city: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    tecnico: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    logo: Optional[str] = None

    # =========================
    # STATS
    # =========================
    pj: int = Field(
        default=0,
        ge=0
    )

    pg: int = Field(
        default=0,
        ge=0
    )

    pe: int = Field(
        default=0,
        ge=0
    )

    pp: int = Field(
        default=0,
        ge=0
    )

    gf: int = Field(
        default=0,
        ge=0
    )

    gc: int = Field(
        default=0,
        ge=0
    )

    points: int = Field(
        default=0,
        ge=0
    )


# =========================
# UPDATE TEAM
# =========================
class TeamUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    city: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    tecnico: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    logo: Optional[str] = None

    pj: Optional[int] = Field(
        default=None,
        ge=0
    )

    pg: Optional[int] = Field(
        default=None,
        ge=0
    )

    pe: Optional[int] = Field(
        default=None,
        ge=0
    )

    pp: Optional[int] = Field(
        default=None,
        ge=0
    )

    gf: Optional[int] = Field(
        default=None,
        ge=0
    )

    gc: Optional[int] = Field(
        default=None,
        ge=0
    )

    points: Optional[int] = Field(
        default=None,
        ge=0
    )


# =========================
# TEAM RESPONSE
# =========================
class TeamResponse(BaseModel):

    id: int

    name: str

    city: str

    tecnico: str

    logo: Optional[str] = None

    pj: int

    pg: int

    pe: int

    pp: int

    gf: int

    gc: int

    points: int

    players: list[PlayerResponse] = []

    # =========================
    # ORM MODE
    # =========================
    model_config = ConfigDict(
        from_attributes=True
    )