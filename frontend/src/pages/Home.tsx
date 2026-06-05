import { useEffect, useState } from "react"

import Card from "../components/ui/Card"

import {
getDashboard,
} from "../api/dashboard"

function Home() {

const [data, setData] =
useState<any>(null)

useEffect(() => {

loadDashboard()

}, [])

async function loadDashboard() {

try {

  const response =
    await getDashboard()

  setData(response)

} catch (error) {

  console.error(error)
}

}

if (!data) {

return (

  <div className="p-6">

    Cargando dashboard...

  </div>
)

}

return (

<div className="p-6">

  {/* HEADER */}
  <div className="mb-8">

    <h1 className="text-4xl font-bold">
      Dashboard
    </h1>

    <p className="text-gray-500 mt-2">
      Resumen general del torneo
    </p>

  </div>


  {/* CARDS */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

    <Card>

      <div>

        <p className="text-gray-500">
          Equipos
        </p>

        <h2 className="text-4xl font-bold mt-2">

          {data.total_teams}

        </h2>

      </div>

    </Card>


    <Card>

      <div>

        <p className="text-gray-500">
          Jugadores
        </p>

        <h2 className="text-4xl font-bold mt-2">

          {data.total_players}

        </h2>

      </div>

    </Card>


    <Card>

      <div>

        <p className="text-gray-500">
          Partidos
        </p>

        <h2 className="text-4xl font-bold mt-2">

          {data.total_matches}

        </h2>

      </div>

    </Card>


    <Card>

      <div>

        <p className="text-gray-500">
          Goles
        </p>

        <h2 className="text-4xl font-bold mt-2 text-green-600">

          ⚽ {data.total_goals}

        </h2>

      </div>

    </Card>

  </div>


  {/* TOP SCORER */}
  <div className="mt-10">

    <Card>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500">
            Máximo goleador
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {data.top_scorer}

          </h2>

        </div>

        <div className="text-5xl font-bold text-green-600">

          ⚽ {data.top_scorer_goals}

        </div>

      </div>

    </Card>

  </div>


  {/* LAST MATCHES */}
  <div className="mt-10">

    <h2 className="text-2xl font-bold mb-5">
      Últimos Partidos
    </h2>

    <div className="space-y-4">

      {
        data.latest_matches.map(
          (match: any) => (

            <Card key={match.id}>

              <div className="flex items-center justify-between">

                <div className="font-semibold">

                  {match.home_team}

                </div>

                <div className="text-2xl font-bold">

                  {match.home_score}
                  {" - "}
                  {match.away_score}

                </div>

                <div className="font-semibold">

                  {match.away_team}

                </div>

              </div>

            </Card>
          )
        )
      }

    </div>

  </div>

</div>

)
}

export default Home