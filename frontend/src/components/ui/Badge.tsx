type Props = {
  status: string
}

function Badge({ status }: Props) {

  // =========================
  // APPROVED
  // =========================
  if (status === "approved") {

    return (

      <span
        className="
          bg-green-100
          text-green-700
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
        "
      >
        ✅ Aprobado
      </span>
    )
  }

  // =========================
  // REJECTED
  // =========================
  if (status === "rejected") {

    return (

      <span
        className="
          bg-red-100
          text-red-700
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
        "
      >
        ❌ Rechazado
      </span>
    )
  }

  // =========================
  // DEFAULT = PENDING
  // =========================
  return (

    <span
      className="
        bg-yellow-100
        text-yellow-700
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
      "
    >
      ⏳ Pendiente
    </span>
  )
}

export default Badge