import api from "./axios"
import { API_URL } from "./api"

function getHeaders() {

  const token =
    localStorage.getItem("token")

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

  const response =
    await api.get(
      `${API_URL}/match-events/${matchId}`,
      getHeaders()
    )

  return response.data
}

// =========================
// CREATE EVENT
// =========================
export async function createMatchEvent(
  data: any
) {

  const response =
    await api.post(
      `${API_URL}/match-events`,
      data,
      getHeaders()
    )

  return response.data
}

// =========================
// UPDATE EVENT
// =========================
export async function updateMatchEvent(
  eventId: number,
  data: any
) {

  console.log(
    "UPDATE EVENT URL:",
    `${API_URL}/match-events/${eventId}`
  )

  const response =
    await api.put(
      `${API_URL}/match-events/${eventId}`,
      data,
      getHeaders()
    )

  return response.data
}

// =========================
// DELETE EVENT
// =========================
export async function deleteMatchEvent(
  eventId: number
) {

  console.log(
    "DELETE EVENT URL:",
    `${API_URL}/match-events/${eventId}`
  )

  const response =
    await api.delete(
      `${API_URL}/match-events/${eventId}`,
      getHeaders()
    )

  return response.data
}