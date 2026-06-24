import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import {
  Trophy,
  CalendarDays,
  Users,
  Shield,
  Goal,
  Activity,
} from "lucide-react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import Card from "../components/ui/Card"

import { getMatches } from "../api/matches"
import { getTeams } from "../api/teams"
import { getPlayers } from "../api/players"
import { getStandings } from "../api/standings"
import { getStats } from "../api/stats"

function Dashboard() {

  const [matches, setMatches] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [players, setPlayers] =
    useState<any[]>([])

  const [standings, setStandings] =
    useState<any[]>([])

  const [stats, setStats] =
    useState<any>(null)

  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    try {

      const matchesData =
        await getMatches()

      const teamsData =
        await getTeams()

      const playersData =
        await getPlayers()

      const standingsData =
        await getStandings()

      const statsData =
        await getStats()

      setMatches(matchesData || [])

      setTeams(teamsData || [])

      setPlayers(playersData || [])

      setStandings(standingsData || [])

      setStats(statsData || null)

    } catch (error) {

      console.error(error)
    }
  }

  // =========================
  // TOTAL GOALS
  // =========================
  const totalGoals =
    stats?.top_scorers?.reduce(
      (
        acc: number,
        player: any
      ) => acc + (player.goals || 0),
      0
    ) || 0

  // =========================
  // TOP SCORERS
  // =========================
  const topScorers =
    stats?.top_scorers || []

  // =========================
  // FEATURED MATCH
  // =========================
  const featuredMatch =
    matches.find(
      (m) => m.status === "finished"
    )

  // =========================
  // NEXT MATCHES
  // =========================
  const nextMatches =
    matches
      .filter(
        (m) =>
          m.status === "scheduled"
      )
      .slice(0, 3)

  // =========================
  // GOALS BY TEAM CHART
  // =========================
  const goalsByTeam =
    standings.map((team: any) => ({

      name:
        team.team_name,

      goals:
        team.goals_for,
    }))

  // =========================
  // TOP SCORERS CHART
  // =========================
  const scorersChart =
    topScorers
      .slice(0, 5)
      .map((player: any) => ({

        name:
          player.name,

        goals:
          player.goals,
      }))

  return (

    <div
      className="
        min-h-screen
        bg-[#0f1720]
        text-white
        p-3 md:p-6
      "
    >

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-3xl md:text-5xl font-black">
          TORNEO FUTBOL
        </h1>

        <p className="text-zinc-400 mt-3">
          Torneo
        </p>

      </div>

      {/* HERO CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
          w-full
        "
      >

        {/* MATCHES */}
        <motion.div
          whileHover={{ scale: 1.03 }}
        >

          <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between md:items-center">

              <div>

                <p className="text-zinc-400">
                  Partidos
                </p>

                <h2 className="text-4xl font-black mt-2">
                  {matches.length}
                </h2>

              </div>

              <CalendarDays
                size={50}
                className="text-blue-400"
              />

            </div>

          </Card>

        </motion.div>

        {/* TEAMS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
        >

          <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between md:items-center">

              <div>

                <p className="text-zinc-400">
                  Equipos
                </p>

                <h2 className="text-4xl font-black mt-2">
                  {teams.length}
                </h2>

              </div>

              <Shield
                size={50}
                className="text-green-400"
              />

            </div>

          </Card>

        </motion.div>

        {/* PLAYERS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
        >

          <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between md:items-center">

              <div>

                <p className="text-zinc-400">
                  Jugadores
                </p>

                <h2 className="text-4xl font-black mt-2">
                  {players.length}
                </h2>

              </div>

              <Users
                size={50}
                className="text-purple-400"
              />

            </div>

          </Card>

        </motion.div>

        {/* GOALS */}
        <motion.div
          whileHover={{ scale: 1.03 }}
        >

          <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between md:items-center">

              <div>

                <p className="text-zinc-400">
                  Goles
                </p>

                <h2 className="text-4xl font-black mt-2">
                  {totalGoals}
                </h2>

              </div>

              <Goal
                size={50}
                className="text-red-400"
              />

            </div>

          </Card>

        </motion.div>

      </div>

      {/* MAIN GRID */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          mt-8
          w-full
        "
      >

        {/* FEATURED MATCH */}
        <div className="xl:col-span-2 min-w-0">

          <Card className="bg-gradient-to-br from-[#18222f] to-[#243244] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex items-center gap-3 mb-6">

              <Trophy className="text-yellow-400" />

              <h2 className="text-3xl font-black">
                Partido Destacado
              </h2>

            </div>

            {
              featuredMatch ? (

                <div className="text-center py-10">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                    <div>

                      <h3 className="text-xl md:text-3xl font-bold break-words">
                        {featuredMatch.home_team}
                      </h3>

                    </div>

                    <div>

                      <div className="text-4xl md:text-6xl font-black text-green-400">

                        {featuredMatch.home_score}

                        {" - "}

                        {featuredMatch.away_score}

                      </div>

                    </div>

                    <div>

                      <h3 className="text-xl md:text-3xl font-bold break-words">
                        {featuredMatch.away_team}
                      </h3>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="text-zinc-400">
                  No hay partidos finalizados
                </div>
              )
            }

          </Card>

        </div>

        {/* TOP SCORERS */}
        <div>

          <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

            <div className="flex items-center gap-3 mb-6">

              <Goal className="text-red-400" />

              <h2 className="text-2xl font-black">
                Goleadores
              </h2>

            </div>

            <div className="space-y-4">

              {
                topScorers.length > 0 ? (

                  topScorers
                    .slice(0, 5)
                    .map(
                      (
                        player: any,
                        index: number
                      ) => (

                        <div
                          key={player.player_id}
                          className="
                            flex
                            justify-between
                            items-center
                            bg-[#243244]
                            rounded-2xl
                            p-4
                          "
                        >

                          <div>

                            <p className="font-bold">

                              #{index + 1}

                              {" · "}

                              {player.name}

                              {" "}

                              {player.lastname}

                            </p>

                            <p className="text-sm text-zinc-400">

                              {player.team}

                            </p>

                          </div>

                          <div
                            className="
                              bg-red-500
                              text-white
                              px-4
                              py-2
                              rounded-xl
                              font-black
                            "
                          >

                            ⚽ {player.goals}

                          </div>

                        </div>
                      )
                    )

                ) : (

                  <p className="text-zinc-400">
                    No hay goles registrados
                  </p>
                )
              }

            </div>

          </Card>

        </div>

      </div>

      {/* LOWER GRID */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
          w-full
        "
      >

        {/* STANDINGS */}
        <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

          <div className="flex items-center gap-3 mb-6">

            <Trophy className="text-yellow-400" />

            <h2 className="text-2xl font-black">
              Tabla
            </h2>

          </div>

          <div className="space-y-3">

            {
              standings
                .slice(0, 5)
                .map(
                  (
                    team,
                    index
                  ) => (

                    <div
                      key={team.team_id}
                      className="
                        flex
                        justify-between
                        items-center
                        bg-[#243244]
                        p-4
                        rounded-xl
                      "
                    >

                      <div className="flex gap-3 items-center">

                        <span className="font-black text-xl">
                          #{index + 1}
                        </span>

                        <span className="
                        font-semibold
                        truncate
                        max-w-[150px]
                        md:max-w-none

                        ">
                          {team.team_name}
                        </span>

                      </div>

                      <div className="font-black text-green-400">
                        {team.points} pts
                      </div>

                    </div>
                  )
                )
            }

          </div>

        </Card>

        {/* NEXT MATCHES */}
        <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

          <div className="flex items-center gap-3 mb-6">

            <Activity className="text-blue-400" />

            <h2 className="text-2xl font-black">
              Próximos Partidos
            </h2>

          </div>

          <div className="space-y-4">

            {
              nextMatches.map((match) => (

                <div
                  key={match.id}
                  className="
                    bg-[#243244]
                    rounded-2xl
                    p-5
                  "
                >

                  <div className="text-center">

                    <p className="font-bold text-xl">
                      {match.home_team}
                    </p>

                    <p className="text-zinc-400 my-2">
                      VS
                    </p>

                    <p className="font-bold text-xl">
                      {match.away_team}
                    </p>

                    <p className="text-sm text-zinc-400 mt-4">

                      {
                        match.match_date &&
                        new Date(
                          match.match_date
                        ).toLocaleString()
                      }

                    </p>

                  </div>

                </div>
              ))
            }

          </div>

        </Card>

      </div>

      {/* CHARTS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
        "
      >

        {/* GOALS BY TEAM */}
        <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

          <h2 className="text-2xl font-black mb-6">
            Goles por Equipo
          </h2>

          <div className="
           w-full 
           min-h-[300px]
           h-[300px]
           md:h-[350px]
           
           ">

            <ResponsiveContainer
              width="99%"
              height={300}
            >

              <BarChart
                data={goalsByTeam}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#253041"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                />

                <YAxis
                  stroke="#9ca3af"
                />

                <Tooltip />

                <Bar
                  dataKey="goals"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* TOP SCORERS CHART */}
        <Card className="bg-[#18222f] border border-[#253041] min-w-0 overflow-hidden">

          <h2 className="text-2xl font-black mb-6">
            Top Goleadores
          </h2>

          <div className="
          w-full 
          min-h-[300px]
          h-[350px]
          md:h-[350px]
          
          ">

            <ResponsiveContainer
              width="99%"
              height={300}
            >

              <BarChart
                data={scorersChart}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#253041"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                />

                <YAxis
                  stroke="#9ca3af"
                />

                <Tooltip />

                <Bar
                  dataKey="goals"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

      </div>

    </div>
  )
}

export default Dashboard