import axios from "./axios"

// =========================
// PLAYER STATS
// =========================
export async function getStats() {

const response = await axios.get(
"/stats"
)

return response.data
}

// =========================
// TOP SCORERS
// =========================
export async function getTopScorers() {

const response = await axios.get(
"/top-scorers"
)

return response.data
}

// =========================
// TEAM TOP SCORERS
// =========================
export async function getTeamTopScorers() {

const response = await axios.get(
"/team-top-scorers"
)

return response.data
}