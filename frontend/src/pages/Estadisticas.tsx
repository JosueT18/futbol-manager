import { useQuery } from "@tanstack/react-query"

import {
  Trophy,
  Goal,
  ShieldAlert,
  ShieldX,
  Users,
} from "lucide-react"

import Card from "../components/ui/Card"

import { getPlayers } from "../api/players"
import { getTeams } from "../api/teams"

function Estadisticas() {

  // =========================
  // PLAYERS
  // =========================
  const {
    data: players = [],
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  // =========================
  // TEAMS
  // =========================
  const {
    data: teams = [],
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  // =========================
  // TOP GOLEADORES
  // =========================
  const topScorers = [...players]
    .sort(
      (a: any, b: any) =>
        (b.goals || 0) -
        (a.goals || 0)
    )
    .slice(0, 5)

  // =========================
  // TOP AMARILLAS
  // =========================
  const topYellowCards = [...players]
    .sort(
      (a: any, b: any) =>
        (b.yellow_cards || 0) -
        (a.yellow_cards || 0)
    )
    .slice(0, 5)

  // =========================
  // TOP ROJAS
  // =========================
  const topRedCards = [...players]
    .sort(
      (a: any, b: any) =>
        (b.red_cards || 0) -
        (a.red_cards || 0)
    )
    .slice(0, 5)

  // =========================
  // TABLA POSICIONES
  // =========================
  const standings = [...teams]
    .sort(
      (a: any, b: any) =>
        (b.points || 0) -
        (a.points || 0)
    )

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Estadísticas
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen general de jugadores y equipos
        </p>

      </div>

      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-5
        "
      >

        <Card>

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Jugadores
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {players.length}
              </h2>

            </div>

            <Users
              className="text-blue-500"
              size={34}
            />

          </div>

        </Card>

        <Card>

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Equipos
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {teams.length}
              </h2>

            </div>

            <Trophy
              className="text-yellow-500"
              size={34}
            />

          </div>

        </Card>

        <Card>

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Goles Totales
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {
                  players.reduce(
                    (
                      total: number,
                      player: any
                    ) =>
                      total +
                      (player.goals || 0),
                    0
                  )
                }

              </h2>

            </div>

            <Goal
              className="text-green-500"
              size={34}
            />

          </div>

        </Card>

        <Card>

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Tarjetas Rojas
              </p>

              <h2 className="text-3xl font-bold mt-2">

                {
                  players.reduce(
                    (
                      total: number,
                      player: any
                    ) =>
                      total +
                      (player.red_cards || 0),
                    0
                  )
                }

              </h2>

            </div>

            <ShieldX
              className="text-red-500"
              size={34}
            />

          </div>

        </Card>

      </div>

      {/* TOPS */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* GOLEADORES */}
        <Card>

          <div className="flex items-center gap-2 mb-5">

            <Goal
              className="text-green-500"
              size={22}
            />

            <h2 className="text-xl font-bold">
              Top Goleadores
            </h2>

          </div>

          <div className="space-y-3">

            {
              topScorers.map(
                (
                  player: any,
                  index: number
                ) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {index + 1}. {player.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position}
                      </p>

                    </div>

                    <div
                      className="
                        bg-green-100
                        text-green-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold
                      "
                    >
                      {player.goals || 0} goles
                    </div>

                  </div>
                )
              )
            }

          </div>

        </Card>

        {/* AMARILLAS */}
        <Card>

          <div className="flex items-center gap-2 mb-5">

            <ShieldAlert
              className="text-yellow-500"
              size={22}
            />

            <h2 className="text-xl font-bold">
              Más Amarillas
            </h2>

          </div>

          <div className="space-y-3">

            {
              topYellowCards.map(
                (
                  player: any,
                  index: number
                ) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {index + 1}. {player.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position}
                      </p>

                    </div>

                    <div
                      className="
                        bg-yellow-100
                        text-yellow-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold
                      "
                    >
                      {player.yellow_cards || 0}
                    </div>

                  </div>
                )
              )
            }

          </div>

        </Card>

        {/* ROJAS */}
        <Card>

          <div className="flex items-center gap-2 mb-5">

            <ShieldX
              className="text-red-500"
              size={22}
            />

            <h2 className="text-xl font-bold">
              Más Rojas
            </h2>

          </div>

          <div className="space-y-3">

            {
              topRedCards.map(
                (
                  player: any,
                  index: number
                ) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {index + 1}. {player.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position}
                      </p>

                    </div>

                    <div
                      className="
                        bg-red-100
                        text-red-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold
                      "
                    >
                      {player.red_cards || 0}
                    </div>

                  </div>
                )
              )
            }

          </div>

        </Card>

      </div>

      {/* TABLA POSICIONES */}
      <Card>

        <div className="flex items-center gap-2 mb-6">

          <Trophy
            className="text-yellow-500"
            size={24}
          />

          <h2 className="text-2xl font-bold">
            Tabla de Posiciones
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  bg-gray-100
                  text-gray-600
                  text-sm
                "
              >

                <th className="text-left px-4 py-3">
                  #
                </th>

                <th className="text-left px-4 py-3">
                  Equipo
                </th>

                <th className="text-center px-4 py-3">
                  PJ
                </th>

                <th className="text-center px-4 py-3">
                  PG
                </th>

                <th className="text-center px-4 py-3">
                  PE
                </th>

                <th className="text-center px-4 py-3">
                  PP
                </th>

                <th className="text-center px-4 py-3">
                  PTS
                </th>

              </tr>

            </thead>

            <tbody>

              {
                standings.map(
                  (
                    team: any,
                    index: number
                  ) => (

                    <tr
                      key={team.id}
                      className="
                        border-t
                        hover:bg-gray-50
                      "
                    >

                      <td className="px-4 py-4 font-bold">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ⚽ {team.name}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {team.pj || 0}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {team.pg || 0}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {team.pe || 0}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {team.pp || 0}
                      </td>

                      <td
                        className="
                          px-4
                          py-4
                          text-center
                          font-bold
                          text-blue-600
                        "
                      >
                        {team.points || 0}
                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  )
}

export default Estadisticas