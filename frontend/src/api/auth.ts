const API =
  "http://127.0.0.1:8000"

export async function loginUser(
  data: any
) {

  const response =
    await fetch(
      `${API}/login`,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      }
    )

  // =========================
  // ERROR
  // =========================
  if (!response.ok) {

    let errorMessage =
      "Credenciales inválidas"

    try {

      const errorData =
        await response.json()

      if (errorData.detail) {

        errorMessage =
          errorData.detail
      }

    } catch {

      errorMessage =
        "Error al iniciar sesión"
    }

    throw new Error(
      errorMessage
    )
  }

  // =========================
  // SUCCESS
  // =========================
  const result =
    await response.json()

  // =========================
  // SAVE TOKEN
  // =========================
  localStorage.setItem(
    "token",
    result.access_token
  )

  // =========================
  // SAVE USER DATA
  // =========================
  localStorage.setItem(
    "role",
    result.user.role
  )

  localStorage.setItem(
    "user_name",
    result.user.name
  )

  localStorage.setItem(
    "user_email",
    result.user.email
  )

  localStorage.setItem(
    "user_id",
    result.user.id.toString()
  )

  if (result.user.team_id) {

    localStorage.setItem(
      "team_id",
      result.user.team_id.toString()
    )
  }

  return result
}