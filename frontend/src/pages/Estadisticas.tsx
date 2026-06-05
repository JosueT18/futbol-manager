import { useEffect, useState } from "react"

import Card from "../components/ui/Card"

import { getStats } from "../api/stats"

function Estadisticas() {

  const [stats, setStats] =
    useState<any>(null)

  async function loadStats() {

    try {

      const data =
        await getStats()

      setStats(data)

    } catch (error) {

      console.error(error)
    }
  }

  useEffect(() => {

    loadStats()

  }, [])

  if (!stats) {

    return (

      <div className="p-6">
        Cargando estadísticas...
      </div>
    )
  }

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-bold">
          Estadísticas
        </h1>

        <p className="text-gray-500 mt-2">
          Resumen general del torneo
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>

          <h2 className="text-lg font-semibold">
            Jugadores
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.total_players}
          </p>

        </Card>

        <Card>

          <h2 className="text-lg font-semibold">
            Equipos
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.total_teams}
          </p>

        </Card>

        <Card>

          <h2 className="text-lg font-semibold">
            Partidos
          </h2>

          <p className="text-4xl font-bold mt-3">
            {stats.total_matches}
          </p>

        </Card>

      </div>

      {/* GOLEADORES */}
      <Card>

        <h2 className="text-2xl font-bold mb-5">
          Ranking de Goleadores
        </h2>

        <div className="space-y-3">

          {
            stats.top_scorers?.length > 0 ? (

              stats.top_scorers.map(
                (player: any) => (

                  <div
                    key={player.player_id}
                    className="
                      flex
                      justify-between
                      items-center
                      border-b
                      pb-3
                    "
                  >

                    <div>

                      <p className="font-semibold">

                        {player.name}
                        {" "}
                        {player.lastname}

                      </p>

                      <p className="text-sm text-gray-500">

                        {player.team}

                      </p>

                    </div>

                    <div className="text-2xl font-bold">

                      ⚽ {player.goals}

                    </div>

                  </div>
                )
              )

            ) : (

              <p className="text-gray-500">
                No hay goles registrados
              </p>
            )
          }

        </div>

      </Card>

      {/* GOLEADOR POR EQUIPO */}
      <Card>

        <h2 className="text-2xl font-bold mb-5">
          Goleador por Equipo
        </h2>

        <div className="space-y-3">

          {
            stats.team_top_scorers?.length > 0 ? (

              stats.team_top_scorers.map(
                (team: any, index: number) => (

                  <div
                    key={index}
                    className="
                      flex
                      justify-between
                      items-center
                      border-b
                      pb-3
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {team.team}
                      </p>

                      <p className="text-sm text-gray-500">
                        {team.player}
                      </p>

                    </div>

                    <div className="text-xl font-bold">

                      ⚽ {team.goals}

                    </div>

                  </div>
                )
              )

            ) : (

              <p className="text-gray-500">
                Sin datos
              </p>
            )
          }

        </div>

      </Card>

    </div>
  )
}

export default Estadisticas