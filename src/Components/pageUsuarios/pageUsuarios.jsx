import { Route, Routes } from "react-router-dom";
import ListaDesplegable2 from "../listaDesplegable2/listaDesplegable2.jsx";
import AgregarUsuario from "../Usuarios/Usuario/AgregarUsuario.jsx";

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
          <Route path="/menu" element={<h1></h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default Usuarios;
