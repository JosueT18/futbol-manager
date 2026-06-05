import api from "./axios"

const API_URL =
  "http://127.0.0.1:8000"


function getHeaders() {

  const token =
    localStorage.getItem(
      "token"
    )

  return {

    headers: {

      Authorization:
        `Bearer ${token}`,

      "Content-Type":
        "application/json",
    },
  }
}


// =========================
// GET EVENTS
// =========================
export async function getMatchEvents(
  matchId: number
) {

  try {

    const response =
      await api.get(

        `${API_URL}/match-events/${matchId}`,

        getHeaders()
      )

    return response.data

  } catch (error) {

    console.error(error)

    return []
  }
}


// =========================
// CREATE EVENT
// =========================
export async function createMatchEvent(
  data: any
) {

  try {

    const response =
      await api.post(

        `${API_URL}/match-events`,

        data,

        getHeaders()
      )

    return response.data

  } catch (error) {

    console.error(error)

    throw error
  }
}