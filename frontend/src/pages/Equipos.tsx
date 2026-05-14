import { useEffect, useState } from "react"
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
import PageHeader from "../components/ui/PageHeader"
import TableContainer from "../components/ui/TableContainer"

function Equipos() {

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [tecnico, setTecnico] = useState("")

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    data: teams = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })

  async function createTeam() {

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

      await refetch()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        "Error al crear equipo"
      )
    }
  }

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
        error.message || "Error al eliminar equipo"
      )
    }
  }

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
        title="Equipos"
        subtitle="Administración de equipos"
      />

      <Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            placeholder="Director Técnico"
            value={tecnico}
            onChange={(e) => setTecnico(e.target.value)}
          />

        </div>

        <div className="mt-5">

          <Button onClick={createTeam}>
            Crear Equipo
          </Button>

        </div>

      </Card>

      {
        isLoading && (

          <div className="mb-5 mt-5 bg-yellow-100 text-yellow-800 p-4 rounded-xl">

            ⏳ Cargando equipos...

          </div>
        )
      }

      <div className="mt-8">

        <TableContainer>

          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="text-left p-4">
                  Equipo
                </th>

                <th className="text-left p-4">
                  Ciudad
                </th>

                <th className="text-left p-4">
                  Técnico
                </th>

                <th className="text-left p-4">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {
                teams.map((team: any) => (

                  <tr
                    key={team.id}
                    className="
                      border-t
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <td className="p-4 font-medium text-gray-800">
                      ⚽ {team.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      📍 {team.city}
                    </td>

                    <td className="p-4 text-gray-600">
                      👨‍🏫 {team.tecnico}
                    </td>

                    <td className="p-4 flex gap-3">

                      <Button
                        variant="secondary"
                        onClick={() => updateTeam(team)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => deleteTeam(team.id)}
                      >
                        Eliminar
                      </Button>

                    </td>

                  </tr>
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