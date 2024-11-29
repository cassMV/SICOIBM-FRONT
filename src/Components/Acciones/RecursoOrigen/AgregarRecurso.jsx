import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarRecurso.module.css';

function AgregarRecurso() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener recursos desde la API
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/recurso-origen/get-recursos-origen'
        );
        if (response.data.success) {
          setRecursos(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los recursos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchRecursos();
  }, []);

  return (
    <div className={styles.agregarRecursoContainer}>
      <main className={`${styles.agregarRecursoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarRecursoTitle}>Agregar Recurso de Origen</h2>
        <div className={styles.agregarRecursoFormContainer}>
          <div className={styles.agregarRecursoFormRow}>
            <input
              type="text"
              placeholder="Recurso Origen (ID)"
              className={styles.agregarRecursoInput2}
            />
            <select className={styles.agregarRecursoSelect}>
              <option value="">Descripción Origen</option>
              <option value="Estatal">Estatal</option>
              <option value="FASP">FASP</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarRecursoFormActions}>
          <button className={styles.agregarRecursoBackButtonAction}>Atrás</button>
          <button className={styles.agregarRecursoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de recursos */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Recursos de Origen</h3>
            <table className={`${styles.recursoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {recursos.map((recurso) => (
                  <tr key={recurso.id_recurso_origen}>
                    <td>{recurso.id_recurso_origen}</td>
                    <td>{recurso.descripcion_recurso}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar recurso ${recurso.id_recurso_origen}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar recurso ${recurso.id_recurso_origen}`)}
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
        className={styles.agregarRecursoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarRecurso;
