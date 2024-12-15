import React from 'react'
import ListaDesplegable2 from "../listaDesplegable2/listaDesplegable2.jsx";

const Usuarios = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Lista desplegable fija en el lado izquierdo */}
      <ListaDesplegable2 />

      {/* Área principal donde se renderizan los componentes */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
        <Route path="usuario" element={<AgregarUsuario />} />
          {/* Ruta por defecto para /acciones */}
          <Route path="/" element={<h1>Selecciona una opción de la lista</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default Usuarios
