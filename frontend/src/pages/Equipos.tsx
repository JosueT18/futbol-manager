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

  // =========================
  // ROLE
  // =========================
  const role =
    localStorage.getItem("role") || ""

  const canManageTeams =
    role === "Administrador"
    ||
    role === "Director"

  // =========================
  // STATES
  // =========================
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [tecnico, setTecnico] = useState("")
  const [logo, setLogo] = useState("")

  const [showForm, setShowForm] =
    useState(false)

  const [openTeamId, setOpenTeamId] =
    useState<number | null>(null)

  const [successMessage, setSuccessMessage] =
    useState("")

  const [errorMessage, setErrorMessage] =
    useState("")

  // =========================
  // UPLOAD LOGO
  // =========================
  async function uploadLogo(
    file: File
  ) {

    try {

      const formData =
        new FormData()

      formData.append(
        "file",
        file
      )

      const response =
        await fetch(
          "http://localhost:8000/teams/upload-logo",
          {
            method: "POST",
            body: formData,
          }
        )

      const data =
        await response.json()

      setLogo(
        data.logo
      )

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al subir logo"
      )
    }
  }

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

    if (!canManageTeams) {

      setErrorMessage(
        "No tenés permisos"
      )

      return
    }

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

        logo,
      })

      setSuccessMessage(
        "Equipo creado correctamente"
      )

      setErrorMessage("")

      setName("")
      setCity("")
      setTecnico("")
      setLogo("")

      setShowForm(false)

      await refetch()

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message ||
        "Error al crear equipo"
      )
    }
  }

  // =========================
  // DELETE TEAM
  // =========================
  async function deleteTeam(id: number) {

    if (!canManageTeams) {

      setErrorMessage(
        "No tenés permisos"
      )

      return
    }

    const result = await Swal.fire({

      title: "¿Eliminar equipo?",

      text:
        "Esta acción no se puede deshacer",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText:
        "Sí, eliminar",

      cancelButtonText:
        "Cancelar",
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

    if (!canManageTeams) {

      setErrorMessage(
        "No tenés permisos"
      )

      return
    }

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

          logo: team.logo,
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

        <div>

          <h1 className="text-4xl font-bold">
            Equipos
          </h1>

          <p className="text-gray-500 mt-1">
            Gestión de equipos
          </p>

        </div>

        {
          canManageTeams && (

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
          )
        }

      </div>

      {/* FORM */}
      {
        showForm && canManageTeams && (

          <Card>

            <h2 className="text-2xl font-bold mb-5">
              Nuevo Equipo
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              {/* NOMBRE */}
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Nombre del Equipo
                </label>

                <Input
                  placeholder="Ej: River Plate"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              {/* CIUDAD */}
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Ciudad
                </label>

                <Input
                  placeholder="Ej: Buenos Aires"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />

              </div>

              {/* TECNICO */}
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Director Técnico
                </label>

                <Input
                  placeholder="Nombre del DT"
                  value={tecnico}
                  onChange={(e) =>
                    setTecnico(e.target.value)
                  }
                />

              </div>

              {/* UPLOAD */}
              <div>

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  "
                >
                  Escudo del Equipo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0]

                    if (file) {

                      uploadLogo(file)
                    }
                  }}
                  className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    bg-white
                  "
                />

              </div>

            </div>

            {/* PREVIEW */}
            {
              logo && (

                <div
                  className="
                    mt-6
                    flex
                    justify-center
                  "
                >

                  <img
                    src={`http://localhost:8000${logo}`}
                    alt="logo"
                    className="
                      w-28
                      h-28
                      object-cover
                      rounded-full
                      border-4
                      border-gray-200
                      shadow-md
                    "
                  />

                </div>
              )
            }

            <div className="mt-6">

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
                  Jugadores
                </th>

                {
                  canManageTeams && (

                    <th className="text-left py-3 px-4">
                      Acciones
                    </th>
                  )
                }

              </tr>

            </thead>

            <tbody>

              {
                teams.map((team: any) => (

                  <Fragment key={team.id}>

                    <tr
                      className="
                        border-t
                        hover:bg-gray-50
                        transition-colors
                      "
                    >

                      {/* TEAM */}
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

                            {/* LOGO */}
                            <div
                              className="
                                w-14
                                h-14
                                rounded-full
                                overflow-hidden
                                border
                                bg-gray-100
                                flex
                                items-center
                                justify-center
                              "
                            >

                              {
                                team.logo ? (

                                  <img
                                    src={`http://localhost:8000${team.logo}`}
                                    alt={team.name}
                                    className="
                                      w-full
                                      h-full
                                      object-cover
                                    "
                                  />

                                ) : (

                                  <span className="text-2xl">
                                    ⚽
                                  </span>
                                )
                              }

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

                            </div>

                          </div>

                        </button>

                      </td>

                      {/* CITY */}
                      <td className="py-4 px-4">
                        📍 {team.city}
                      </td>

                      {/* TECNICO */}
                      <td className="py-4 px-4">
                        👨‍🏫 {team.tecnico}
                      </td>

                      {/* COUNT */}
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

                          {
                            team.players?.filter(
                              (player: any) =>
                                player.status === "approved"
                            ).length || 0
                          }

                        </div>

                      </td>

                      {/* ACTIONS */}
                      {
                        canManageTeams && (

                          <td className="py-4 px-4">

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
                        )
                      }

                    </tr>

                    {/* PLAYERS */}
                    {
                      openTeamId === team.id && (

                        <tr>

                          <td
                            colSpan={
                              canManageTeams
                                ? 5
                                : 4
                            }
                            className="bg-gray-50 p-5"
                          >

                            <h3 className="font-bold text-lg mb-4">
                              Jugadores
                            </h3>

                            {
                              team.players?.length > 0 ? (

                                <div
                                  className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    lg:grid-cols-3
                                    gap-3
                                  "
                                >

                                  {
                                    team.players
                                      .filter(
                                        (player: any) =>
                                          player.status === "approved"
                                      )
                                      .map((player: any) => (

                                        <div
                                          key={player.id}
                                          className="
                                            bg-white
                                            rounded-xl
                                            p-4
                                            border
                                          "
                                        >

                                          <p className="font-bold">
                                            {player.name}
                                          </p>

                                          <p className="text-sm text-gray-500">
                                            {player.position}
                                          </p>

                                          <p className="text-sm mt-1">
                                            #{player.number}
                                          </p>

                                        </div>
                                      ))
                                  }

                                </div>

                              ) : (

                                <p className="text-gray-500">
                                  No hay jugadores aprobados
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