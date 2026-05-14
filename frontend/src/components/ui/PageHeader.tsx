type Props = {
  title: string
  subtitle: string
}

function PageHeader({
  title,
  subtitle,
}: Props) {

  return (

    <div className="mb-8">

      <h1
        className="
          text-3xl
          font-bold
          text-gray-800
        "
      >
        {title}
      </h1>

      <p
        className="
          text-gray-500
          text-sm
          mt-1
        "
      >
        {subtitle}
      </p>

    </div>
  )
}

export default PageHeader