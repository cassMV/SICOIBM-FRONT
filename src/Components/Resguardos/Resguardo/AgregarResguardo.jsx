import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarResguardo.module.css';

function AgregarResguardo() {
  const navigate = useNavigate();
  const [resguardos, setResguardos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener resguardos desde la API
  useEffect(() => {
    const fetchResguardos = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/resguardo/get-resguardos'
        );
        if (response.data.success) {
          setResguardos(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los resguardos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchResguardos();
  }, []);

  return (
    <div className={styles.agregarResguardoContainer}>
      <main className={`${styles.agregarResguardoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarResguardoTitle}>Agregar Resguardo</h2>
        <div className={styles.agregarResguardoFormContainer}>
          <input
            type="text"
            placeholder="ID Historial Resguardo"
            className={styles.agregarResguardoInput2}
          />
          <div className={styles.agregarResguardoFormRow}>
            <input
              type="date"
              placeholder="Fecha de Resguardo"
              className={styles.agregarResguardoInput}
            />
            <input
              type="text"
              placeholder="ID Bien"
              className={styles.agregarResguardoInput}
            />
          </div>
          <div className={styles.agregarResguardoFormRow}>
            <input
              type="text"
              placeholder="ID Empleado"
              className={styles.agregarResguardoInput}
            />
            <input
              type="text"
              placeholder="ID Usuario"
              className={styles.agregarResguardoInput}
            />
          </div>
        </div>
        <div className={styles.agregarResguardoFormActions}>
          <button className={styles.agregarResguardoBackButtonAction}>Atrás</button>
          <button className={styles.agregarResguardoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de resguardos */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Resguardos</h3>
            <table className={`${styles.resguardoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID Historial</th>
                  <th>Fecha</th>
                  <th>ID Bien</th>
                  <th>ID Empleado</th>
                  <th>ID Usuario</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {resguardos.map((resguardo) => (
                  <tr key={resguardo.id_historial_resguardo}>
                    <td>{resguardo.id_historial_resguardo}</td>
                    <td>{resguardo.fecha_resguardo}</td>
                    <td>{resguardo.id_bien}</td>
                    <td>{resguardo.id_empleado}</td>
                    <td>{resguardo.id_usuario}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar resguardo ${resguardo.id_historial_resguardo}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar resguardo ${resguardo.id_historial_resguardo}`)}
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
        className={styles.agregarResguardoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarResguardo;
