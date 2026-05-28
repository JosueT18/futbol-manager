import { getHeaders } from "./api"

const API_URL = "http://127.0.0.1:8000"

// =========================
// GET TEAMS
// =========================
export async function getTeams() {

  try {

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

    return await response.json()

  } catch (error) {

    console.error(
      "GET TEAMS ERROR:",
      error
    )

    return []
  }
}

// =========================
// CREATE TEAM
// =========================
export async function createTeam(
  data: any
) {

  try {

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
        result.detail
        ||
        result.error
        ||
        "Error creando equipo"
      )
    }

    return result

  } catch (error) {

    console.error(
      "CREATE TEAM ERROR:",
      error
    )

    throw error
  }
}

// =========================
// DELETE TEAM
// =========================
export async function deleteTeam(
  id: number
) {

  try {

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
        result.detail
        ||
        result.error
        ||
        "Error eliminando equipo"
      )
    }

    return result

  } catch (error) {

    console.error(
      "DELETE TEAM ERROR:",
      error
    )

    throw error
  }
}

// =========================
// UPDATE TEAM
// =========================
export async function updateTeam(
  id: number,
  data: any
) {

  try {

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
        result.detail
        ||
        result.error
        ||
        "Error actualizando equipo"
      )
    }

    return result

  } catch (error) {

    console.error(
      "UPDATE TEAM ERROR:",
      error
    )

    throw error
  }
}

// =========================
// UPLOAD LOGO
// =========================
export async function uploadLogo(
  file: File
) {

  try {

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
        result.detail
        ||
        "Error subiendo logo"
      )
    }

    return result

  } catch (error) {

    console.error(
      "UPLOAD LOGO ERROR:",
      error
    )

    throw error
  }
}