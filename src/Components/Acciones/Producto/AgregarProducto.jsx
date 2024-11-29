import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Spinner para animación de carga
import styles from "./AgregarProducto.module.css";

const AgregarProducto = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3100/api/producto/get-productos"
        );
        if (response.data.success) {
          setProductos(response.data.data);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className={styles.agregarProductoContainer}>
      <main className={`${styles.agregarProductoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarProductoTitle}>Agregar Producto</h2>
        <div className={styles.agregarProductoFormContainer}>
          <input
            type="text"
            placeholder="Producto (ID)"
            className={styles.agregarProductoInput2}
          />
          <div className={styles.agregarProductoFormRow}>
            <input
              type="text"
              placeholder="Nombre del producto"
              className={styles.agregarProductoInput}
            />
            <input
              type="text"
              placeholder="Modelo"
              className={styles.agregarProductoInput}
            />
            <input
              type="text"
              placeholder="Ruta imagen"
              className={styles.agregarProductoInput}
            />
          </div>
          <div className={styles.agregarProductoFormRow}>
            <input
              type="text"
              placeholder="Características"
              className={styles.agregarProductoInput}
            />
            <input
              type="text"
              placeholder="Marca (ID)"
              className={styles.agregarProductoInput2}
            />
          </div>
        </div>
        <div className={styles.agregarProductoFormActions}>
          <button className={styles.agregarProductoBackButtonAction}>
            Atrás
          </button>
          <button className={styles.agregarProductoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de productos */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Productos</h3>
            <table className={`${styles.productoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Modelo</th>
                  <th>Ruta Imagen</th>
                  <th>Características</th>
                  <th>Marca</th>
                  <th>Opciones</th> {/* Nueva columna para los botones */}
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.modelo}</td>
                    <td>{producto.ruta_imagen}</td>
                    <td>{producto.caracteristicas}</td>
                    <td>{producto.Marca || "Sin marca asignada"}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() =>
                            console.log(
                              `Editar producto ${producto.id_producto}`
                            )
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            console.log(
                              `Eliminar producto ${producto.id_producto}`
                            )
                          }
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
      <button
        className={styles.agregarProductoHomeButton}
        onClick={() => navigate("/menu")}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarProducto;
