import api from "./axios"

export async function getStandings() {

  const response =
    await api.get("/standings"
        
    )

  return response.data
}