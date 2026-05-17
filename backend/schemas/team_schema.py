from pydantic import BaseModel, Field

class TeamCreate(BaseModel):

    name: str = Field(...,min_length=2)
    city: str = Field(...,min_length=2)
    tecnico: str = Field(...,min_length=2)
    #=======
    # STATS
    #=======
    pj: int = 0
    pg: int = 0
    pe: int = 0
    pp: int = 0
    points: int = 0