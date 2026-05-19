import { useQuery } from "@tanstack/react-query"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

function Dashboard() {

  // =========================
  // PLAYERS
  // =========================
  const {
    data: players = [],
  } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {

      const res = await fetch(
        "http://127.0.0.1:8000/players"
      )

      return res.json()
    },
  })

  // =========================
  // TEAMS
  // =========================
  const {
    data: teams = [],
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {

      const res = await fetch(
        "http://127.0.0.1:8000/teams"
      )

      return res.json()
    },
  })

  // =========================
  // METRICS
  // =========================
  const pendingPlayers =
    players.filter(
      (p: any) =>
        p.status === "pending"
    )

  const approvedPlayers =
    players.filter(
      (p: any) =>
        p.status === "approved"
    )

  const rejectedPlayers =
    players.filter(
      (p: any) =>
        p.status === "rejected"
    )

  // =========================
  // PIE CHART DATA
  // =========================
  const pieData = [
    {
      name: "Pendientes",
      value: pendingPlayers.length,
      color: "#facc15",
    },
    {
      name: "Aprobados",
      value: approvedPlayers.length,
      color: "#22c55e",
    },
    {
      name: "Rechazados",
      value: rejectedPlayers.length,
      color: "#ef4444",
    },
  ]

  // =========================
  // BAR CHART DATA
  // =========================
  const barData = teams.map(
    (team: any) => ({

      name: team.name,

      jugadores:
        team.players?.filter(
          (player: any) =>
            player.status === "approved"
        ).length || 0,
    })
  )

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen general del sistema
        </p>

      </div>

      {/* METRICS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-5
          gap-5
          mb-8
        "
      >

        {/* TEAMS */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Equipos
          </p>

          <h2 className="text-5xl font-bold mt-3 text-green-600">
            {teams.length}
          </h2>

        </div>

        {/* PLAYERS */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Jugadores Aprobados
          </p>

          <h2 className="text-5xl font-bold mt-3 text-blue-600">
            {approvedPlayers.length}
          </h2>

        </div>

        {/* PENDING */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Pendientes
          </p>

          <h2 className="text-5xl font-bold mt-3 text-yellow-500">
            {pendingPlayers.length}
          </h2>

        </div>

        {/* APPROVED */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Aprobados
          </p>

          <h2 className="text-5xl font-bold mt-3 text-green-500">
            {approvedPlayers.length}
          </h2>

        </div>

        {/* REJECTED */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Rechazados
          </p>

          <h2 className="text-5xl font-bold mt-3 text-red-500">
            {rejectedPlayers.length}
          </h2>

        </div>

      </div>

      {/* CHARTS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* PIE CHART */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            p-6
          "
        >

          <h2 className="text-2xl font-bold mb-6">
            Estado de Jugadores
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {
                    pieData.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={entry.color}
                      />
                    ))
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BAR CHART */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            p-6
          "
        >

          <h2 className="text-2xl font-bold mb-6">
            Jugadores Aprobados por Equipo
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer>

              <BarChart data={barData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="jugadores"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* REJECTED PLAYERS */}
      <div className="mt-8">

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            p-6
          "
        >

          <h2 className="text-2xl font-bold mb-5 text-red-500">
            Jugadores Rechazados
          </h2>

          {
            rejectedPlayers.length > 0
              ? (

                <div className="space-y-3">

                  {
                    rejectedPlayers.map(
                      (player: any) => (

                        <div
                          key={player.id}
                          className="
                            border
                            border-red-100
                            bg-red-50
                            rounded-xl
                            p-4
                          "
                        >

                          <div className="flex justify-between items-center">

                            <div>

                              <p className="font-semibold text-gray-800">
                                ⚽ {player.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {player.position}
                              </p>

                            </div>

                            <div
                              className="
                                text-sm
                                text-red-600
                                font-medium
                              "
                            >

                              Motivo:
                              {" "}
                              {
                                player.rejection_reason
                                || "Sin motivo"
                              }

                            </div>

                          </div>

                        </div>
                      )
                    )
                  }

                </div>
              )
              : (

                <p className="text-gray-400">
                  No hay jugadores rechazados
                </p>
              )
          }

        </div>

      </div>

    </div>
  )
}

export default Dashboard