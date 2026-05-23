from pydantic import BaseModel, Field
from typing import Optional
from fastapi import UploadFile, File
import shutil
import uuid

class TeamCreate(BaseModel):

    name: str = Field(...,min_length=2)
    city: str = Field(...,min_length=2)
    tecnico: str = Field(...,min_length=2)
    logo: Optional[str] = None
    #=======
    # STATS
    #=======
    pj: int = 0
    pg: int = 0
    pe: int = 0
    pp: int = 0
    points: int = 0

class TeamResponse(BaseModel):
    id: int
    name: str
    city: str
    tecnico: str
    logo: Optional [str] = None

class Config:
        from_attributes = True