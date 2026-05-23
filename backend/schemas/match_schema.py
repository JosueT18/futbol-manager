from pydantic import BaseModel

from typing import Optional


# =========================
# CREATE MATCH
# =========================
class MatchCreate(BaseModel):

    home_team_id: int

    away_team_id: int

    home_score: int = 0

    away_score: int = 0

    date: str

    stadium: Optional[str] = None

    status: str = "scheduled"


# =========================
# UPDATE MATCH
# =========================
class MatchUpdate(BaseModel):

    home_team_id: Optional[int] = None

    away_team_id: Optional[int] = None

    home_score: Optional[int] = None

    away_score: Optional[int] = None

    date: Optional[str] = None

    stadium: Optional[str] = None

    status: Optional[str] = None