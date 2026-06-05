import axios from "./axios"

export async function getDashboard() {

const response = await axios.get(
"/dashboard"
)

return response.data
}