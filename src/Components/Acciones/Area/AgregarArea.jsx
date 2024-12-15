import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert
import styles from './AgregarArea.module.css';

const AgregarArea = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreArea, setNombreArea] = useState('');

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
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // Función para manejar el envío del formulario
  const handleAddArea = async () => {
    if (!nombreArea.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingrese un nombre para el área.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3100/api/area/create-area', {
        nombre_area: nombreArea,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Área agregada!',
          text: 'El área se ha agregado exitosamente.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Actualiza la lista de áreas con la nueva área
        setAreas([...areas, response.data.data]);
        setNombreArea(''); // Limpia el campo del formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el área.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Ocurrió un error al intentar agregar el área. Por favor, intente nuevamente.',
      });
    }
  };

  return (
    <div className={styles.agregarAreaContainer}>
      <main className={`${styles.agregarAreaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarAreaTitle}>Agregar Área</h2>
        <div className={styles.agregarAreaFormContainer}>
          <div className={styles.agregarAreaFormRow}>
            <input
              type="text"
              placeholder="Nombre del Área"
              className={styles.agregarAreaInput}
              value={nombreArea}
              onChange={(e) => setNombreArea(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.agregarAreaFormActions}>
          <button className={styles.agregarAreaBackButtonAction} onClick={() => navigate('/menu')}>
            Atrás
          </button>
          <button className={styles.agregarAreaAddButton} onClick={handleAddArea}>
            Agregar
          </button>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Áreas</h3>
            <table className={`${styles.areaTable} ${styles.fadeIn}`}>
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
                          onClick={() => console.log(`Editar área ${area.id_area}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar área ${area.id_area}`)}
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
      <button className={styles.agregarAreaHomeButton} onClick={() => navigate('/')}>🏠</button>
    </div>
  );
};

export default AgregarArea;

