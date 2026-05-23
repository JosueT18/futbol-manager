from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from database.connection import Base


class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    age = Column(Integer, nullable=False)

    number = Column(Integer, nullable=False)

    position = Column(String, nullable=False)

    status = Column(String, default="pending")

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    team = relationship(
        "Team",
        back_populates="players"
    )