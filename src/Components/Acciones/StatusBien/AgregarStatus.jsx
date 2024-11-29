import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarStatus.module.css';

const AgregarStatus = () => {
  const navigate = useNavigate();
  const [statusBien, setStatusBien] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener status del bien desde la API
  useEffect(() => {
    const fetchStatusBien = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/status-bien/get-status-bien');
        if (response.data.success) {
          setStatusBien(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener el status del bien:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchStatusBien();
  }, []);

  return (
    <div className={styles.agregarStatusContainer}>
      <main className={`${styles.agregarStatusMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarStatusTitle}>Agregar Status del Bien</h2>
        <div className={styles.agregarStatusFormContainer}>
          <div className={styles.agregarStatusFormRow}>
            <input
              type="text"
              placeholder="Status del Bien (ID)"
              className={styles.agregarStatusInput2}
            />
            <select className={styles.agregarStatusSelect}>
              <option value="">Seleccionar Status</option>
              <option value="Asignado">Asignado</option>
              <option value="Extraviado">Extraviado</option>
              <option value="Dado de baja">Dado de baja</option>
              <option value="Reasignado">Reasignado</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarStatusFormActions}>
          <button className={styles.agregarStatusBackButtonAction}>Atrás</button>
          <button className={styles.agregarStatusAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de estados */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Estados del Bien</h3>
            <table className={`${styles.statusTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {statusBien.map((status) => (
                  <tr key={status.id_status_bien}>
                    <td>{status.id_status_bien}</td>
                    <td>{status.descripcion_status}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar estado ${status.id_status_bien}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar estado ${status.id_status_bien}`)}
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
        className={styles.agregarStatusHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarStatus;
