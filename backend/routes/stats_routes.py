from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.connection import get_db

from models.player_model import Player
from models.team_model import Team
from models.match_model import Match
from models.match_event_model import MatchEvent

router = APIRouter()


# =========================
# STATS
# =========================
@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db)
):

    # =========================
    # TOTALS
    # =========================
    total_players = db.query(Player).count()

    total_teams = db.query(Team).count()

    total_matches = db.query(Match).count()

    # =========================
    # TOP SCORERS
    # =========================
    goal_events = db.query(MatchEvent).all()

    goals_map = {}

    for event in goal_events:

        if str(event.event_type).lower() != "goal":
            continue

        player = db.query(Player).filter(
            Player.id == event.player_id
        ).first()

        if not player:
            continue

        if player.id not in goals_map:

            goals_map[player.id] = {

                "player_id":
                    player.id,

                "name":
                    player.name,

                "lastname":
                    player.lastname,

                "team":
                    player.team.name
                    if player.team
                    else "",

                "goals":
                    0,
            }

        goals_map[player.id]["goals"] += 1

    top_scorers = list(
        goals_map.values()
    )

    top_scorers.sort(

        key=lambda x: x["goals"],

        reverse=True,
    )

    # =========================
    # TOP SCORER BY TEAM
    # =========================
    teams = db.query(Team).all()

    team_top_scorers = []

    for team in teams:

        players = db.query(Player).filter(
            Player.team_id == team.id
        ).all()

        best_player = None

        best_goals = 0

        for player in players:

            goals = db.query(MatchEvent).filter(

                MatchEvent.player_id == player.id,

                MatchEvent.event_type == "goal"

            ).count()

            if goals > best_goals:

                best_goals = goals

                best_player = player

        if best_player:

            team_top_scorers.append({

                "team":
                    team.name,

                "player":
                    f"{best_player.name} {best_player.lastname}",

                "goals":
                    best_goals,
            })

    # =========================
    # RESPONSE
    # =========================
    return {

        "total_players":
            total_players,

        "total_teams":
            total_teams,

        "total_matches":
            total_matches,

        "top_scorers":
            top_scorers,

        "team_top_scorers":
            team_top_scorers,
    }