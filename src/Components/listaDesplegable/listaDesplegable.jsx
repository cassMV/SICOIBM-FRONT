import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./listaDesplegable.module.css";

const ListaDesplegable = () => {
  const location = useLocation(); // Hook para obtener la ruta actual
  const navigate = useNavigate(); // Hook para navegar a rutas específicas

  const items = [
    { name: "Bien", path: "/acciones/bien" },
    { name: "Área", path: "/acciones/area" },
    { name: "Empleado", path: "/acciones/empleado" },
    { name: "Producto", path: "/acciones/producto" },
    { name: "Rol", path: "/acciones/rol" },
    { name: "Dirección", path: "/acciones/direccion" },
    { name: "Status del Bien", path: "/acciones/status-bien" },
    { name: "Marca", path: "/acciones/marca" },
    { name: "Tipo de Alta", path: "/acciones/tipo-alta" },
    { name: "Documentos", path: "/acciones/documentos" },
    { name: "Código de Partida Específica", path: "/acciones/codigo-partida" },
    { name: "Subcuenta Armonizada", path: "/acciones/subcuenta" },
    { name: "Recurso del Origen", path: "/acciones/recurso-origen" },
    { name: "Tipo de posesión", path: "/acciones/tipo-posesion" },
  ];

  return (
    <div className={styles.ListaMenuLateral}>
      <button className={styles.ListaBackButton} onClick={() => navigate("/menu")}>←</button>
      <ul className={styles.ListaMenuList}>
        <h2 className={styles.ListaMenuTitle}>Agregar</h2>
        {items.map((item, index) => (
          <li
            key={index}
            className={`${styles.ListaMenuItem} ${
              location.pathname === item.path ? styles.ListaActive : ""}`}>
            <Link to={item.path} className={styles.link}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaDesplegable;
