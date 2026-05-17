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
    ).length

  const approvedPlayers =
    players.filter(
      (p: any) =>
        p.status === "approved"
    ).length

  const rejectedPlayers =
    players.filter(
      (p: any) =>
        p.status === "rejected"
    ).length

  // =========================
  // PIE CHART DATA
  // =========================
  const pieData = [
    {
      name: "Pendientes",
      value: pendingPlayers,
      color: "#facc15",
    },
    {
      name: "Aprobados",
      value: approvedPlayers,
      color: "#22c55e",
    },
    {
      name: "Rechazados",
      value: rejectedPlayers,
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
        team.players?.length || 0,
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
            Jugadores
          </p>

          <h2 className="text-5xl font-bold mt-3 text-blue-600">
            {players.length}
          </h2>

        </div>

        {/* PENDING */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Pendientes
          </p>

          <h2 className="text-5xl font-bold mt-3 text-yellow-500">
            {pendingPlayers}
          </h2>

        </div>

        {/* APPROVED */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Aprobados
          </p>

          <h2 className="text-5xl font-bold mt-3 text-green-500">
            {approvedPlayers}
          </h2>

        </div>

        {/* REJECTED */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Rechazados
          </p>

          <h2 className="text-5xl font-bold mt-3 text-red-500">
            {rejectedPlayers}
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
            Jugadores por Equipo
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

    </div>
  )
}

export default Dashboard