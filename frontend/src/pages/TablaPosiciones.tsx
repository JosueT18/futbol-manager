import { useEffect, useState } from "react"

import Card from "../components/ui/Card"

import {
  getStandings,
} from "../api/standings"

function TablaPosiciones() {

  const [table, setTable] =
    useState<any[]>([])

  async function loadTable() {

    try {

      const data =
        await getStandings()

      setTable(data)

    } catch (error) {

      console.error(error)
    }
  }

  useEffect(() => {

    loadTable()

  }, [])

  return (

    <div className="p-6">

      <div className="mb-6">

        <h1 className="text-4xl font-bold">
          Tabla de Posiciones
        </h1>

        <p className="text-gray-500 mt-2">
          Clasificación del torneo
        </p>

      </div>

      <Card>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="p-4 text-left">
                  #
                </th>

                <th className="p-4 text-left">
                  Equipo
                </th>

                <th className="p-4 text-center">
                  PJ
                </th>

                <th className="p-4 text-center">
                  PG
                </th>

                <th className="p-4 text-center">
                  PE
                </th>

                <th className="p-4 text-center">
                  PP
                </th>

                <th className="p-4 text-center">
                  GF
                </th>

                <th className="p-4 text-center">
                  GC
                </th>

                <th className="p-4 text-center">
                  DG
                </th>

                <th className="p-4 text-center">
                  PTS
                </th>

              </tr>

            </thead>

            <tbody>

              {
                table.map(
                  (
                    team: any,
                    index: number
                  ) => (

                    <tr
                      key={team.team_id}
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >

                      <td className="p-4 font-bold">
                        {index + 1}
                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          {
                            team.logo && (

                              <img
                                src={team.logo}
                                alt=""
                                className="
                                  w-8
                                  h-8
                                  rounded-full
                                  object-cover
                                "
                              />
                            )
                          }

                          <span className="font-semibold">
                            {team.team_name}
                          </span>

                        </div>

                      </td>

                      <td className="p-4 text-center">
                        {team.played}
                      </td>

                      <td className="p-4 text-center">
                        {team.won}
                      </td>

                      <td className="p-4 text-center">
                        {team.drawn}
                      </td>

                      <td className="p-4 text-center">
                        {team.lost}
                      </td>

                      <td className="p-4 text-center">
                        {team.goals_for}
                      </td>

                      <td className="p-4 text-center">
                        {team.goals_against}
                      </td>

                      <td className="p-4 text-center">
                        {team.goal_difference}
                      </td>

                      <td className="p-4 text-center font-bold">
                        {team.points}
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

export default TablaPosiciones