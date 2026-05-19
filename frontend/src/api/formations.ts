import axios from "axios"

const API_URL =
  "http://127.0.0.1:8000/formations"

// =========================
// TYPES
// =========================
export interface FormationPlayer {

  player_id: number

  position_x: number

  position_y: number

  role: string
}

export interface FormationData {

  name: string

  tactic: string

  team_id: number

  game_mode: string

  players: FormationPlayer[]
}

// =========================
// GET FORMATIONS
// =========================
export async function getFormations() {

  const response =
    await axios.get(API_URL)

  return response.data
}

// =========================
// GET FORMATION
// =========================
export async function getFormation(
  id: number
) {

  const response =
    await axios.get(
      `${API_URL}/${id}`
    )

  return response.data
}

// =========================
// CREATE FORMATION
// =========================
export async function createFormation(
  data: FormationData
) {

  const response =
    await axios.post(
      API_URL,
      data
    )

  return response.data
}

// =========================
// UPDATE FORMATION
// =========================
export async function updateFormation(
  id: number,
  data: FormationData
) {

  const response =
    await axios.put(
      `${API_URL}/${id}`,
      data
    )

  return response.data
}

// =========================
// DELETE FORMATION
// =========================
export async function deleteFormation(
  id: number
) {

  const response =
    await axios.delete(
      `${API_URL}/${id}`
    )

  return response.data
}