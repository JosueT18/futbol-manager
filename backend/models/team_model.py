from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.connection import Base


class Team(Base):

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    city = Column(String, nullable=False)

    tecnico = Column(String, nullable=False)

    players = relationship(
        "Player",
        back_populates="team"
    )
    #=========
    # STATS
    #=========
    pj = Column(
        Integer,default=0
    )

    pg = Column(
        Integer,default=0
    )
    pe = Column(
        Integer,default=0
    )
    pp = Column(
        Integer,default=0
    )
    point = Column(
        Integer,default=0
    ) 
