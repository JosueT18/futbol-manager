from pydantic import BaseModel

class TeamCreate(BaseModel):

    name: str
    city: str
    tecnico: str