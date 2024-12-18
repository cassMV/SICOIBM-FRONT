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

  // Estado para edición
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState({});

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

  // Función para agregar un área
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/area/create-area`, {
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
        text: error.message || 'Ocurrió un error al intentar agregar el área.',
      });
    }
  };

  // Función para eliminar un área con confirmación
  const handleDeleteArea = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el área permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/area/delete-area/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Área eliminada',
              text: 'El área se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de áreas
            setAreas(areas.filter((area) => area.id_area !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el área.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar el área.',
          });
        }
      }
    });
  };

  // Función para iniciar la edición de un área
  const handleEditArea = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/area/get-area/${id}`
      );
      if (response.data.success) {
        setNombreArea(response.data.data.nombre_area);
        setEditingId(id);
        setOriginalData(response.data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar el área.',
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

  // Función para guardar los cambios de un área
  const handleSaveChanges = async () => {
    try {
      const body = {
        nombre_area: nombreArea,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/area/update-area/${editingId}`,
        body
      );

      if (response.data.success) {
        const changes = Object.entries(body)
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => `<b>${key}:</b> ${originalData[key]} → ${value}`)
          .join('<br>');

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
              text: 'El área se ha actualizado exitosamente.',
            });

            // Actualizar la lista de áreas
            setAreas((prev) =>
              prev.map((area) =>
                area.id_area === editingId ? { ...area, ...body } : area
              )
            );

            // Resetear el formulario
            setNombreArea('');
            setEditingId(null);
            setOriginalData({});
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

  return (
    <div className={styles.agregarAreaContainer}>
      <main className={`${styles.agregarAreaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarAreaTitle}>
          {editingId ? 'Editar Área' : 'Agregar Área'}
        </h2>
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
          {editingId ? (
            <button className={styles.agregarAreaSaveButton} onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          ) : (
            <button className={styles.agregarAreaAddButton} onClick={handleAddArea}>
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
                          onClick={() => handleEditArea(area.id_area)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteArea(area.id_area)}
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
      <button className={styles.agregarAreaHomeButton} onClick={() => navigate('/')}>
        🏠
      </button>
    </div>
  );
};

export default AgregarArea;