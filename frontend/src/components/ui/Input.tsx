type InputProps = {

  type?: string

  placeholder?: string

  value: string

  min?: number

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void

  className?: string
}

function Input({
  type = "text",
  placeholder,
  value,
  min,
  onChange,
  className="",
}: InputProps) {

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    // =========================
    // BLOQUEAR NEGATIVOS
    // =========================
    if (type === "number") {

      const numericValue =
        Number(e.target.value)

      if (
        numericValue < 0
      ) {

        return
      }
    }

    onChange(e)
  }

  return (

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      min={min}
      onChange={handleChange}
      className="
        w-full
        border border-gray-300
        focus:border-black
        focus:ring-2
        focus:ring-black/10
        outline-none
        p-3
        rounded-xl
        text-sm
        bg-white
        text-black
        placeholder:text-gray-500
        transition
        ${className}
      "
    />
  )
}

export default Input