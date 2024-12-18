import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarTipoAlta.module.css';

function AgregarTipoAlta() {
  const navigate = useNavigate();
  const [tiposAlta, setTiposAlta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    descripcion_alta: '',
  });

  // Obtener tipos de alta desde la API
  useEffect(() => {
    const fetchTiposAlta = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tipo-alta/get-tipos-alta`
        );
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tipo-alta/create-tipo-alta`,
        formData
      );

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

  // Función para eliminar un área con confirmación
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
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/tipo-alta/delete-tipo-alta/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Tipo de alta eliminada',
              text: 'El tipo de alta se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de áreas
            setTiposAlta(tiposAlta.filter((tipoAlta) => tipoAlta.id_tipo_alta !== id));
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
            text: 'Ocurrió un error al intentar eliminar el tipo de alta.',
          });
        }
      }
    });
  };

  return (
    <div className={styles.agregarTipoAltaContainer}>
      <main className={`${styles.agregarTipoAltaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoAltaTitle}>Agregar Tipo de Alta</h2>
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
          <button
            className={styles.agregarTipoAltaAddButton}
            onClick={handleAddTipoAlta}
          >
            Agregar
          </button>
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
                          onClick={() =>
                            console.log(`Editar tipo de alta ${tipoAlta.id_tipo_alta}`)
                          }
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
