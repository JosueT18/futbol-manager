from pydantic import BaseModel, Field

class PlayerCreate(BaseModel):

    name: str = Field(...,min_length=2)
    age: int = Field(...,gt=0)
    position: str = Field(...,min_length=2)
    number: int = Field(...,gt=0)
    team_id: int = Field(...,gt=0)
    #=======
    # STATS
    #=======
    goals: int = 0
    yellow_cards: int = 0
    red_cards: int = 0