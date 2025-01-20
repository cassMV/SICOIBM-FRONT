import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./listaDesplegable2.module.css";

const listaDesplegable2 = () => {
    const location = useLocation(); // Hook para obtener la ruta actual
    const navigate = useNavigate(); // Hook para navegar a rutas específicas

    const items = [
        { name: "Usuario", path: "/usuarios/usuario" },
      ];

    return (
        <div className={styles.Lista2MenuLateral}>
            <button className={styles.Lista2BackButton} onClick={() => navigate("/menu")}>←</button>
            <ul className={styles.Lista2MenuList}>
            <h2 className={styles.Lista2MenuTitle}>Agregar</h2>
            {items.map((item, index) => (
            <li
                key={index}
                className={`${styles.Lista2MenuItem} ${
                location.pathname === item.path ? styles.Lista2Active : ""}`}>
                    <Link to={item.path} className={styles.link2}>{item.name}</Link>
            </li>
            ))}
            </ul>
        </div>
    )
}

export default listaDesplegable2
