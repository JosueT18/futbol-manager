import { Fragment, useState, useEffect } from "react"

import Swal from "sweetalert2"

import { useQuery } from "@tanstack/react-query"

import {
  Shield,
  MapPin,
  Users,
  UserCog,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

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

  // =========================
  // SOLO ADMIN
  // =========================
  const canManageTeams =
    role === "Administrador"

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

      const token =
        localStorage.getItem("token")

      const response =
        await fetch(
          "http://localhost:8000/teams/upload-logo",
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: formData,
          }
        )

      const data =
        await response.json()

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Error al subir logo"
        )
      }

      setLogo(
        data.logo
      )

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message ||
        "Error al subir logo"
      )
    }
  }

  // =========================
  // TEAMS
  // =========================
  const {
  data: allTeams = [],
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["teams"],
  queryFn: getTeams,
})

const userTeamId =
  Number(localStorage.getItem("team_id"))

const teams =
  role === "Director"
  ||
  role === "Jugador"
    ? allTeams.filter(
        (team: any) =>
          team.id === userTeamId
      )
    : allTeams

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

      background: "#18222f",

      color: "#fff",
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

    const {
      value: formValues
    } = await Swal.fire({

      title: "Editar equipo",

      background: "#18222f",

      color: "#fff",

      html: `

        <input
          id="swal-name"
          class="swal2-input"
          placeholder="Nombre"
          value="${team.name}"
        >

        <input
          id="swal-city"
          class="swal2-input"
          placeholder="Ciudad"
          value="${team.city}"
        >

        <input
          id="swal-tecnico"
          class="swal2-input"
          placeholder="Director Técnico"
          value="${team.tecnico}"
        >
      `,

      focusConfirm: false,

      preConfirm: () => {

        return {

          name:
            (
              document.getElementById(
                "swal-name"
              ) as HTMLInputElement
            ).value,

          city:
            (
              document.getElementById(
                "swal-city"
              ) as HTMLInputElement
            ).value,

          tecnico:
            (
              document.getElementById(
                "swal-tecnico"
              ) as HTMLInputElement
            ).value,
        }
      }
    })

    if (!formValues) {
      return
    }

    try {

      await updateTeamApi(
        team.id,
        {

          name:
            formValues.name,

          city:
            formValues.city,

          tecnico:
            formValues.tecnico,

          logo:
            team.logo,
        }
      )

      setSuccessMessage(
        "Equipo actualizado correctamente"
      )

      setErrorMessage("")

      await refetch()

    } catch (error: any) {

      console.error(error)

      setErrorMessage(
        error.message ||
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

    <div
      className="
        min-h-screen
        bg-[#0f1720]
        text-white
        p-6
      "
    >

      {/* SUCCESS */}
      {
        successMessage && (

          <div
            className="
              mb-5
              bg-emerald-500/20
              border
              border-emerald-500/30
              text-emerald-300
              p-4
              rounded-2xl
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
              bg-red-500/20
              border
              border-red-500/30
              text-red-300
              p-4
              rounded-2xl
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
          mb-8
        "
      >

        <div>

          <h1 className="text-5xl font-black">
            Equipos
          </h1>

          <p className="text-zinc-400 mt-2">
            Gestión profesional de equipos
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

          <Card className="bg-[#18222f] border border-[#253041] mb-8">

            <h2 className="text-3xl font-black mb-6">
              Nuevo Equipo
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <div>

                <label className="block mb-2 text-sm text-zinc-400">
                  Nombre
                </label>

                <Input
                  placeholder="River Plate"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              <div>

                <label className="block mb-2 text-sm text-zinc-400">
                  Ciudad
                </label>

                <Input
                  placeholder="Buenos Aires"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />

              </div>

              <div>

                <label className="block mb-2 text-sm text-zinc-400">
                  Director Técnico
                </label>

                <Input
                  placeholder="DT"
                  value={tecnico}
                  onChange={(e) =>
                    setTecnico(e.target.value)
                  }
                />

              </div>

              <div>

                <label className="block mb-2 text-sm text-zinc-400">
                  Escudo
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
                    bg-[#243244]
                    border
                    border-[#344256]
                    rounded-xl
                    p-3
                    text-sm
                  "
                />

              </div>

            </div>

            {
              logo && (

                <div className="mt-8 flex justify-center">

                  <img
                    src={`http://localhost:8000${logo}`}
                    alt="logo"
                    className="
                      w-32
                      h-32
                      rounded-full
                      object-cover
                      border-4
                      border-emerald-500/40
                    "
                  />

                </div>
              )
            }

            <div className="mt-8">

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
              bg-yellow-500/20
              border
              border-yellow-500/30
              text-yellow-300
              p-4
              rounded-2xl
              mb-6
            "
          >
            ⏳ Cargando equipos...
          </div>
        )
      }

      {/* TABLE */}
      <Card className="bg-[#18222f] border border-[#253041]">

        <TableContainer>

          <table className="w-full">

            <thead
              className="
                border-b
                border-[#253041]
              "
            >

              <tr className="text-zinc-400 text-sm">

                <th className="text-left py-4 px-4">
                  Equipo
                </th>

                <th className="text-left py-4 px-4">
                  Ciudad
                </th>

                <th className="text-left py-4 px-4">
                  Técnico
                </th>

                <th className="text-left py-4 px-4">
                  Jugadores
                </th>

                {
                  canManageTeams && (

                    <th className="text-left py-4 px-4">
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
                        border-b
                        border-[#253041]
                        hover:bg-[#1d2a3a]
                        transition-all
                      "
                    >

                      {/* TEAM */}
                      <td className="py-5 px-4">

                        <button
                          onClick={() =>

                            setOpenTeamId(

                              openTeamId === team.id
                                ? null
                                : team.id
                            )
                          }
                          className="
                            flex
                            items-center
                            gap-4
                            text-left
                            w-full
                          "
                        >

                          <div
                            className="
                              w-16
                              h-16
                              rounded-2xl
                              overflow-hidden
                              bg-[#243244]
                              border
                              border-[#344256]
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

                                <Shield
                                  className="text-emerald-400"
                                />
                              )
                            }

                          </div>

                          <div>

                            <p
                              className="
                                text-xl
                                font-bold
                                text-gray-900
                                group-hover:text-white
                              "
                            >
                              {team.name}
                            </p>

                            <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">

                              {
                                openTeamId === team.id
                                  ? <ChevronUp size={16} />
                                  : <ChevronDown size={16} />
                              }

                              Ver jugadores

                            </div>

                          </div>

                        </button>

                      </td>

                      {/* CITY */}
                      <td className="px-4">

                        <div className="flex items-center gap-2">

                          <MapPin
                            size={16}
                            className="text-emerald-400"
                          />

                          {team.city}

                        </div>

                      </td>

                      {/* TECNICO */}
                      <td className="px-4">

                        <div className="flex items-center gap-2">

                          <UserCog
                            size={16}
                            className="text-blue-400"
                          />

                          {team.tecnico}

                        </div>

                      </td>

                      {/* PLAYERS */}
                      <td className="px-4">

                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2
                            bg-emerald-500/20
                            text-emerald-300
                            px-3
                            py-2
                            rounded-xl
                            text-sm
                            font-semibold
                          "
                        >

                          <Users size={16} />

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

                          <td className="px-4">

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  updateTeam(team)
                                }
                                className="
                                  p-3
                                  rounded-xl
                                  bg-blue-500/20
                                  hover:bg-blue-500/30
                                  transition-all
                                "
                              >

                                <Pencil
                                  size={18}
                                  className="text-blue-300"
                                />

                              </button>

                              <button
                                onClick={() =>
                                  deleteTeam(team.id)
                                }
                                className="
                                  p-3
                                  rounded-xl
                                  bg-red-500/20
                                  hover:bg-red-500/30
                                  transition-all
                                "
                              >

                                <Trash2
                                  size={18}
                                  className="text-red-300"
                                />

                              </button>

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
                            className="
                              bg-[#111827]
                              p-6
                            "
                          >

                            <h3
                              className="
                                text-2xl
                                font-black
                                mb-5
                              "
                            >
                              Plantel
                            </h3>

                            {
                              team.players?.filter(
                                (player: any) =>
                                  player.status === "approved"
                              ).length > 0 ? (

                                <div
                                  className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                    gap-4
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
                                            bg-[#18222f]
                                            border
                                            border-[#253041]
                                            rounded-2xl
                                            p-5
                                          "
                                        >

                                          <div className="flex justify-between items-start">

                                            <div>

                                              <p className="font-bold text-lg">
                                                {player.name}
                                              </p>

                                              <p className="text-zinc-400 mt-1">
                                                {player.position}
                                              </p>

                                            </div>

                                            <div
                                              className="
                                                w-12
                                                h-12
                                                rounded-xl
                                                bg-emerald-500
                                                flex
                                                items-center
                                                justify-center
                                                font-black
                                                text-lg
                                              "
                                            >

                                              #{player.number}

                                            </div>

                                          </div>

                                        </div>
                                      ))
                                  }

                                </div>

                              ) : (

                                <p className="text-zinc-400">
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

      </Card>

    </div>
  )
}

export default Equipos