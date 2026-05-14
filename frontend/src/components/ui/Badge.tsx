type BadgeProps = {

  status: string

}


function Badge({
  status,
}: BadgeProps) {

  if (status === "approved") {

    return (

      <span className="
        bg-green-100
        text-green-700
        px-3 py-1
        rounded-full
        text-xs
        font-medium
      ">
        Aprobado
      </span>
    )
  }

  if (status === "rejected") {

    return (

      <span className="
        bg-red-100
        text-red-700
        px-3 py-1
        rounded-full
        text-xs
        font-medium
      ">
        Rechazado
      </span>
    )
  }

  return (

    <span className="
      bg-yellow-100
      text-yellow-700
      px-3 py-1
      rounded-full
      text-xs
      font-medium
    ">
      Pendiente
    </span>
  )
}

export default Badge