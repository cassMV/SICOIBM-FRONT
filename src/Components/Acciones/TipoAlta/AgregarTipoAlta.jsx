import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importar instancia personalizada de Axios
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarTipoAlta.module.css';

function AgregarTipoAlta() {
  const navigate = useNavigate();
  const [tiposAlta, setTiposAlta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Modo edición
  const [selectedTipoAltaId, setSelectedTipoAltaId] = useState(null); // ID del tipo de alta en edición
  const [originalData, setOriginalData] = useState({}); // Datos originales del tipo de alta

  // Estado del formulario
  const [formData, setFormData] = useState({
    descripcion_alta: '',
  });

  // Obtener tipos de alta desde la API
  useEffect(() => {
    const fetchTiposAlta = async () => {
      try {
        const response = await axiosInstance.get('/tipo-alta/get-tipos-alta');
        if (response.data.success) {
          setTiposAlta(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de alta:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTiposAlta();
  }, []);

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para enviar los datos del formulario
  const handleAddTipoAlta = async () => {
    try {
      const response = await axiosInstance.post('/tipo-alta/create-tipo-alta', formData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Tipo de Alta Agregado!',
          text: 'El tipo de alta se ha agregado exitosamente.',
        });
        setTiposAlta([...tiposAlta, response.data.data]); // Actualiza la tabla
        setFormData({ descripcion_alta: '' }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el tipo de alta.',
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

  // Cargar datos para edición
  const handleEditTipoAlta = async (id) => {
    try {
      const response = await axiosInstance.get(`/tipo-alta/get-tipo-alta/${id}`);
      if (response.data.success) {
        setFormData(response.data.data); // Rellenar el formulario
        setOriginalData(response.data.data); // Guardar los datos originales
        setEditMode(true);
        setSelectedTipoAltaId(id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar el tipo de alta.',
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

  // Guardar cambios en el tipo de alta
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/tipo-alta/update-tipo-alta/${selectedTipoAltaId}`,
        formData
      );

      if (response.data.success) {
        const changes = Object.entries(formData)
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
              text: 'El tipo de alta se ha actualizado exitosamente.',
            });

            // Actualizar la lista
            setTiposAlta((prev) =>
              prev.map((tipoAlta) =>
                tipoAlta.id_tipo_alta === selectedTipoAltaId
                  ? { ...tipoAlta, ...formData }
                  : tipoAlta
              )
            );

            // Resetear formulario
            setFormData({ descripcion_alta: '' });
            setEditMode(false);
            setSelectedTipoAltaId(null);
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
        text: error.message || 'Error desconocido.',
      });
    }
  };

  // Función para eliminar un tipo de alta con confirmación
  const handleDeleteTipoAlta = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el tipo de alta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/tipo-alta/delete-tipo-alta/${id}`);

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Tipo de alta eliminada',
              text: 'El tipo de alta se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de tipos de alta
            setTiposAlta((prev) =>
              prev.filter((tipoAlta) => tipoAlta.id_tipo_alta !== id)
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el tipo de alta.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar el tipo de alta.',
          });
        }
      }
    });
  };

  return (
    <div className={styles.agregarTipoAltaContainer}>
      <main className={`${styles.agregarTipoAltaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoAltaTitle}>
          {editMode ? 'Editar Tipo de Alta' : 'Agregar Tipo de Alta'}
        </h2>
        <div className={styles.agregarTipoAltaFormContainer}>
          <div className={styles.agregarTipoAltaFormRow}>
            <select
              className={styles.agregarTipoAltaSelect}
              name="descripcion_alta"
              value={formData.descripcion_alta}
              onChange={handleInputChange}
            >
              <option value="">Descripción Alta</option>
              <option value="Compra">Compra</option>
              <option value="Asignacion">Asignación</option>
              <option value="Donacion">Donación</option>
              <option value="Comodato">Comodato</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarTipoAltaFormActions}>
          <button
            className={styles.agregarTipoAltaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editMode ? (
            <button
              className={styles.agregarTipoAltaSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarTipoAltaAddButton}
              onClick={handleAddTipoAlta}
            >
              Agregar
            </button>
          )}
        </div>

        {/* Spinner o tabla de tipos de alta */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Tipos de Alta</h3>
            <table className={`${styles.tipoAltaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {tiposAlta.map((tipoAlta) => (
                  <tr key={tipoAlta.id_tipo_alta}>
                    <td>{tipoAlta.id_tipo_alta}</td>
                    <td>{tipoAlta.descripcion_alta}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditTipoAlta(tipoAlta.id_tipo_alta)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteTipoAlta(tipoAlta.id_tipo_alta)}
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
        className={styles.agregarTipoAltaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarTipoAlta;
