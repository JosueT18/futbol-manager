type ButtonProps = {

  children: React.ReactNode

  onClick?: () => void

  variant?: "primary" | "danger" | "secondary"

  type?: "button" | "submit"

}


function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {

  let styles = ""

  if (variant === "primary") {

    styles =
      "bg-black hover:bg-gray-800 text-white"
  }

  if (variant === "danger") {

    styles =
      "bg-red-600 hover:bg-red-700 text-white"
  }

  if (variant === "secondary") {

    styles =
      "bg-blue-600 hover:bg-blue-700 text-white"
  }

  return (

    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl
        transition
        font-medium
        text-sm
        shadow-sm
        ${styles}
      `}
    >

      {children}

    </button>
  )
}

export default Button