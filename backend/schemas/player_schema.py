from pydantic import BaseModel

class PlayerCreate(BaseModel):

    name: str
    age: int
    position: str
    number: int
    team_id: int