from pydantic import BaseModel, Field


class PlayerCreate(BaseModel):

    # =========================
    # PLAYER DATA
    # =========================
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    age: int = Field(
        ...,
        gt=0,
        le=60
    )

    position: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    number: int = Field(
        ...,
        gt=0,
        le=99
    )

    team_id: int = Field(
        ...,
        gt=0
    )

    # =========================
    # STATS
    # =========================
    goals: int = Field(
        default=0,
        ge=0
    )

    yellow_cards: int = Field(
        default=0,
        ge=0
    )

    red_cards: int = Field(
        default=0,
        ge=0
    )

    matches_played: int = Field(
        default=0,
        ge=0
    )