import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarTipoPosesion.module.css';

function AgregarTipoPosesion() {
  const navigate = useNavigate();
  const [posesiones, setPosesiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [descripcionPosesion, setDescripcionPosesion] = useState('');
  const [clavePosesion, setClavePosesion] = useState('');
  const [statusPosesion, setStatusPosesion] = useState('');

  // Obtener posesiones desde la API
  useEffect(() => {
    const fetchPosesiones = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tipo-posesion/get-posesiones`
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

  // Función para enviar los datos del formulario
  const handleAddPosesion = async () => {
    try {
      const body = {
        descripcion_posesion: descripcionPosesion,
        clave_posesion: clavePosesion,
        status_posesion: statusPosesion,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tipo-posesion/create-posesion`,
        body
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Posesión agregada!',
          text: 'El tipo de posesión se ha agregado exitosamente.',
        });
        setPosesiones([...posesiones, response.data.data]); // Actualiza la tabla
        setDescripcionPosesion('');
        setClavePosesion('');
        setStatusPosesion('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la posesión.',
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
    <div className={styles.agregarTipoPosesionContainer}>
      <main className={`${styles.agregarTipoPosesionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoPosesionTitle}>Agregar Tipo de Posesión</h2>
        <div className={styles.agregarTipoPosesionFormContainer}>
          <div className={styles.agregarTipoPosesionFormRow}>
            <input
              type="text"
              placeholder="Descripción de la Posesión"
              className={styles.agregarTipoPosesionInput}
              value={descripcionPosesion}
              onChange={(e) => setDescripcionPosesion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Clave de Posesión"
              className={styles.agregarTipoPosesionInput}
              value={clavePosesion}
              onChange={(e) => setClavePosesion(e.target.value)}
            />
            <select
              className={styles.agregarTipoPosesionSelect}
              value={statusPosesion}
              onChange={(e) => setStatusPosesion(e.target.value)}
            >
              <option value="">Status de posesión</option>
              <option value="Activo">Activa</option>
              <option value="Inactivo">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarTipoPosesionFormActions}>
          <button
            className={styles.agregarTipoPosesionBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarTipoPosesionAddButton}
            onClick={handleAddPosesion}
          >
            Agregar
          </button>
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
                  <th>Opciones</th>
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
                          onClick={() =>
                            console.log(`Editar posesión ${posesion.id_tipo_posesion}`)
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            console.log(`Eliminar posesión ${posesion.id_tipo_posesion}`)
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
        className={styles.agregarTipoPosesionHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarTipoPosesion;
