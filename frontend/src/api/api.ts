//=============
// API URL
//=============
export const API_URL = 
import.meta.env.VITE_API_URL

console.log(
  "API_URL",
  import.meta.env.VITE_API_URL
)

// =========================
// API HEADERS
// =========================
export function getHeaders(): HeadersInit {

  const token =
    localStorage.getItem(
      "token"
    )

  // =========================
  // HEADERS
  // =========================
  const headers: HeadersInit = {

    "Content-Type":
      "application/json",
  }

  // =========================
  // ADD TOKEN
  // =========================
  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {

    headers["Authorization"] =
      `Bearer ${token}`
  }

  return headers
}