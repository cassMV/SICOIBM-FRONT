import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./listaDesplegable3.module.css";

const listaDesplegable3 = () => {
    const location = useLocation(); // Hook para obtener la ruta actual
    const navigate = useNavigate(); // Hook para navegar a rutas específicas

    const items = [
        { name: "Resguardo", path: "/resguardos/resguardo" },
      ];

    return (
        <div className={styles.Lista3MenuLateral}>
            <button className={styles.Lista3BackButton} onClick={() => navigate("/menu")}>←</button>
            <ul className={styles.Lista3MenuList}>
            <h2 className={styles.Lista3MenuTitle}>Agregar</h2>
            {items.map((item, index) => (
            <li
                key={index}
                className={`${styles.Lista3MenuItem} ${
                location.pathname === item.path ? styles.Lista3Active : ""}`}>
                    <Link to={item.path} className={styles.link3}>{item.name}</Link>
            </li>
            ))}
            </ul>
        </div>
    )
}

export default listaDesplegable3;
