import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarTipoPosesion.module.css';

function AgregarTipoPosesion() {
  const navigate = useNavigate();
  const [posesiones, setPosesiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener posesiones desde la API
  useEffect(() => {
    const fetchPosesiones = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/tipo-posesion/get-posesiones'
        );
        if (response.data.success) {
          setPosesiones(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las posesiones:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchPosesiones();
  }, []);

  return (
    <div className={styles.agregarTipoPosesionContainer}>
      <main className={`${styles.agregarTipoPosesionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoPosesionTitle}>Agregar Tipo de Posesión</h2>
        <div className={styles.agregarTipoPosesionFormContainer}>
          <input
            type="text"
            placeholder="Tipo de Posesión (ID)"
            className={styles.agregarTipoPosesionInput2}
          />
          <div className={styles.agregarTipoPosesionFormRow}>
            <input
              type="text"
              placeholder="Descripción de la Posesión"
              className={styles.agregarTipoPosesionInput}
            />
            <input
              type="text"
              placeholder="Clave de Posesión"
              className={styles.agregarTipoPosesionInput}
            />
            <select className={styles.agregarTipoPosesionSelect}>
              <option value="">Status de posesión</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarTipoPosesionFormActions}>
          <button className={styles.agregarTipoPosesionBackButtonAction}>
            Atrás
          </button>
          <button className={styles.agregarTipoPosesionAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de posesiones */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Tipos de Posesión</h3>
            <table className={`${styles.posesionTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Clave</th>
                  <th>Status</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {posesiones.map((posesion) => (
                  <tr key={posesion.id_tipo_posesion}>
                    <td>{posesion.id_tipo_posesion}</td>
                    <td>{posesion.descripcion_posesion}</td>
                    <td>{posesion.clave_posesion}</td>
                    <td>{posesion.status_posesion}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar posesión ${posesion.id_tipo_posesion}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar posesión ${posesion.id_tipo_posesion}`)}
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
        className={styles.agregarTipoPosesionHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarTipoPosesion;
