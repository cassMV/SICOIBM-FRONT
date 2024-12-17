import { Route, Routes } from "react-router-dom";
import ListaDesplegable3 from "../listaDesplegable3/listaDesplegable3.jsx";
import AgregarResguardo from "../Resguardos/Resguardo/AgregarResguardo.jsx";

const Resguardos = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Lista desplegable fija en el lado izquierdo */}
      <ListaDesplegable3 />

      {/* Área principal donde se renderizan los componentes */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
        <Route path="resguardo" element={<AgregarResguardo />} />
          {/* Ruta por defecto para /acciones */}
          <Route path="/" element={<h1></h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default Resguardos;