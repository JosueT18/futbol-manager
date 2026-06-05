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

  const canManagePlayers =
    role === "Administrador"
    ||
    role === "Director"
    ||
    role === "Comision"
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

  const [editLastname, setEditLastname] =
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

    if (!canManagePlayers) {
      return
    }

    if (
      !name ||
      !lastname ||
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

    if (
      Number(age) <= 0 ||
      Number(number) <= 0
    ) {

      setErrorMessage(
        "Edad y número deben ser positivos"
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

    if (!canManagePlayers) {
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

    setEditLastname(player.lastname || "")

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

    if (
      !editName ||
      !editLastname ||
      !editAge ||
      !editPosition ||
      !editNumber ||
      !editTeamId
    ) {

      setErrorMessage(
        "Completa todos los campos"
      )

      return
    }

    if (
      Number(editAge) <= 0 ||
      Number(editNumber) <= 0
    ) {

      setErrorMessage(
        "Edad y número deben ser positivos"
      )

      return
    }

    try {

      await updatePlayerApi(
        selectedPlayer.id,
        {

          name: editName,

          lastname: editLastname,

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

            {
              isPlayer
                ? "Plantilla general"
                : "Gestión de jugadores"
            }

          </p>

        </div>

        {
          canManagePlayers && (

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

      {/* CREATE FORM */}
      {
        showForm &&
        canManagePlayers && (

          <Card>

            <h2 className="text-2xl font-bold mb-5">
              Nuevo Jugador
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NOMBRE */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Nombre
                </label>

                <Input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              {/* APELLIDO */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Apellido
                </label>

                <Input
                  value={lastname}
                  onChange={(e) =>
                    setLastname(e.target.value)
                  }
                />

              </div>

              {/* EDAD */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Edad
                </label>

                <Input
                  type="number"
                  min={1}
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value)
                  }
                />

              </div>

              {/* POSICION */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Posición
                </label>

                <select
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value)
                  }
                  className="
                    w-full
                    border border-gray-300
                    p-3
                    rounded-xl
                    bg-white
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

                  <option value="Volante Central">
                    Volante Central
                  </option>

                  <option value="Volante Derecho">
                    Volante Derecho
                  </option>

                  <option value="Volante Izquierdo">
                    Volante Izquierdo
                  </option>

                  <option value="Enganche">
                    Enganche
                  </option>

                  <option value="Extremo Derecho">
                    Extremo Derecho
                  </option>

                  <option value="Extremo Izquierdo">
                    Extremo Izquierdo
                  </option>

                  <option value="Delantero">
                    Delantero
                  </option>

                </select>

              </div>

              {/* NUMERO */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Número
                </label>

                <Input
                  type="number"
                  min={1}
                  value={number}
                  onChange={(e) =>
                    setNumber(e.target.value)
                  }
                />

              </div>

              {/* EQUIPO */}
              <div>

                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Equipo
                </label>

                <select
                  value={teamId}
                  onChange={(e) =>
                    setTeamId(e.target.value)
                  }
                  className="
                    w-full
                    border border-gray-300
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

          {
            isLoading ? (

              <div className="p-6">
                Cargando jugadores...
              </div>

            ) : (

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
                      ⚽
                    </th>

                    <th className="text-center p-4">
                      Estado
                    </th>

                    {
                      canManagePlayers && (

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
                                {" "}
                                {player.lastname}
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
                                {player.goals || 0}
                              </td>

                              <td className="p-4 text-center">

                                <Badge
                                  status={player.status}
                                />

                              </td>

                              {
                                canManagePlayers && (

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
            )
          }

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
            placeholder="Apellido"
            value={editLastname}
            onChange={(e) =>
              setEditLastname(e.target.value)
            }
          />

          <Input
            type="number"
            min={1}
            placeholder="Edad"
            value={editAge}
            onChange={(e) =>
              setEditAge(e.target.value)
            }
          />

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
              bg-white
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

            <option value="Volante Central">
              Volante Central
            </option>

            <option value="Volante Derecho">
              Volante Derecho
            </option>

            <option value="Volante Izquierdo">
              Volante Izquierdo
            </option>

            <option value="Enganche">
              Enganche
            </option>

            <option value="Extremo Derecho">
              Extremo Derecho
            </option>

            <option value="Extremo Izquierdo">
              Extremo Izquierdo
            </option>

            <option value="Delantero">
              Delantero
            </option>

          </select>

          <Input
            type="number"
            min={1}
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