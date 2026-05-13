from sqlalchemy import Column, Integer, String, ForeignKey, Boolean

from database.connection import Base


class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    age = Column(Integer, nullable=False)

    position = Column(String, nullable=False)

    number = Column(Integer, nullable=False)

    team_id = Column(Integer, ForeignKey("teams.id"))

    approved = Column(Boolean, default=False)