const API_URL = "http://127.0.0.1:8000"


export async function getTeams() {

  const response = await fetch(
    `${API_URL}/teams`
  )

  return response.json()
}


export async function createTeam(data: any) {

  const response = await fetch(
    `${API_URL}/teams`,
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


export async function deleteTeam(id: number) {

  const response = await fetch(
    `${API_URL}/teams/${id}`,
    {
      method: "DELETE",
    }
  )

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}


export async function updateTeam(
  id: number,
  data: any
) {

  const response = await fetch(
    `http://127.0.0.1:8000/teams/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  )

  return response.json()
}