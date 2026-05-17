import { Fragment, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useQuery } from "@tanstack/react-query"

import {
  getTeams,
  createTeam as createTeamApi,
  deleteTeam as deleteTeamApi,
  updateTeam as updateTeamApi,
} from "../api/teams"

import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Card from "../components/ui/Card"
import TableContainer from "../components/ui/TableContainer"

function Equipos() {

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [tecnico, setTecnico] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [openTeamId, setOpenTeamId] =
    useState<number | null>(null)

  const [successMessage, setSuccessMessage] =
    useState("")

  const [errorMessage, setErrorMessage] =
    useState("")

  // =========================
  // TEAMS
  // =========================
  const {
    data: teams = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  // =========================
  // CREATE TEAM
  // =========================
  async function createTeam() {

    if (
      !name ||
      !city ||
      !tecnico
    ) {

      setErrorMessage(
        "Todos los campos son obligatorios"
      )

      return
    }

    try {

      await createTeamApi({
        name,
        city,
        tecnico,
      })

      setSuccessMessage(
        "Equipo creado correctamente"
      )

      setErrorMessage("")

      setName("")
      setCity("")
      setTecnico("")

      setShowForm(false)

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al crear equipo"
      )
    }
  }

  // =========================
  // DELETE TEAM
  // =========================
  async function deleteTeam(id: number) {

    const result = await Swal.fire({
      title: "¿Eliminar equipo?",
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

      await deleteTeamApi(id)

      setSuccessMessage(
        "Equipo eliminado correctamente"
      )

      setErrorMessage("")

      await refetch()

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message ||
        "Error al eliminar equipo"
      )
    }
  }

  // =========================
  // UPDATE TEAM
  // =========================
  async function updateTeam(team: any) {

    const newName = prompt(
      "Nuevo nombre",
      team.name
    )

    const newCity = prompt(
      "Nueva ciudad",
      team.city
    )

    const newTecnico = prompt(
      "Nuevo técnico",
      team.tecnico
    )

    if (
      !newName ||
      !newCity ||
      !newTecnico
    ) {
      return
    }

    try {

      await updateTeamApi(
        team.id,
        {
          name: newName,
          city: newCity,
          tecnico: newTecnico,
        }
      )

      setSuccessMessage(
        "Equipo actualizado correctamente"
      )

      setErrorMessage("")

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al actualizar equipo"
      )
    }
  }

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

          <div
            className="
              mb-5
              bg-green-100
              text-green-800
              p-4
              rounded-xl
            "
          >
            ✅ {successMessage}
          </div>
        )
      }

      {/* ERROR */}
      {
        errorMessage && (

          <div
            className="
              mb-5
              bg-red-100
              text-red-800
              p-4
              rounded-xl
            "
          >
            ❌ {errorMessage}
          </div>
        )
      }

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <h1 className="text-4xl font-bold">
          Equipos
        </h1>

        <Button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {
            showForm
              ? "Cerrar"
              : "+ Crear Equipo"
          }
        </Button>

      </div>

      {/* FORM */}
      {
        showForm && (

          <Card>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-4
              "
            >

              <Input
                placeholder="Nombre"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <Input
                placeholder="Ciudad"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              />

              <Input
                placeholder="Director Técnico"
                value={tecnico}
                onChange={(e) =>
                  setTecnico(e.target.value)
                }
              />

            </div>

            <div className="mt-5">

              <Button onClick={createTeam}>
                Crear Equipo
              </Button>

            </div>

          </Card>
        )
      }

      {/* LOADING */}
      {
        isLoading && (

          <div
            className="
              my-5
              bg-yellow-100
              text-yellow-800
              p-4
              rounded-xl
            "
          >
            ⏳ Cargando equipos...
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

            <thead
              className="
                bg-gray-50
                text-gray-600
                text-sm
              "
            >

              <tr>

                <th className="text-left py-3 px-4">
                  Equipo
                </th>

                <th className="text-left py-3 px-4">
                  Ciudad
                </th>

                <th className="text-left py-3 px-4">
                  Técnico
                </th>

                <th className="text-left py-3 px-4">
                  Cantidad
                </th>

                <th className="text-left py-3 px-4">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {
                teams.map((team: any) => (

                  <Fragment key={team.id}>

                    {/* FILA PRINCIPAL */}
                    <tr
                      className="
                        border-t
                        hover:bg-gray-50
                        transition-colors
                      "
                    >

                      {/* EQUIPO */}
                      <td className="py-4 px-4">

                        <button
                          onClick={() =>

                            setOpenTeamId(

                              openTeamId === team.id
                                ? null
                                : team.id
                            )
                          }
                          className="
                            text-left
                            w-full
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                w-11
                                h-11
                                rounded-full
                                bg-blue-100
                                flex
                                items-center
                                justify-center
                                text-xl
                              "
                            >
                              ⚽
                            </div>

                            <div>

                              <p
                                className="
                                  text-lg
                                  font-bold
                                  text-gray-800
                                "
                              >
                                {team.name}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-400
                                "
                              >
                                {
                                  openTeamId === team.id
                                    ? "Ocultar jugadores"
                                    : "Click para ver jugadores"
                                }
                              </p>

                            </div>

                          </div>

                        </button>

                      </td>

                      {/* CIUDAD */}
                      <td className="py-4 px-4">
                        📍 {team.city}
                      </td>

                      {/* TECNICO */}
                      <td className="py-4 px-4">
                        👨‍🏫 {team.tecnico}
                      </td>

                      {/* CANTIDAD */}
                      <td className="py-4 px-4">

                        <div
                          className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            inline-block
                            font-semibold
                            text-sm
                          "
                        >
                          {team.players?.length || 0}
                        </div>

                      </td>

                      {/* ACCIONES */}
                      <td
                        className="
                          py-4
                          px-4
                        "
                      >

                        <div className="flex gap-2">

                          <Button
                            variant="secondary"
                            onClick={() =>
                              updateTeam(team)
                            }
                          >
                            Editar
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              deleteTeam(team.id)
                            }
                          >
                            Eliminar
                          </Button>

                        </div>

                      </td>

                    </tr>

                    {/* JUGADORES */}
                    {
                      openTeamId === team.id && (

                        <tr className="bg-gray-50">

                          <td
                            colSpan={5}
                            className="
                              px-8
                              py-5
                            "
                          >

                            {
                              team.players?.length > 0
                                ? (

                                  <div className="space-y-2">

                                    {
                                      team.players.map(
                                        (player: any) => (

                                          <div
                                            key={player.id}
                                            className="
                                              flex
                                              items-center
                                              justify-between
                                              bg-white
                                              rounded-xl
                                              px-4
                                              py-2
                                              shadow-sm
                                              text-sm
                                            "
                                          >

                                            {/* IZQUIERDA */}
                                            <div
                                              className="
                                                flex
                                                items-center
                                                gap-3
                                              "
                                            >

                                              <span>
                                                ⚽
                                              </span>

                                              <span
                                                className="
                                                  font-medium
                                                  text-sm
                                                "
                                              >
                                                {player.name}
                                              </span>

                                            </div>

                                            {/* DERECHA */}
                                            <div
                                              className="
                                                flex
                                                items-center
                                                gap-5
                                                text-gray-500
                                                text-xs
                                              "
                                            >

                                              <span>
                                                {
                                                  player.position
                                                }
                                              </span>

                                              <span>                                                
                                                {
                                                  player.number
                                                }
                                              </span>

                                              <span>
                                                {
                                                  player.age
                                                } años
                                              </span>

                                            </div>

                                          </div>
                                        )
                                      )
                                    }

                                  </div>
                                )
                                : (

                                  <p
                                    className="
                                      text-gray-400
                                      text-sm
                                    "
                                  >
                                    Este equipo no tiene jugadores
                                  </p>
                                )
                            }

                          </td>

                        </tr>
                      )
                    }

                  </Fragment>
                ))
              }

            </tbody>

          </table>

        </TableContainer>

      </div>

    </div>
  )
}

export default Equipos