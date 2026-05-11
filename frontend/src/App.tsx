import { useEffect, useState } from 'react'

function App() {

  const [mensaje, setMensaje] =
useState("")

  useEffect(() => {

    fetch("http://127.0.0.1:8000")
      .then(response => response.json())
      .then(data => {
        setMensaje(data.mensaje)
      })
  }, [])

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "40px",
      fontWeight: "bold"
    }}>
      {mensaje}
    </div>
  )
}

export default App