import { useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner'; // Para el spinner de carga
import axios from 'axios';
import styles from './AgregarArea.module.css';

const AgregarArea = () => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Petición a la API para obtener las áreas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/area/get-areas`);
        if (response.data.success) {
          setAreas(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las áreas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className={styles.agregarAreaContainer}>
      {isLoading ? ( // Mostrar spinner mientras carga
        <div className={styles.spinnerContainer}>
          <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
        </div>
      ) : (
        <main className={styles.agregarAreaMainContent}>
          <h2 className={styles.agregarAreaTitle}>Agregar Área</h2>

          <div className={styles.agregarAreaFormContainer}>
            <div className={styles.agregarAreaFormRow}>
              <input
                type="text"
                placeholder="Área (ID)"
                className={styles.agregarAreaInput2}
              />
              <input
                type="text"
                placeholder="Nombre del Área"
                className={styles.agregarAreaInput}
              />
            </div>
          </div>
          <div className={styles.agregarAreaFormActions}>
            <button
              className={styles.agregarAreaBackButtonAction}
            >
              Atrás
            </button>
            <button className={styles.agregarAreaAddButton}>Agregar</button>
          </div>

          <h3 className={styles.tableTitle}>Lista de Áreas</h3>
          <table className={styles.areaTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id_area}>
                  <td>{area.id_area}</td>
                  <td>{area.nombre_area}</td>
                  <td>
                    <div className={styles.buttonGroup}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </div>
  );
};

export default AgregarArea;
