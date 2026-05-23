import { useQuery } from "@tanstack/react-query"

import StatCard from "../components/ui/StatCard"

import {
  getPlayers,
} from "../api/players"

import {
  getTeams,
} from "../api/teams"

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

  const pendingPlayers = players.filter(
    (player: any) =>
      player.status === "pending"
  )

  const approvedPlayers = 
    Array.isArray(players)
      ?players.filter(
        (p: any) =>
          p.status === "aproved"   
  )
  : []

  const averageAge =
    players.length > 0
      ? Math.round(
          players.reduce(
            (
              acc: number,
              player: any
            ) => acc + player.age,
            0
          ) / players.length
        )
      : 0

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-bold
            text-gray-800
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-gray-500
            mt-1
          "
        >
          Resumen general del sistema
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
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
          title="Pendientes"
          value={pendingPlayers.length}
          icon="⏳"
          color="bg-yellow-500"
        />

        <StatCard
          title="Edad Promedio"
          value={averageAge}
          icon="📊"
          color="bg-purple-600"
        />

      </div>

      <div
        className="
          mt-8
          bg-white
          rounded-2xl
          border border-gray-100
          shadow-sm
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            text-gray-800
            mb-4
          "
        >
          Jugadores aprobados
        </h2>

        <div className="space-y-4">

          {
            approvedPlayers
              .slice(0, 5)
              .map((player: any) => (

                <div
                  key={player.id}
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    pb-3
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

                  <span
                    className="
                      text-xs
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                    "
                  >
                    Aprobado
                  </span>

                </div>
              ))
          }

          {
            approvedPlayers.length === 0 && (

              <p className="text-gray-500 text-sm">

                No hay jugadores aprobados

              </p>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default Home