const API_URL = "http://127.0.0.1:8000"

// =========================
// GET PLAYERS
// =========================
export async function getPlayers() {

  try {

    const response = await fetch(
      `${API_URL}/players`
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

        headers: {
          "Content-Type":
            "application/json",
        },

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
      }
    )

    if (!response.ok) {

      throw new Error(
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

        headers: {
          "Content-Type":
            "application/json",
        },

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