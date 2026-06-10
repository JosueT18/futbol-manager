import { useState, useEffect, Fragment } from "react"

import Swal from "sweetalert2"

import { useQuery } from "@tanstack/react-query"

import {
  getPlayers,
  createPlayer as createPlayerApi,
  deletePlayer as deletePlayerApi,
  updatePlayer as updatePlayerApi,
} from "../api/players"

import { getTeams } from "../api/teams"

import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import TableContainer from "../components/ui/TableContainer"
import Modal from "../components/ui/Modal"

function Jugadores() {

  // =========================
  // ROLE
  // =========================
  const role =
    localStorage.getItem("role") || ""

  const isPlayer =
    role === "Jugador"

  // =========================
  // PERMISSIONS
  // =========================
  const canCreatePlayers =
    role === "Administrador"
    ||
    role === "Tecnico"

  const canEditPlayers =
    role === "Administrador"
    ||
    role === "Tecnico"
    ||
    role === "Comision"

  const canDeletePlayers =
    role === "Administrador"
    ||
    role === "Tecnico"

  // =========================
  // CREATE STATES
  // =========================
  const [name, setName] =
    useState("")

  const [lastname, setLastname] =
    useState("")

  const [age, setAge] =
    useState("")

  const [position, setPosition] =
    useState("")

  const [number, setNumber] =
    useState("")

  const [teamId, setTeamId] =
    useState("")

  // =========================
  // UI STATES
  // =========================
  const [showForm, setShowForm] =
    useState(false)

  const [editModalOpen, setEditModalOpen] =
    useState(false)

  // =========================
  // SELECTED PLAYER
  // =========================
  const [selectedPlayer, setSelectedPlayer] =
    useState<any>(null)

  // =========================
  // EDIT STATES
  // =========================
  const [editName, setEditName] =
    useState("")

  const [editAge, setEditAge] =
    useState("")

  const [editPosition, setEditPosition] =
    useState("")

  const [editNumber, setEditNumber] =
    useState("")

  const [editTeamId, setEditTeamId] =
    useState("")

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("all")

  // =========================
  // DATA
  // =========================
  const [teams, setTeams] =
    useState<any[]>([])

  // =========================
  // ALERTS
  // =========================
  const [successMessage, setSuccessMessage] =
    useState("")

  const [errorMessage, setErrorMessage] =
    useState("")

  // =========================
  // QUERY
  // =========================
  const {
    data: players = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  })

  // =========================
  // PLAYERS ARRAY
  // =========================
  const playersArray =
    Array.isArray(players)
      ? players
      : []

  // =========================
  // FILTERED PLAYERS
  // =========================
  const userTeamId =
  Number(localStorage.getItem("team_id"))

  const filteredPlayers =
  playersArray.filter(
    (player: any) => {

      const fullName =
        `${player.name || ""} ${player.lastname || ""}`

      const matchesSearch =
        fullName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchesStatus =
        isPlayer
          ? player.status === "approved"
          : (
              statusFilter === "all"
              ||
              player.status === statusFilter
            )

      // =========================
      // DIRECTOR / JUGADOR
      // SOLO SU EQUIPO
      // =========================
      const matchesTeam =
        role === "Director"
        ||
        role === "Jugador"
          ? player.team_id === userTeamId
          : true

      return (
        matchesSearch &&
        matchesStatus &&
        matchesTeam
      )
    }
  )

  // =========================
  // LOAD TEAMS
  // =========================
  async function loadTeams() {

    try {

      const data = await getTeams()

      if (Array.isArray(data)) {

        setTeams(data)

      } else {

        setTeams([])
      }

    } catch (error) {

      console.error(error)

      setTeams([])
    }
  }

  // =========================
  // CREATE PLAYER
  // =========================
  async function createPlayer() {

    if (!canCreatePlayers) {
      return
    }

    if (
      !name ||
      !lastname||
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

        lastname,

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
      setLastname("")
      setAge("")
      setPosition("")
      setNumber("")
      setTeamId("")

      setShowForm(false)

      await refetch()

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message
        ||
        "Error al crear jugador"
      )
    }
  }

  // =========================
  // DELETE PLAYER
  // =========================
  async function deletePlayer(id: number) {

    if (!canDeletePlayers) {
      return
    }

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

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message
        ||
        "Error al eliminar jugador"
      )
    }
  }

  // =========================
  // OPEN EDIT
  // =========================
  function openEditModal(player: any) {

    setSelectedPlayer(player)

    setEditName(player.name || "")

    setEditAge(
      player.age?.toString() || ""
    )

    setEditPosition(
      player.position || ""
    )

    setEditNumber(
      player.number?.toString() || ""
    )

    setEditTeamId(
      player.team_id?.toString() || ""
    )

    setEditModalOpen(true)
  }

  // =========================
  // SAVE EDIT
  // =========================
  async function saveEditPlayer() {

    try {

      await updatePlayerApi(
        selectedPlayer.id,
        {

          name: editName,

          age: Number(editAge),

          position: editPosition,

          number: Number(editNumber),

          team_id: Number(editTeamId),
        }
      )

      setSuccessMessage(
        "Jugador actualizado correctamente"
      )

      setErrorMessage("")

      setEditModalOpen(false)

      await refetch()

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message
        ||
        "Error al actualizar jugador"
      )
    }
  }

  // =========================
  // LOAD
  // =========================
  useEffect(() => {

    loadTeams()

  }, [])

  // =========================
  // CLEAR SUCCESS
  // =========================
  useEffect(() => {

    if (successMessage) {

      const timer =
        setTimeout(() => {

          setSuccessMessage("")

        }, 3000)

      return () =>
        clearTimeout(timer)
    }

  }, [successMessage])

  // =========================
  // CLEAR ERROR
  // =========================
  useEffect(() => {

    if (errorMessage) {

      const timer =
        setTimeout(() => {

          setErrorMessage("")

        }, 3000)

      return () =>
        clearTimeout(timer)
    }

  }, [errorMessage])

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-4xl font-bold">
            Jugadores
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de jugadores
          </p>

        </div>

        {
          canCreatePlayers && (

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
          )
        }

      </div>

      {/* ALERTS */}
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

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <Input
            placeholder="Buscar jugador..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {
            !isPlayer && (

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border rounded-xl px-4 py-3 bg-white"
              >

                <option value="all">
                  Todos
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
            )
          }

        </div>

      </div>

      {/* FORM */}
      {
        showForm &&
        canCreatePlayers && (

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
                type="text"
                placeholder="Apellido"
                value={lastname}
                onChange={(e) =>
                  setLastname(e.target.value)
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
                className="border p-3 rounded-xl"
              >

                <option value="">
                  Posición
                </option>

                <option value="Arquero">
                  Arquero
                </option>

                <option value="Defensor">
                  Defensor
                </option>

                <option value="Mediocampista">
                  Mediocampista
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
                  w-full
                  border
                  p-3
                  rounded-xl
                  bg-white
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

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">

        <TableContainer>

          <table className="w-full">

            <thead className="bg-gray-50">

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
                  Equipo
                </th>

                <th className="text-center p-4">
                  Estado
                </th>

                {
                  canEditPlayers && (

                    <th className="text-center p-4">
                      Acciones
                    </th>
                  )
                }

              </tr>

            </thead>

            <tbody>

              {
                filteredPlayers.map(
                  (player: any) => {

                    const team =
                      teams.find(
                        (t: any) =>
                          t.id === player.team_id
                      )

                    return (

                      <Fragment
                        key={player.id}
                      >

                        <tr className="border-t">

                          <td className="p-4">
                            {player.name}
                          </td>

                          <td className="p-4">
                            {player.position}
                          </td>

                          <td className="p-4">
                            {player.number}
                          </td>

                          <td className="p-4">
                            {team?.name || "-"}
                          </td>

                          <td className="p-4 text-center">

                            <Badge
                              status={player.status}
                            />

                          </td>

                          {
                            canEditPlayers && (

                              <td className="p-4">

                                <div className="flex justify-center gap-2">

                                  <Button
                                    variant="secondary"
                                    onClick={() =>
                                      openEditModal(player)
                                    }
                                  >
                                    Editar
                                  </Button>

                                  {
                                    canDeletePlayers && (

                                      <Button
                                        variant="danger"
                                        onClick={() =>
                                          deletePlayer(player.id)
                                        }
                                      >
                                        Eliminar
                                      </Button>
                                    )
                                  }

                                </div>

                              </td>
                            )
                          }

                        </tr>

                      </Fragment>
                    )
                  }
                )
              }

            </tbody>

          </table>

        </TableContainer>

      </div>

      {/* MODAL */}
      <Modal
        open={editModalOpen}
        onClose={() =>
          setEditModalOpen(false)
        }
        title="Editar Jugador"
      >

        <div className="space-y-4">

          <Input
            placeholder="Nombre"
            value={editName}
            onChange={(e) =>
              setEditName(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Edad"
            value={editAge}
            onChange={(e) =>
              setEditAge(e.target.value)
            }
          />

          <Input
            placeholder="Posición"
            value={editPosition}
            onChange={(e) =>
              setEditPosition(e.target.value)
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
              bg-white
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

          <Button onClick={saveEditPlayer}>
            Guardar Cambios
          </Button>

        </div>

      </Modal>

    </div>
  )
}

export default Jugadores