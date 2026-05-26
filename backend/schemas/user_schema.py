from pydantic import (
    BaseModel,
    Field,
)

from typing import Optional

# =========================
# USER CREATE
# =========================
class UserCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2
    )

    email: str

    password: str = Field(
        ...,
        min_length=4
    )

    role: str

    team_id: Optional[int] = None

# =========================
# USER LOGIN
# =========================
class UserLogin(BaseModel):

    email: str

    password: str