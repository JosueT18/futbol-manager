import axios from "axios"

const API_URL =
  "http://127.0.0.1:8000/matches"


// =========================
// GET MATCHES
// =========================
export async function getMatches() {

  const response =
    await axios.get(API_URL)

  return response.data
}


// =========================
// CREATE MATCH
// =========================
export async function createMatch(
  data: any
) {

  const response =
    await axios.post(
      API_URL,
      data
    )

  return response.data
}


// =========================
// UPDATE MATCH
// =========================
export async function updateMatch(
  id: number,
  data: any
) {

  const response =
    await axios.put(
      `${API_URL}/${id}`,
      data
    )

  return response.data
}


// =========================
// DELETE MATCH
// =========================
export async function deleteMatch(
  id: number
) {

  const response =
    await axios.delete(
      `${API_URL}/${id}`
    )

  return response.data
}