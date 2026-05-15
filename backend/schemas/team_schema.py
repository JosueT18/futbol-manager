from pydantic import BaseModel, Field

class TeamCreate(BaseModel):

    name: str = Field(...,min_length=2)
    city: str = Field(...,min_length=2)
    tecnico: str = Field(...,min_length=2)