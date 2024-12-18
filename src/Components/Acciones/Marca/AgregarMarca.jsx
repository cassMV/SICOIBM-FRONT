import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarMarca.module.css';

function AgregarMarca() {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Modo edición
  const [selectedMarcaId, setSelectedMarcaId] = useState(null); // ID de la marca a editar
  const [originalData, setOriginalData] = useState({}); // Datos originales de la marca

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_marca: '',
    status_marca: '',
  });

  // Obtener marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/marca/get-marcas`
        );
        if (response.data.success) {
          setMarcas(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las marcas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchMarcas();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Agregar nueva marca
  const handleAddMarca = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/marca/create-marca`,
        formData
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Marca agregada!',
          text: 'La marca se ha agregado exitosamente.',
        });
        setMarcas([...marcas, response.data.data]); // Actualiza la tabla
        setFormData({
          nombre_marca: '',
          status_marca: '',
        }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la marca.',
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

  // Manejar edición de marca
  const handleEditMarca = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/marca/get-marca/${id}`
      );
      if (response.data.success) {
        const marca = response.data.data;
        setFormData({
          nombre_marca: marca.nombre_marca,
          status_marca: marca.status_marca,
        });
        setOriginalData(marca); // Guardar datos originales
        setEditMode(true);
        setSelectedMarcaId(id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar la marca.',
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

  // Guardar cambios en una marca editada
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/marca/update-marca/${selectedMarcaId}`,
        formData
      );

      if (response.data.success) {
        const changes = Object.entries(formData)
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => {
            return `<p><b>${key}:</b> ${originalData[key]} → ${value}</p>`;
          })
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
              text: 'La marca se ha actualizado exitosamente.',
            });

            // Actualizar la lista de marcas
            setMarcas((prev) =>
              prev.map((marca) =>
                marca.id_marca === selectedMarcaId
                  ? { ...marca, ...formData }
                  : marca
              )
            );

            // Restablecer el formulario
            setFormData({
              nombre_marca: '',
              status_marca: '',
            });
            setEditMode(false);
            setSelectedMarcaId(null);
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
    <div className={styles.agregarMarcaContainer}>
      <main className={`${styles.agregarMarcaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarMarcaTitle}>
          {editMode ? 'Editar Marca' : 'Agregar Marca'}
        </h2>
        <div className={styles.agregarMarcaFormContainer}>
          <div className={styles.agregarMarcaFormRow}>
            <input
              type="text"
              placeholder="Nombre de la marca"
              className={styles.agregarMarcaInput}
              name="nombre_marca"
              value={formData.nombre_marca}
              onChange={handleInputChange}
            />
            <select
              className={styles.agregarMarcaSelect}
              name="status_marca"
              value={formData.status_marca}
              onChange={handleInputChange}
            >
              <option value="">Status de la marca</option>
              <option value="Activo">Activa</option>
              <option value="Inactivo">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarMarcaFormActions}>
          <button
            className={styles.agregarMarcaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editMode ? (
            <button
              className={styles.agregarMarcaSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarMarcaAddButton}
              onClick={handleAddMarca}
            >
              Agregar
            </button>
          )}
        </div>

        {/* Spinner o tabla de marcas */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Marcas</h3>
            <table className={`${styles.marcaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Status</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {marcas.map((marca) => (
                  <tr key={marca.id_marca}>
                    <td>{marca.id_marca}</td>
                    <td>{marca.nombre_marca}</td>
                    <td>{marca.status_marca}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditMarca(marca.id_marca)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            Swal.fire({
                              icon: "info",
                              title: "Función no implementada",
                              text: "La eliminación de marcas aún no está disponible.",
                            })
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
        className={styles.agregarMarcaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarMarca;
