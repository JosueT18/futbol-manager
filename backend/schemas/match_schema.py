from pydantic import BaseModel

from datetime import datetime

from typing import Optional


# =========================
# CREATE MATCH
# =========================
class MatchCreate(BaseModel):

    home_team_id: int

    away_team_id: int

    stadium: Optional[str] = None

    tournament: Optional[str] = None

    match_date: Optional[datetime] = None


# =========================
# UPDATE MATCH
# =========================
class MatchUpdate(BaseModel):

    home_score: int

    away_score: int

    status: str


# =========================
# RESPONSE
# =========================
class MatchResponse(BaseModel):

    id: int

    home_team_id: int

    away_team_id: int

    home_score: int

    away_score: int

    status: str

    stadium: Optional[str]

    tournament: Optional[str]

    match_date: Optional[datetime]

    class Config:

        from_attributes = True