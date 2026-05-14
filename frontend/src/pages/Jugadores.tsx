import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useQuery } from "@tanstack/react-query"

import {
  getPlayers,
  createPlayer as createPlayerApi,
  deletePlayer as deletePlayerApi,
  updatePlayer as updatePlayerApi,
} from "../api/players"

import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import PageHeader from "../components/ui/PageHeader"
import TableContainer from "../components/ui/TableContainer"

function Jugadores() {

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [position, setPosition] = useState("")
  const [number, setNumber] = useState("")
  const [teamId, setTeamId] = useState("")

  const [teams, setTeams] = useState([])

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    data: players = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  async function loadTeams() {

    const response = await fetch(
      "http://127.0.0.1:8000/teams"
    )

    const data = await response.json()

    setTeams(data)
  }

  async function createPlayer() {

    try {

      await createPlayerApi({
        name,
        age: Number(age),
        position,
        number: Number(number),
        team_id: Number(teamId),
      })

      setSuccessMessage(
        "Jugador creado correctamente"
      )

      setErrorMessage("")

      setName("")
      setAge("")
      setPosition("")
      setNumber("")
      setTeamId("")

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al crear jugador"
      )
    }
  }

  async function deletePlayer(id: number) {

    const result = await Swal.fire({
      title: "¿Eliminar jugador?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) {
      return
    }

    try {

      await deletePlayerApi(id)

      setSuccessMessage(
        "Jugador eliminado correctamente"
      )

      setErrorMessage("")

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al eliminar jugador"
      )
    }
  }

  async function updatePlayer(player: any) {

    const newName = prompt(
      "Nuevo nombre",
      player.name
    )

    const newPosition = prompt(
      "Nueva posición",
      player.position
    )

    if (!newName || !newPosition) {
      return
    }

    try {

      await updatePlayerApi(
        player.id,
        {
          name: newName,
          position: newPosition,
        }
      )

      setSuccessMessage(
        "Jugador actualizado correctamente"
      )

      setErrorMessage("")

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al actualizar jugador"
      )
    }
  }

  useEffect(() => {

    loadTeams()

  }, [])

  useEffect(() => {

    if (successMessage) {

      setTimeout(() => {

        setSuccessMessage("")

      }, 3000)
    }

  }, [successMessage])

  useEffect(() => {

    if (errorMessage) {

      setTimeout(() => {

        setErrorMessage("")

      }, 3000)
    }

  }, [errorMessage])

  return (

    <div className="p-6">

      {
        successMessage && (

          <div className="mb-5 bg-green-100 text-green-800 p-4 rounded-xl">

            ✅ {successMessage}

          </div>
        )
      }

      {
        errorMessage && (

          <div className="mb-5 bg-red-100 text-red-800 p-4 rounded-xl">

            ❌ {errorMessage}

          </div>
        )
      }

      <PageHeader
        title="Jugadores"
        subtitle="Administración de jugadores"
      />

      <Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="
              border border-gray-300
              p-3
              rounded-xl
              text-sm
              focus:border-black
              focus:ring-2
              focus:ring-black/10
              outline-none
            "
          >

            <option value="">
              Seleccionar posición
            </option>

            <option value="Arquero">
              Arquero
            </option>

            <option value="Defensor Central">
              Defensor Central
            </option>

            <option value="Lateral Derecho">
              Lateral Derecho
            </option>

            <option value="Lateral Izquierdo">
              Lateral Izquierdo
            </option>

            <option value="Mediocampista">
              Mediocampista
            </option>

            <option value="Volante Ofensivo">
              Volante Ofensivo
            </option>

            <option value="Extremo">
              Extremo
            </option>

            <option value="Delantero">
              Delantero
            </option>

          </select>

          <Input
            type="number"
            placeholder="Número"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="
              border border-gray-300
              p-3
              rounded-xl
              text-sm
              focus:border-black
              focus:ring-2
              focus:ring-black/10
              outline-none
            "
          >

            <option value="">
              Seleccionar equipo
            </option>

            {
              teams.map((team: any) => (

                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))
            }

          </select>

        </div>

        <div className="mt-5">

          <Button onClick={createPlayer}>
            Crear Jugador
          </Button>

        </div>

      </Card>

      {
        isLoading && (

          <div className="my-5 bg-yellow-100 text-yellow-800 p-4 rounded-xl">

            ⏳ Cargando jugadores...

          </div>
        )
      }

      <div className="mt-8">

        <TableContainer>

          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="text-left p-4">
                  Nombre
                </th>

                <th className="text-left p-4">
                  Posición
                </th>

                <th className="text-left p-4">
                  Número
                </th>

                <th className="text-left p-4">
                  Edad
                </th>

                <th className="text-left p-4">
                  Equipo
                </th>

                <th className="text-left p-4">
                  Estado
                </th>

                <th className="text-left p-4">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {
                players.map((player: any) => {

                  const team: any = teams.find(
                    (t: any) => t.id === player.team_id
                  )

                  return (

                    <tr
                      key={player.id}
                      className="
                        border-t
                        hover:bg-gray-50
                        transition
                      "
                    >

                      <td className="p-4">
                        ⚽ {player.name}
                      </td>

                      <td className="p-4">
                        {player.position}
                      </td>

                      <td className="p-4">
                        #{player.number}
                      </td>

                      <td className="p-4">
                        {player.age}
                      </td>

                      <td className="p-4">
                        {team?.name}
                      </td>

                      <td className="p-4">

                        <Badge status={player.status} />

                      </td>

                      <td className="p-4 flex gap-3">

                        <Button
                          variant="secondary"
                          onClick={() => updatePlayer(player)}
                        >
                          Editar
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => deletePlayer(player.id)}
                        >
                          Eliminar
                        </Button>

                      </td>

                    </tr>
                  )
                })
              }

            </tbody>

          </table>

        </TableContainer>

      </div>

    </div>
  )
}

export default Jugadores