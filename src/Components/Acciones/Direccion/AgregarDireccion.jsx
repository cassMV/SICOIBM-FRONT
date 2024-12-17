import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert
import styles from './AgregarDireccion.module.css'; // Asegúrate de crear o modificar un archivo CSS para este componente

const AgregarDireccion = () => {
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreDireccion, setNombreDireccion] = useState('');

  // Petición a la API para obtener las direcciones
  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/direccion/get-direcciones`);
        if (response.data.success) {
          setDirecciones(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las direcciones:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirecciones();
  }, []);

  // Función para manejar el envío del formulario
  const handleAddDireccion = async () => {
    if (!nombreDireccion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingrese un nombre para la dirección.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3100/api/direccion/create-direccion', {
        nombre_direccion: nombreDireccion,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Dirección agregada!',
          text: 'La dirección se ha agregado exitosamente.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Actualiza la lista de direcciones con la nueva dirección
        setDirecciones([...direcciones, response.data.data]);
        setNombreDireccion(''); // Limpia el campo del formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la dirección.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Ocurrió un error al intentar agregar la dirección. Por favor, intente nuevamente.',
      });
    }
  };

  return (
    <div className={styles.agregarDireccionContainer}>
      <main className={`${styles.agregarDireccionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDireccionTitle}>Agregar Dirección</h2>
        <div className={styles.agregarDireccionFormContainer}>
          <div className={styles.agregarDireccionFormRow}>
            <input
              type="text"
              placeholder="Nombre de la Dirección"
              className={styles.agregarDireccionInput}
              value={nombreDireccion}
              onChange={(e) => setNombreDireccion(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.agregarDireccionFormActions}>
          <button className={styles.agregarDireccionBackButtonAction} onClick={() => navigate('/menu')}>
            Atrás
          </button>
          <button className={styles.agregarDireccionAddButton} onClick={handleAddDireccion}>
            Agregar
          </button>
        </div>

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
                  <th>Opciones</th>
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
      <button className={styles.agregarDireccionHomeButton} onClick={() => navigate('/')}>🏠</button>
    </div>
  );
};

export default AgregarDireccion;
