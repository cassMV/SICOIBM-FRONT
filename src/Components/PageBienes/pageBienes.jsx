import { Route, Routes } from "react-router-dom";
import ListaDesplegable4 from "../listaDesplegable4/listaDesplegable4.jsx";
import BienesExistentes from "../Bienes/Bien/BienesExistentes.jsx";

const Bienes = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Lista desplegable fija en el lado izquierdo */}
      <ListaDesplegable4 />

      {/* Área principal donde se renderizan los componentes */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
        <Route path="bien" element={<BienesExistentes />} />
          {/* Ruta por defecto para /acciones */}
          <Route path="/menu" element={<h1></h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default Bienes;