const API_URL = "http://127.0.0.1:8000"


export async function getPlayers() {

  const response = await fetch(
    `${API_URL}/players`
  )

  return response.json()
}


export async function createPlayer(data: any) {

  const response = await fetch(
    `${API_URL}/players`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  )

  return response.json()
}


export async function deletePlayer(id: number) {

  const response = await fetch(
    `${API_URL}/players/${id}`,
    {
      method: "DELETE",
    }
  )

  return response.json()
}


export async function updatePlayer(
  id: number,
  data: any
) {

  const response = await fetch(
    `${API_URL}/players/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  )

  return response.json()
}