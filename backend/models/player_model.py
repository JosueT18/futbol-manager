from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database.connection import Base


class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    age = Column(Integer, nullable=False)

    position = Column(String, nullable=False)

    number = Column(Integer, nullable=False)

    # 🔥 ÚNICO ESTADO REAL
    status = Column(
        String,
        default="pending"
    )

    # 🔥 motivo rechazo
    rejection_reason = Column(
        String,
        nullable=True
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    team = relationship(
        "Team",
        back_populates="players"
    )
    #===========
    # STATS
    #===========
    goals = Column(
        Integer, default=0
    )

    yellow_cards = Column(
        Integer,default=0
    )

    red_cards = Column(
        Integer,default=0
    )

    matches_played = Column(Integer, default=0)