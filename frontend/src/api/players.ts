const API_URL = "http://127.0.0.1:8000"

// =========================
// GET TOKEN
// =========================
function getAuthHeaders() {

  const token =
    localStorage.getItem("token")

  return {

    "Content-Type":
      "application/json",

    Authorization:
      `Bearer ${token}`,
  }
}

// =========================
// GET PLAYERS
// =========================
export async function getPlayers() {

  try {

    const response = await fetch(
      `${API_URL}/players`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {

      throw new Error(
        "Error al obtener jugadores"
      )
    }

    return await response.json()

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

        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {

      const errorData =
        await response.json()

      throw new Error(
        errorData.detail
        ||
        "Error al crear jugador"
      )
    }

    return await response.json()

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

    if (!response.ok) {

      const errorData =
        await response.json()

      throw new Error(
        errorData.detail
        ||
        "Error al eliminar jugador"
      )
    }

    return await response.json()

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

        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {

      const errorData =
        await response.json()

      throw new Error(
        errorData.detail
        ||
        "Error al actualizar jugador"
      )
    }

    return await response.json()

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

    if (!response.ok) {

      const errorData =
        await response.json()

      throw new Error(
        errorData.detail
        ||
        "Error al aprobar jugador"
      )
    }

    return await response.json()

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

    if (!response.ok) {

      const errorData =
        await response.json()

      throw new Error(
        errorData.detail
        ||
        "Error al rechazar jugador"
      )
    }

    return await response.json()

  } catch (error) {

    console.error(
      "REJECT PLAYER ERROR:",
      error
    )

    throw error
  }
}