from pydantic import (
    BaseModel,
    Field,
    ConfigDict,
)


# =========================
# CREATE PLAYER
# =========================
class PlayerCreate(BaseModel):

    # =========================
    # PLAYER DATA
    # =========================
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )
    lastname: str = Field(
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
    # OPTIONAL STATS
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


# =========================
# UPDATE PLAYER
# =========================
class PlayerUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    lastname: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    age: int | None = Field(
        default=None,
        gt=0,
        le=60
    )

    position: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    number: int | None = Field(
        default=None,
        gt=0,
        le=99
    )

    team_id: int | None = Field(
        default=None,
        gt=0
    )

    goals: int | None = Field(
        default=None,
        ge=0
    )

    yellow_cards: int | None = Field(
        default=None,
        ge=0
    )

    red_cards: int | None = Field(
        default=None,
        ge=0
    )

    matches_played: int | None = Field(
        default=None,
        ge=0
    )


# =========================
# PLAYER RESPONSE
# =========================
class PlayerResponse(BaseModel):

    id: int

    name: str

    lastname: str

    age: int

    position: str

    number: int

    status: str

    rejection_reason: str | None

    goals: int

    yellow_cards: int

    red_cards: int

    matches_played: int

    team_id: int

    # =========================
    # ORM MODE
    # =========================
    model_config = ConfigDict(
        from_attributes=True
    )