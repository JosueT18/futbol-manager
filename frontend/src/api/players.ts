const API_URL = "http://127.0.0.1:8000"

// =========================
// GET AUTH HEADERS
// =========================
function getAuthHeaders() {

  const token =
    localStorage.getItem(
      "token"
    )

  return {

    "Content-Type":
      "application/json",

    Authorization:
      `Bearer ${token}`,
  }
}

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

    localStorage.removeItem(
      "token"
    )

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
// GET PLAYERS
// =========================
export async function getPlayers() {

  try {

    const response = await fetch(
      `${API_URL}/players`,
      {
        headers:
          getAuthHeaders(),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "GET PLAYERS ERROR:",
      error
    )

    return []
  }
}

// =========================
// CREATE PLAYER
// =========================
export async function createPlayer(
  data: any
) {

  try {

    const response = await fetch(
      `${API_URL}/players`,
      {
        method: "POST",

        headers:
          getAuthHeaders(),

        body: JSON.stringify(
          data
        ),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "CREATE PLAYER ERROR:",
      error
    )

    throw error
  }
}

// =========================
// DELETE PLAYER
// =========================
export async function deletePlayer(
  id: number
) {

  try {

    const response = await fetch(
      `${API_URL}/players/${id}`,
      {
        method: "DELETE",

        headers:
          getAuthHeaders(),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "DELETE PLAYER ERROR:",
      error
    )

    throw error
  }
}

// =========================
// UPDATE PLAYER
// =========================
export async function updatePlayer(
  id: number,
  data: any
) {

  try {

    const response = await fetch(
      `${API_URL}/players/${id}`,
      {
        method: "PUT",

        headers:
          getAuthHeaders(),

        body: JSON.stringify(
          data
        ),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "UPDATE PLAYER ERROR:",
      error
    )

    throw error
  }
}

// =========================
// APPROVE PLAYER
// =========================
export async function approvePlayer(
  id: number
) {

  try {

    const response = await fetch(
      `${API_URL}/players/${id}/approve`,
      {
        method: "PUT",

        headers:
          getAuthHeaders(),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "APPROVE PLAYER ERROR:",
      error
    )

    throw error
  }
}

// =========================
// REJECT PLAYER
// =========================
export async function rejectPlayer(
  id: number,
  reason: string
) {

  try {

    const response = await fetch(
      `${API_URL}/players/${id}/reject`,
      {
        method: "PUT",

        headers:
          getAuthHeaders(),

        body: JSON.stringify({
          reason,
        }),
      }
    )

    return await handleResponse(
      response
    )

  } catch (error) {

    console.error(
      "REJECT PLAYER ERROR:",
      error
    )

    throw error
  }
}