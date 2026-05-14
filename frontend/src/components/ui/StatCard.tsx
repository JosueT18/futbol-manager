interface Props {

  title: string

  value: string | number

  icon: string

  color?: string
}

function StatCard({
  title,
  value,
  icon,
  color = "bg-black",
}: Props) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-6
        flex
        items-center
        justify-between
        hover:shadow-md
        transition
      "
    >

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2 text-gray-800">
          {value}
        </h2>

      </div>

      <div
        className={`
          ${color}
          w-14
          h-14
          rounded-2xl
          flex
          items-center
          justify-center
          text-white
          text-2xl
        `}
      >

        {icon}

      </div>

    </div>
  )
}

export default StatCard