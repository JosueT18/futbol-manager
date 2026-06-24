import api from "./axios"

import { API_URL } from "./api"

// =========================
// ENDPOINT
// =========================
const FORMATIONS_URL = 
`${API_URL}/formations`


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
    await api.get(
      FORMATIONS_URL
    )

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
      `${FORMATIONS_URL}/${id}`
    )

  return response.data
}


// =========================
// CREATE
// =========================
export async function createFormation(
  data: FormationData
) {

  console.log(
    "POST:",
    FORMATIONS_URL
  )

  const response =
    await api.post(
      FORMATIONS_URL,
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
      `${FORMATIONS_URL}/${id}`,
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
      `${FORMATIONS_URL}/${id}`
    )

  return response.data
}