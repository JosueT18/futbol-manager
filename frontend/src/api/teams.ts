import { getHeaders } from "./api"

const API_URL = "http://127.0.0.1:8000"

// =========================
// HANDLE RESPONSE
// =========================
async function handleResponse(
  response: Response
) {

  let result: any = {}

  try {

    result = await response.json()

  } catch {

    result = {}
  }

  // =========================
  // UNAUTHORIZED
  // =========================
  if (response.status === 401) {

    localStorage.removeItem("token")

    throw new Error(
      "Sesión expirada"
    )
  }

  // =========================
  // ERROR
  // =========================
  if (!response.ok) {

    throw new Error(
      result.detail ||
      result.error ||
      "Error en la solicitud"
    )
  }

  return result
}

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

    return await handleResponse(
      response
    )

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

    return await handleResponse(
      response
    )

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

    return await handleResponse(
      response
    )

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

    return await handleResponse(
      response
    )

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

    // =========================
    // VALIDATE TOKEN
    // =========================
    if (
      !token ||
      token === "undefined" ||
      token === "null"
    ) {

      throw new Error(
        "No autenticado"
      )
    }

    // =========================
    // FORM DATA
    // =========================
    const formData =
      new FormData()

    formData.append(
      "file",
      file
    )

    // =========================
    // REQUEST
    // =========================
    const response = await fetch(
      `${API_URL}/teams/upload-logo`,
      {
        method: "POST",

        headers: {

          // ⚠️ NO CONTENT-TYPE
          // EL BROWSER LO GENERA SOLO
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    )

    // =========================
    // HANDLE RESPONSE
    // =========================
    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "UPLOAD LOGO ERROR:",
      error
    )

    throw error
  }
}