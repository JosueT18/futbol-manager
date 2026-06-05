from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# =========================
# CREATE MATCH
# =========================
class MatchCreate(BaseModel):

    home_team_id: int

    away_team_id: int

    round_number: int

    match_date: Optional[datetime] = None

    stadium: Optional[str] = None


# =========================
# UPDATE MATCH
# =========================
class MatchUpdate(BaseModel):

    home_score: int

    away_score: int

    status: str