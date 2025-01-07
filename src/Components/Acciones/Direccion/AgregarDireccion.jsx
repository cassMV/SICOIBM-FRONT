import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importa la instancia configurada de Axios
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2'; // Importar SweetAlert
import styles from './AgregarDireccion.module.css'; // Asegúrate de crear o modificar un archivo CSS para este componente

const AgregarDireccion = () => {
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreDireccion, setNombreDireccion] = useState('');
  const [editingDireccion, setEditingDireccion] = useState(null);
  const [originalData, setOriginalData] = useState({}); // Almacena los datos originales de la dirección editada

  // Petición a la API para obtener las direcciones
  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const response = await axiosInstance.get('/direccion/get-direcciones');
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

  // Función para manejar el envío del formulario (Agregar Dirección)
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
      const response = await axiosInstance.post('/direccion/create-direccion', {
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
        text: error.message || 'Ocurrió un error al intentar agregar la dirección. Por favor, intente nuevamente.',
      });
    }
  };

  // Función para cargar datos de dirección en formulario para edición
  const handleEditDireccion = async (id) => {
    try {
      const response = await axiosInstance.get(`/direccion/get-direccion/${id}`);
      if (response.data.success) {
        const direccion = response.data.data;
        setNombreDireccion(direccion.nombre_direccion);
        setOriginalData({ nombre_direccion: direccion.nombre_direccion }); // Guarda los datos originales
        setEditingDireccion(id);
      } else {
        console.error('Error al cargar dirección:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar dirección:', error);
    }
  };

  // Función para guardar cambios de una dirección editada
  const handleSaveChanges = async () => {
    if (!nombreDireccion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingrese un nombre para la dirección.',
      });
      return;
    }

    try {
      const response = await axiosInstance.put(`/direccion/update-direccion/${editingDireccion}`, {
        nombre_direccion: nombreDireccion,
      });

      if (response.data.success) {
        const changes = Object.entries({ nombre_direccion: nombreDireccion })
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => `<p><b>${key}:</b> ${originalData[key]} → ${value}</p>`)
          .join('');

        Swal.fire({
          title: 'Confirmar Cambios',
          html: changes.length > 0 ? changes : '<p>No hay cambios realizados.</p>',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Cambios guardados',
              text: 'La dirección se actualizó exitosamente.',
            });

            // Actualiza la lista de direcciones
            setDirecciones((prev) =>
              prev.map((direccion) =>
                direccion.id_direccion === editingDireccion
                  ? { ...direccion, nombre_direccion: nombreDireccion }
                  : direccion
              )
            );

            // Restablecer el formulario
            setNombreDireccion('');
            setEditingDireccion(null);
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudieron guardar los cambios.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: error.message || 'Ocurrió un error al intentar guardar los cambios.',
      });
    }
  };

  // Función para eliminar una dirección con confirmación
  const handleDeleteDireccion = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la dirección permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/direccion/delete-direccion/${id}`);

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Dirección eliminada',
              text: 'La dirección se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de direcciones
            setDirecciones(direcciones.filter((direccion) => direccion.id_direccion !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar la dirección.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar la dirección.',
          });
        }
      }
    });
  };

  return (
    <div className={styles.agregarDireccionContainer}>
      <main className={`${styles.agregarDireccionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDireccionTitle}>
          {editingDireccion ? 'Editar Dirección' : 'Agregar Dirección'}
        </h2>
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
          <button
            className={styles.agregarDireccionBackButtonAction}
            onClick={() => navigate('/menu')}
          >
            Atrás
          </button>
          {editingDireccion ? (
            <button
              className={styles.agregarDireccionAddButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarDireccionAddButton}
              onClick={handleAddDireccion}
            >
              Agregar
            </button>
          )}
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
                          onClick={() => handleEditDireccion(direccion.id_direccion)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteDireccion(direccion.id_direccion)}
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
      <button className={styles.agregarDireccionHomeButton} onClick={() => navigate('/')}>
        🏠
      </button>
    </div>
  );
};

export default AgregarDireccion;
