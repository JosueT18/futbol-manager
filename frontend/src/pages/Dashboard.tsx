import { useQuery } from "@tanstack/react-query"

function Dashboard() {

  // =========================
  // TEAMS
  // =========================
  const {
    data: teams = [],
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {

      const response = await fetch(
        "http://127.0.0.1:8000/teams"
      )

      return response.json()
    },
  })

  // =========================
  // PLAYERS
  // =========================
  const {
    data: players = [],
  } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {

      const response = await fetch(
        "http://127.0.0.1:8000/players"
      )

      return response.json()
    },
  })

  // =========================
  // STATS
  // =========================
  const approvedPlayers = players.filter(
    (p: any) => p.status === "approved"
  )

  const pendingPlayers = players.filter(
    (p: any) => p.status === "pending"
  )

  const rejectedPlayers = players.filter(
    (p: any) => p.status === "rejected"
  )

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen general del sistema
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* EQUIPOS */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Equipos
          </p>

          <h2 className="text-5xl font-bold mt-4 text-green-600">
            {teams.length}
          </h2>

        </div>

        {/* JUGADORES */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Jugadores
          </p>

          <h2 className="text-5xl font-bold mt-4 text-blue-600">
            {players.length}
          </h2>

        </div>

        {/* APROBADOS */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Aprobados
          </p>

          <h2 className="text-5xl font-bold mt-4 text-emerald-600">
            {approvedPlayers.length}
          </h2>

        </div>

        {/* PENDIENTES */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <p className="text-gray-500 text-sm">
            Pendientes
          </p>

          <h2 className="text-5xl font-bold mt-4 text-yellow-500">
            {pendingPlayers.length}
          </h2>

        </div>

      </div>

      {/* SEGUNDA FILA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">

        {/* RECHAZADOS */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <h2 className="text-xl font-semibold mb-4">
            Jugadores Rechazados
          </h2>

          <p className="text-6xl font-bold text-red-500">
            {rejectedPlayers.length}
          </p>

        </div>

        {/* ÚLTIMOS JUGADORES */}
        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border border-gray-100
          "
        >

          <h2 className="text-xl font-semibold mb-4">
            Últimos Jugadores
          </h2>

          <div className="space-y-3">

            {
              players
                .slice(-5)
                .reverse()
                .map((player: any) => (

                  <div
                    key={player.id}
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      pb-2
                    "
                  >

                    <div>

                      <p className="font-medium">
                        ⚽ {player.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position}
                      </p>

                    </div>

                    <span
                      className="
                        text-xs
                        bg-gray-100
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      {player.status}
                    </span>

                  </div>
                ))
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard