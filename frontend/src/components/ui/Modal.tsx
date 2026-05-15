type Props = {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}

function Modal({
  open,
  title,
  children,
  onClose,
}: Props) {

  if (!open) {
    return null
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-2xl
          p-6
          shadow-2xl
          animate-in
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-gray-400
              hover:text-black
              text-2xl
            "
          >
            ×
          </button>

        </div>

        {/* CONTENT */}
        {children}

      </div>

    </div>
  )
}

export default Modal