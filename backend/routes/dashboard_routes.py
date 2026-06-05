from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from database.connection import get_db

from models.team_model import Team
from models.player_model import Player
from models.match_model import Match
from models.match_event_model import MatchEvent

router = APIRouter()

#=========================
#DASHBOARD
#=========================

@router.get("/dashboard")
def get_dashboard(
db: Session = Depends(get_db)
):

    total_teams = db.query(
        Team
    ).count()

    total_players = db.query(
        Player
    ).filter(
        Player.status == "Aprobado"
    ).count()

    total_matches = db.query(
        Match
    ).filter(
        Match.status == "finished"
    ).count()

    total_goals = db.query(
        MatchEvent
    ).filter(
        MatchEvent.event_type == "goal"
    ).count()

    top_scorer = db.query(

        Player.name,

        Player.lastname,

        func.count(
            MatchEvent.id
        ).label("goals")

    ).join(
        MatchEvent,
        MatchEvent.player_id == Player.id
    ).filter(
        MatchEvent.event_type == "goal"
    ).group_by(
        Player.id
    ).order_by(
        func.count(
            MatchEvent.id
        ).desc()
    ).first()

    latest_matches = db.query(
        Match
    ).order_by(
        Match.match_date.desc()
    ).limit(5).all()

    latest_result = []

    for match in latest_matches:

        latest_result.append({

            "id":
                match.id,

            "home_team":
                match.home_team.name
                if match.home_team else "",

            "away_team":
                match.away_team.name
                if match.away_team else "",

            "home_score":
                match.home_score,

            "away_score":
                match.away_score,

            "status":
                match.status,
        })

    return {

        "total_teams":
            total_teams,

        "total_players":
            total_players,

        "total_matches":
            total_matches,

        "total_goals":
            total_goals,

        "top_scorer":
            (
                f"{top_scorer.name} {top_scorer.lastname}"
                if top_scorer else "-"
            ),

        "top_scorer_goals":
            (
                top_scorer.goals
                if top_scorer else 0
            ),

        "latest_matches":
            latest_result,
    }