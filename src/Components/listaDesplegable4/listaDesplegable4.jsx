import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./listaDesplegable4.module.css";

const listaDesplegable4 = () => {
    const location = useLocation(); // Hook para obtener la ruta actual
    const navigate = useNavigate(); // Hook para navegar a rutas específicas

    const items = [
        { name: "Bienes", path: "/bienes/bien" },
      ];

    return (
        <div className={styles.Lista4MenuLateral}>
            <button className={styles.Lista4BackButton} onClick={() => navigate("/menu")}>←</button>
            <ul className={styles.Lista4MenuList}>
            <h2 className={styles.Lista4MenuTitle}>Agregar</h2>
            {items.map((item, index) => (
            <li
                key={index}
                className={`${styles.Lista4MenuItem} ${
                location.pathname === item.path ? styles.Lista4Active : ""}`}>
                    <Link to={item.path} className={styles.link4}>{item.name}</Link>
            </li>
            ))}
            </ul>
        </div>
    )
}

export default listaDesplegable4;