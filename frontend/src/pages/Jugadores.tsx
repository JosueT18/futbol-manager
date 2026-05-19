import { useState, useEffect } from "react"
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
import TableContainer from "../components/ui/TableContainer"
import Modal from "../components/ui/Modal"

function Jugadores() {

  // =========================
  // CREATE STATES
  // =========================
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [position, setPosition] = useState("")
  const [number, setNumber] = useState("")
  const [teamId, setTeamId] = useState("")

  // =========================
  // UI STATES
  // =========================
  const [showForm, setShowForm] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // =========================
  // SELECTED PLAYER
  // =========================
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  // =========================
  // EDIT STATES
  // =========================
  const [editName, setEditName] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editPosition, setEditPosition] = useState("")
  const [editNumber, setEditNumber] = useState("")
  const [editTeamId, setEditTeamId] = useState("")

  // =========================
  // PLAYER STATS
  // =========================
  const [editGoals, setEditGoals] = useState("")
  const [editYellowCards, setEditYellowCards] = useState("")
  const [editRedCards, setEditRedCards] = useState("")
  const [editMatchesPlayed, setEditMatchesPlayed] = useState("")

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // =========================
  // DATA
  // =========================
  const [teams, setTeams] = useState<any[]>([])

  // =========================
  // ALERTS
  // =========================
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // =========================
  // PLAYERS QUERY
  // =========================
  const {
    data: players = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  // =========================
  // FILTER PLAYERS
  // =========================
  const filteredPlayers = players.filter(
    (player: any) => {

      const matchesSearch =
        player.name
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all"
        ||
        player.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    }
  )

  // =========================
  // LOAD TEAMS
  // =========================
  async function loadTeams() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/teams"
      )

      const data = await response.json()

      setTeams(data)

    } catch (error) {

      console.error(error)
    }
  }

  // =========================
  // CREATE PLAYER
  // =========================
  async function createPlayer() {

    if (
      !name ||
      !age ||
      !position ||
      !number ||
      !teamId
    ) {

      setErrorMessage(
        "Todos los campos son obligatorios"
      )

      return
    }

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

      setShowForm(false)

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al crear jugador"
      )
    }
  }

  // =========================
  // DELETE PLAYER
  // =========================
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

  // =========================
  // OPEN EDIT MODAL
  // =========================
  function updatePlayer(player: any) {

    setSelectedPlayer(player)

    setEditName(player.name)
    setEditAge(player.age.toString())
    setEditPosition(player.position)
    setEditNumber(player.number.toString())
    setEditTeamId(player.team_id.toString())

    setEditGoals(
      player.goals?.toString() || "0"
    )

    setEditYellowCards(
      player.yellow_cards?.toString() || "0"
    )

    setEditRedCards(
      player.red_cards?.toString() || "0"
    )

    setEditMatchesPlayed(
      player.matches_played?.toString() || "0"
    )

    setEditModalOpen(true)
  }

  // =========================
  // SAVE PLAYER
  // =========================
  async function saveEditPlayer() {

    if (
      !editName ||
      !editAge ||
      !editPosition ||
      !editNumber ||
      !editTeamId
    ) {

      setErrorMessage(
        "Todos los campos son obligatorios"
      )

      return
    }

    try {

      await updatePlayerApi(
        selectedPlayer.id,
        {
          name: editName,
          age: Number(editAge),
          position: editPosition,
          number: Number(editNumber),
          team_id: Number(editTeamId),

          goals: Number(editGoals),
          yellow_cards: Number(editYellowCards),
          red_cards: Number(editRedCards),
          matches_played: Number(editMatchesPlayed),
        }
      )

      setSuccessMessage(
        "Jugador actualizado correctamente"
      )

      setErrorMessage("")

      setEditModalOpen(false)

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al actualizar jugador"
      )
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    loadTeams()

  }, [])

  // =========================
  // AUTO CLEAR SUCCESS
  // =========================
  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {

        setSuccessMessage("")

      }, 3000)

      return () => clearTimeout(timer)
    }

  }, [successMessage])

  // =========================
  // AUTO CLEAR ERROR
  // =========================
  useEffect(() => {

    if (errorMessage) {

      const timer = setTimeout(() => {

        setErrorMessage("")

      }, 3000)

      return () => clearTimeout(timer)
    }

  }, [errorMessage])

  return (

    <div className="p-6">

      {/* SUCCESS */}
      {
        successMessage && (

          <div className="mb-5 bg-green-100 text-green-800 p-4 rounded-xl">
            ✅ {successMessage}
          </div>
        )
      }

      {/* ERROR */}
      {
        errorMessage && (

          <div className="mb-5 bg-red-100 text-red-800 p-4 rounded-xl">
            ❌ {errorMessage}
          </div>
        )
      }

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-4xl font-bold">
            Jugadores
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión completa de jugadores y estadísticas
          </p>

        </div>

        <Button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {
            showForm
              ? "Cerrar"
              : "+ Crear Jugador"
          }
        </Button>

      </div>

      {/* FILTERS */}
      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          p-5
          mb-6
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
          "
        >

          <Input
            placeholder="Buscar jugador..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              border
              rounded-xl
              px-4
              py-3
              bg-white
              min-w-[220px]
            "
          >

            <option value="all">
              Todos los estados
            </option>

            <option value="pending">
              Pendientes
            </option>

            <option value="approved">
              Aprobados
            </option>

            <option value="rejected">
              Rechazados
            </option>

          </select>

        </div>

      </div>

      {/* CREATE FORM */}
      {
        showForm && (

          <Card>

            <h2 className="text-2xl font-bold mb-5">
              Nuevo Jugador
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                placeholder="Nombre"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Edad"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
              />

              <select
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-xl
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
                onChange={(e) =>
                  setNumber(e.target.value)
                }
              />

              <select
                value={teamId}
                onChange={(e) =>
                  setTeamId(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-xl
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
        )
      }

      {/* LOADING */}
      {
        isLoading && (

          <div className="my-5 bg-yellow-100 text-yellow-800 p-4 rounded-xl">
            ⏳ Cargando jugadores...
          </div>
        )
      }

      {/* TABLE */}
      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <TableContainer>

          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="text-left py-4 px-4">
                  Nombre
                </th>

                <th className="text-left py-4 px-4">
                  Posición
                </th>

                <th className="text-left py-4 px-4">
                  Número
                </th>

                <th className="text-left py-4 px-4">
                  Edad
                </th>

                <th className="text-left py-4 px-4">
                  Equipo
                </th>

                <th className="text-center py-4 px-4">
                  PJ
                </th>

                <th className="text-center py-4 px-4">
                  ⚽
                </th>

                <th className="text-center py-4 px-4">
                  🟨
                </th>

                <th className="text-center py-4 px-4">
                  🟥
                </th>

                <th className="text-center py-4 px-4">
                  Estado
                </th>

                <th className="text-center py-4 px-4">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {
                filteredPlayers.map((player: any) => {

                  const team: any = teams.find(
                    (t: any) =>
                      t.id === player.team_id
                  )

                  return (

                    <tr
                      key={player.id}
                      className="
                        border-t
                        hover:bg-gray-50
                        transition-colors
                      "
                    >

                      <td className="py-4 px-4 font-semibold">
                        ⚽ {player.name}
                      </td>

                      <td className="py-4 px-4">
                        {player.position}
                      </td>

                      <td className="py-4 px-4">
                        {player.number}
                      </td>

                      <td className="py-4 px-4">
                        {player.age}
                      </td>

                      <td className="py-4 px-4">
                        {team?.name}
                      </td>

                      <td className="py-4 px-4 text-center font-medium">
                        {player.matches_played || 0}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-green-600">
                        {player.goals || 0}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-yellow-500">
                        {player.yellow_cards || 0}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-red-500">
                        {player.red_cards || 0}
                      </td>

                      <td className="py-4 px-4 text-center">

                        <Badge
                          status={player.status}
                        />

                        {
                          player.status === "rejected"
                          &&
                          player.rejection_reason && (

                            <p className="text-xs text-red-500 mt-2">
                              {player.rejection_reason}
                            </p>
                          )
                        }

                      </td>

                      <td className="py-4 px-4">

                        <div className="flex justify-center gap-2">

                          <Button
                            variant="secondary"
                            onClick={() =>
                              updatePlayer(player)
                            }
                          >
                            Editar
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              deletePlayer(player.id)
                            }
                          >
                            Eliminar
                          </Button>

                        </div>

                      </td>

                    </tr>
                  )
                })
              }

            </tbody>

          </table>

        </TableContainer>

      </div>

      {/* EDIT MODAL */}
      <Modal
        open={editModalOpen}
        onClose={() =>
          setEditModalOpen(false)
        }
        title="Editar Jugador"
      >

        <div className="space-y-5">

          <Input
            placeholder="Nombre"
            value={editName}
            onChange={(e) =>
              setEditName(e.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <Input
              type="number"
              placeholder="Edad"
              value={editAge}
              onChange={(e) =>
                setEditAge(e.target.value)
              }
            />

            <Input
              type="number"
              placeholder="Número"
              value={editNumber}
              onChange={(e) =>
                setEditNumber(e.target.value)
              }
            />

          </div>

          <select
            value={editPosition}
            onChange={(e) =>
              setEditPosition(e.target.value)
            }
            className="
              w-full
              border
              p-3
              rounded-xl
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

          <select
            value={editTeamId}
            onChange={(e) =>
              setEditTeamId(e.target.value)
            }
            className="
              w-full
              border
              p-3
              rounded-xl
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

          {/* STATS */}
          <div className="border-t pt-5">

            <h3 className="font-semibold mb-4 text-gray-700">
              Estadísticas del Jugador
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <Input
                type="number"
                placeholder="PJ"
                value={editMatchesPlayed}
                onChange={(e) =>
                  setEditMatchesPlayed(e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Goles"
                value={editGoals}
                onChange={(e) =>
                  setEditGoals(e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Amarillas"
                value={editYellowCards}
                onChange={(e) =>
                  setEditYellowCards(e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Rojas"
                value={editRedCards}
                onChange={(e) =>
                  setEditRedCards(e.target.value)
                }
              />

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <Button
              variant="secondary"
              onClick={() =>
                setEditModalOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={saveEditPlayer}
            >
              Guardar Cambios
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  )
}

export default Jugadores