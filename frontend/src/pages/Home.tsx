import { useQuery } from "@tanstack/react-query"

import StatCard from "../components/ui/StatCard"
import Card from "../components/ui/Card"

import { getPlayers } from "../api/players"
import { getTeams } from "../api/teams"

function Home() {

  const {
    data: players = [],
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  const {
    data: teams = [],
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  const approvedPlayers = players.filter(
    (p: any) => p.status === "approved"
  )

  const pendingPlayers = players.filter(
    (p: any) => p.status === "pending"
  )

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Panel general del sistema
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <StatCard
          title="Jugadores"
          value={players.length}
          icon="⚽"
          color="bg-blue-600"
        />

        <StatCard
          title="Equipos"
          value={teams.length}
          icon="🏆"
          color="bg-green-600"
        />

        <StatCard
          title="Aprobados"
          value={approvedPlayers.length}
          icon="✅"
          color="bg-emerald-600"
        />

        <StatCard
          title="Pendientes"
          value={pendingPlayers.length}
          icon="⏳"
          color="bg-yellow-500"
        />

      </div>

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
        "
      >

        <Card>

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Últimos jugadores
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Jugadores registrados recientemente
              </p>

            </div>

          </div>

          <div className="space-y-4">

            {
              players.slice(0, 5).map((player: any) => (

                <div
                  key={player.id}
                  className="
                    flex
                    items-center
                    justify-between
                    border border-gray-100
                    rounded-xl
                    p-4
                    hover:bg-gray-50
                    transition
                  "
                >

                  <div>

                    <p className="font-medium text-gray-800">
                      {player.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {player.position}
                    </p>

                  </div>

                  <div className="text-sm text-gray-400">

                    #{player.number}

                  </div>

                </div>
              ))
            }

          </div>

        </Card>

        <Card>

          <div className="mb-5">

            <h2 className="text-xl font-semibold text-gray-800">
              Resumen
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Información general del sistema
            </p>

          </div>

          <div className="space-y-5">

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-gray-600">
                  Jugadores aprobados
                </span>

                <span className="text-sm font-medium">
                  {approvedPlayers.length}
                </span>

              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">

                <div
                  className="
                    bg-emerald-500
                    h-3
                    rounded-full
                  "
                  style={{
                    width: `${
                      players.length
                        ? (approvedPlayers.length / players.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-gray-600">
                  Jugadores pendientes
                </span>

                <span className="text-sm font-medium">
                  {pendingPlayers.length}
                </span>

              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">

                <div
                  className="
                    bg-yellow-500
                    h-3
                    rounded-full
                  "
                  style={{
                    width: `${
                      players.length
                        ? (pendingPlayers.length / players.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

        </Card>

      </div>

    </div>
  )
}

export default Home