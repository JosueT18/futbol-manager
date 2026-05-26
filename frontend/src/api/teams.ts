import { getHeaders } from "./api"

const API_URL = "http://127.0.0.1:8000"


// =========================
// GET TEAMS
// =========================
export async function getTeams() {

  const response = await fetch(
    `${API_URL}/teams`,
    {
      headers: getHeaders(),
    }
  )

  if (!response.ok) {

    throw new Error(
      "Error obteniendo equipos"
    )
  }

  return response.json()
}


// =========================
// CREATE TEAM
// =========================
export async function createTeam(
  data: any
) {

  const response = await fetch(
    `${API_URL}/teams`,
    {
      method: "POST",

      headers: getHeaders(),

      body: JSON.stringify(data),
    }
  )

  const result =
    await response.json()

  if (!response.ok) {

    throw new Error(
      result.detail ||
      result.error ||
      "Error creando equipo"
    )
  }

  return result
}


// =========================
// DELETE TEAM
// =========================
export async function deleteTeam(
  id: number
) {

  const response = await fetch(
    `${API_URL}/teams/${id}`,
    {
      method: "DELETE",

      headers: getHeaders(),
    }
  )

  const result =
    await response.json()

  if (!response.ok) {

    throw new Error(
      result.detail ||
      result.error ||
      "Error eliminando equipo"
    )
  }

  return result
}


// =========================
// UPDATE TEAM
// =========================
export async function updateTeam(
  id: number,
  data: any
) {

  const response = await fetch(
    `${API_URL}/teams/${id}`,
    {
      method: "PUT",

      headers: getHeaders(),

      body: JSON.stringify(data),
    }
  )

  const result =
    await response.json()

  if (!response.ok) {

    throw new Error(
      result.detail ||
      result.error ||
      "Error actualizando equipo"
    )
  }

  return result
}


// =========================
// UPLOAD LOGO
// =========================
export async function uploadLogo(
  file: File
) {

  const token =
    localStorage.getItem(
      "token"
    )

  const formData =
    new FormData()

  formData.append(
    "file",
    file
  )

  const response = await fetch(
    `${API_URL}/teams/upload-logo`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  )

  const result =
    await response.json()

  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Error subiendo logo"
    )
  }

  return result
}