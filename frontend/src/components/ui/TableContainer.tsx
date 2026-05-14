type Props = {
  children: React.ReactNode
}

function TableContainer({
  children,
}: Props) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border border-gray-100
        overflow-x-auto
      "
    >
      {children}
    </div>
  )
}

export default TableContainer