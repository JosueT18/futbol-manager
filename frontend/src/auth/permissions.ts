export function isAdmin(
  user: any
) {

  return (
    user?.role === "admin"
  )
}


export function isDirector(
  user: any
) {

  return (
    user?.role === "director"
  )
}


export function isCommission(
  user: any
) {

  return (
    user?.role === "commission"
  )
}


export function isPlayer(
  user: any
) {

  return (
    user?.role === "player"
  )
}