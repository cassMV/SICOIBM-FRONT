import { Route, Routes } from "react-router-dom";
import ListaDesplegable from "../listaDesplegable/listaDesplegable.jsx";
import AgregarBien from "../Acciones/Bien/AgregarBien.jsx";
import AgregarArea from "../Acciones/Area/AgregarArea.jsx";
import AgregarEmpleado from "../Acciones/Empleado/AgregarEmpleado.jsx";
import AgregarProducto from "../Acciones/Producto/AgregarProducto.jsx";
import AgregarRol from "../Acciones/Rol/AgregarRol.jsx";
import AgregarDireccion from "../Acciones/Direccion/AgregarDireccion.jsx";
import AgregarStatus from "../Acciones/StatusBien/AgregarStatus.jsx";
import AgregarMarca from "../Acciones/Marca/AgregarMarca.jsx";
import AgregarTipoAlta from "../Acciones/TipoAlta/AgregarTipoAlta.jsx";
import AgregarDocumento from "../Acciones/Documento/AgregarDocumento.jsx";
import AgregarCodigo from "../Acciones/CodigoPartida/AgregarCodigo.jsx";
import AgregarSubcuenta from "../Acciones/SubcuentaArmonizada/AgregarSubcuenta.jsx";
import AgregarRecurso from "../Acciones/RecursoOrigen/AgregarRecurso.jsx";
import AgregarTipoPosesion from "../Acciones/TipoPosesion/AgregarTipoPosesion.jsx";
import AgregarBien2 from "../Acciones/Bien2/AgregarBien2.jsx";

const Acciones = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Lista desplegable fija en el lado izquierdo */}
      <ListaDesplegable />

      {/* Área principal donde se renderizan los componentes */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
        <Route path="bien" element={<AgregarBien />} />
        <Route path="bien2" element={<AgregarBien2 />} />
        <Route path="area" element={<AgregarArea />} />
        <Route path="empleado" element={<AgregarEmpleado />} />
        <Route path="producto" element={<AgregarProducto />} />
        <Route path="direccion" element={<AgregarDireccion />} />
        <Route path="status-bien" element={<AgregarStatus />} />
        <Route path="marca" element={<AgregarMarca />} />
        <Route path="rol" element={<AgregarRol />} />
        <Route path="tipo-alta" element={<AgregarTipoAlta />} />
        <Route path="documentos" element={<AgregarDocumento />} />
        <Route path="codigo-partida" element={<AgregarCodigo/>} />
        <Route path="subcuenta" element={<AgregarSubcuenta/>} />
        <Route path="recurso-origen" element={<AgregarRecurso/>} />
        <Route path="tipo-posesion" element={<AgregarTipoPosesion/>} />
          {/* Ruta por defecto para /acciones */}
          <Route path="/" element={<h1></h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Acciones;
