import api from "./axios"

const API_URL =
  "http://127.0.0.1:8000/formations"


// =========================
// PLAYER
// =========================
export interface FormationPlayer {

  player_id: number

  position_x: number

  position_y: number

  role: string
}


// =========================
// FORMATION
// =========================
export interface FormationData {

  name: string

  tactic: string

  match_type: number

  team_id: number

  players: FormationPlayer[]
}


// =========================
// GET ALL
// =========================
export async function getFormations() {

  const response =
    await api.get(API_URL)

  return response.data
}


// =========================
// GET ONE
// =========================
export async function getFormation(
  id: number
) {

  const response =
    await api.get(
      `${API_URL}/${id}`
    )

  return response.data
}


// =========================
// CREATE
// =========================
export async function createFormation(
  data: FormationData
) {

  const response =
    await api.post(
      API_URL,
      data
    )

  return response.data
}


// =========================
// UPDATE
// =========================
export async function updateFormation(
  id: number,
  data: FormationData
) {

  const response =
    await api.put(
      `${API_URL}/${id}`,
      data
    )

  return response.data
}


// =========================
// DELETE
// =========================
export async function deleteFormation(
  id: number
) {

  const response =
    await api.delete(
      `${API_URL}/${id}`
    )

  return response.data
}