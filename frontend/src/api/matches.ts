import api from "./axios"

const API_URL =
  "http://127.0.0.1:8000"

// =========================
// HEADERS
// =========================
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
// HANDLE ERROR
// =========================
function handleError(error: any) {

  console.error(error)

  // =========================
  // FASTAPI VALIDATION
  // =========================
  if (
    error.response?.data?.detail
  ) {

    const detail =
      error.response.data.detail

    // =========================
    // ARRAY VALIDATION ERRORS
    // =========================
    if (Array.isArray(detail)) {

      return detail
        .map(
          (err: any) =>
            err.msg
        )
        .join(" - ")
    }

    // =========================
    // STRING ERROR
    // =========================
    return detail
  }

  return "Error inesperado"
}

// =========================
// GET MATCHES
// =========================
export async function getMatches() {

  try {

    const response =
      await api.get(

        `${API_URL}/matches`,

        getHeaders()
      )

    return response.data

  } catch (error) {

    console.error(error)

    return []
  }
}

// =========================
// CREATE MATCH
// =========================
export async function createMatch(
  data: any
) {

  try {

    // =========================
    // BODY
    // =========================
    const body = {

      home_team_id:
        Number(data.home_team_id),

      away_team_id:
        Number(data.away_team_id),

      round_number:
        Number(data.round_number),

      match_date:
        data.match_date,

      stadium:
        data.stadium,
    }

    console.log(
      "MATCH BODY:",
      body
    )

    const response =
      await api.post(

        `${API_URL}/matches`,

        body,

        getHeaders()
      )

    return response.data

  } catch (error: any) {

    console.error(
      "CREATE MATCH ERROR:",
      error
    )

    console.log(
      "BACKEND RESPONSE:",
      error?.response?.data
    )

    throw new Error(

      error?.response?.data?.detail?.[0]?.msg ||

      error?.response?.data?.detail ||

      "Error al crear partido"
    )
  }
}
// =========================
// UPDATE MATCH
// =========================
export async function updateMatch(
  id: number,
  data: any
) {

  try {

    const response =
      await api.put(

        `${API_URL}/matches/${id}`,

        data,

        getHeaders()
      )

    return response.data

  } catch (error: any) {

    console.error(error)

    throw new Error(
      handleError(error)
    )
  }
}

// =========================
// DELETE MATCH
// =========================
export async function deleteMatch(
  id: number
) {

  try {

    const response =
      await api.delete(

        `${API_URL}/matches/${id}`,

        getHeaders()
      )

    return response.data

  } catch (error: any) {

    console.error(error)

    throw new Error(
      handleError(error)
    )
  }
}