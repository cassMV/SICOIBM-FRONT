import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarRecurso.module.css';

function AgregarRecurso() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [descripcionRecurso, setDescripcionRecurso] = useState('');

  // Obtener recursos desde la API
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/recurso-origen/get-recursos-origen`
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

  // Función para enviar los datos del formulario
  const handleAddRecurso = async () => {
    try {
      const body = {
        descripcion_recurso: descripcionRecurso, // Valor del select
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recurso-origen/create-recurso-origen`,
        body
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Recurso agregado!',
          text: 'El recurso de origen se ha agregado exitosamente.',
        });
        setRecursos([...recursos, response.data.data]); // Actualiza la tabla
        setDescripcionRecurso(''); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el recurso.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: error.message || 'Error desconocido.',
      });
    }
  };

  return (
    <div className={styles.agregarRecursoContainer}>
      <main className={`${styles.agregarRecursoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarRecursoTitle}>Agregar Recurso de Origen</h2>
        <div className={styles.agregarRecursoFormContainer}>
          <div className={styles.agregarRecursoFormRow}>
            <select
              className={styles.agregarRecursoSelect}
              value={descripcionRecurso}
              onChange={(e) => setDescripcionRecurso(e.target.value)}
            >
              <option value="">Descripción Origen</option>
              <option value="Estatal">Estatal</option>
              <option value="FASP">FASP</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarRecursoFormActions}>
          <button
            className={styles.agregarRecursoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarRecursoAddButton}
            onClick={handleAddRecurso}
          >
            Agregar
          </button>
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
                  <th>Opciones</th>
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
                          onClick={() =>
                            console.log(`Editar recurso ${recurso.id_recurso_origen}`)
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            console.log(`Eliminar recurso ${recurso.id_recurso_origen}`)
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
        className={styles.agregarRecursoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarRecurso;
