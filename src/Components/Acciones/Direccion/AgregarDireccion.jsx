import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarDireccion.module.css';

const AgregarDireccion = () => {
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener direcciones desde la API
  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/direccion/get-direcciones');
        if (response.data.success) {
          setDirecciones(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las direcciones:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchDirecciones();
  }, []);

  return (
    <div className={styles.agregarDireccionContainer}>
      <main className={`${styles.agregarDireccionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDireccionTitle}>Agregar Dirección</h2>
        <div className={styles.agregarDireccionFormContainer}>
          <div className={styles.agregarDireccionFormRow}>
            <input
              type="text"
              placeholder="Dirección (ID)"
              className={styles.agregarDireccionInput2}
            />
            <input
              type="text"
              placeholder="Nombre de la dirección"
              className={styles.agregarDireccionInput}
            />
          </div>
        </div>
        <div className={styles.agregarDireccionFormActions}>
          <button className={styles.agregarDireccionBackButtonAction}>Atrás</button>
          <button className={styles.agregarDireccionAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de direcciones */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Direcciones</h3>
            <table className={`${styles.direccionTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {direcciones.map((direccion) => (
                  <tr key={direccion.id_direccion}>
                    <td>{direccion.id_direccion}</td>
                    <td>{direccion.nombre_direccion}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar dirección ${direccion.id_direccion}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar dirección ${direccion.id_direccion}`)}
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
        className={styles.agregarDireccionHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarDireccion;
