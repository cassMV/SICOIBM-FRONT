import { Route, Routes } from "react-router-dom";
import ListaDesplegable5 from "../listaDesplegable5/listaDesplegable5.jsx";
import AgregarBajas from "../Bajas/Baja/AgregarBaja.jsx";

const Bajas = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Lista desplegable fija en el lado izquierdo */}
      <ListaDesplegable5 />

      {/* Área principal donde se renderizan los componentes */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
        <Route path="baja" element={<AgregarBajas />} />
          {/* Ruta por defecto para /acciones */}
          <Route path="/" element={<h1></h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default Bajas;