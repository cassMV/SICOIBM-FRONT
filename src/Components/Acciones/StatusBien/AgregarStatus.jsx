import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarStatus.module.css';

const AgregarStatus = () => {
  const navigate = useNavigate();
  const [statusBien, setStatusBien] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para los valores del formulario
  const [formData, setFormData] = useState({
    descripcion_status: '',
  });

  // Obtener status del bien desde la API
  useEffect(() => {
    const fetchStatusBien = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/status-bien/get-status-bien`
        );
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

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para enviar los datos del formulario
  const handleAddStatus = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/status-bien/create-status-bien`,
        formData
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Status agregado!',
          text: 'El status del bien se ha agregado exitosamente.',
        });
        setStatusBien([...statusBien, response.data.data]); // Actualiza la tabla
        setFormData({ descripcion_status: '' }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el status.',
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
    <div className={styles.agregarStatusContainer}>
      <main className={`${styles.agregarStatusMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarStatusTitle}>Agregar Status del Bien</h2>
        <div className={styles.agregarStatusFormContainer}>
          <div className={styles.agregarStatusFormRow}>
            <select
              className={styles.agregarStatusSelect}
              name="descripcion_status"
              value={formData.descripcion_status}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar Status</option>
              <option value="Asignado">Asignado</option>
              <option value="Extraviado">Extraviado</option>
              <option value="Dado_de_baja">Dado de baja</option>
              <option value="Reasignado">Reasignado</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarStatusFormActions}>
          <button
            className={styles.agregarStatusBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarStatusAddButton}
            onClick={handleAddStatus}
          >
            Agregar
          </button>
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
                  <th>Opciones</th>
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
