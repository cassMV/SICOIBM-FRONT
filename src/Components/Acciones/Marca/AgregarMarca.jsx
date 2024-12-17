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

  // Función para enviar los datos del formulario
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

  return (
    <div className={styles.agregarMarcaContainer}>
      <main className={`${styles.agregarMarcaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarMarcaTitle}>Agregar Marca</h2>
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
          <button
            className={styles.agregarMarcaAddButton}
            onClick={handleAddMarca}
          >
            Agregar
          </button>
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
                          onClick={() => console.log(`Editar marca ${marca.id_marca}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar marca ${marca.id_marca}`)}
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
