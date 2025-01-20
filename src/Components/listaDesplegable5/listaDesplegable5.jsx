import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./listaDesplegable5.module.css";

const listaDesplegable5 = () => {
    const location = useLocation(); // Hook para obtener la ruta actual
    const navigate = useNavigate(); // Hook para navegar a rutas específicas

    const items = [
        { name: "Baja", path: "/bajas/baja" },
      ];

    return (
        <div className={styles.Lista5MenuLateral}>
            <button className={styles.Lista5BackButton} onClick={() => navigate("/menu")}>←</button>
            <ul className={styles.Lista5MenuList}>
            <h2 className={styles.Lista5MenuTitle}>Agregar</h2>
            {items.map((item, index) => (
            <li
                key={index}
                className={`${styles.Lista5MenuItem} ${
                location.pathname === item.path ? styles.Lista5Active : ""}`}>
                    <Link to={item.path} className={styles.link5}>{item.name}</Link>
            </li>
            ))}
            </ul>
        </div>
    )
}

export default listaDesplegable5;