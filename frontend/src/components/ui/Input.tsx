type InputProps = {

  type?: string

  placeholder?: string

  value: string

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void

}


function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {

  return (

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        border border-gray-300
        focus:border-black
        focus:ring-2
        focus:ring-black/10
        outline-none
        p-3
        rounded-xl
        text-sm
        bg-white
        transition
      "
    />
  )
}

export default Input