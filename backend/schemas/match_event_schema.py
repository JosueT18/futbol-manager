from pydantic import BaseModel


# =========================
# CREATE EVENT
# =========================
class MatchEventCreate(BaseModel):

    match_id: int

    player_id: int

    team_id: int

    event_type: str

    minute: int


# =========================
# RESPONSE EVENT
# =========================
class MatchEventResponse(BaseModel):

    id: int

    match_id: int

    player_id: int

    event_type: str

    minute: int

    class Config:

        from_attributes = True