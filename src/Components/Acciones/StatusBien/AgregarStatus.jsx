import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importar la instancia personalizada
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarStatus.module.css';

const AgregarStatus = () => {
  const navigate = useNavigate();
  const [statusBien, setStatusBien] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(null); // Estado para modo edición
  const [originalData, setOriginalData] = useState({}); // Almacena los datos originales del status editado
  const [filteredStatus, setFilteredStatus] = useState([]); // Estado para filtrar los resultados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  // Estado para los valores del formulario
  const [formData, setFormData] = useState({
    descripcion_status: '',
  });

  // Obtener status del bien desde la API
  useEffect(() => {
    const fetchStatusBien = async () => {
      try {
        const response = await axiosInstance.get('/status-bien/get-status-bien');
        if (response.data.success) {
          setStatusBien(response.data.data);
          setFilteredStatus(response.data.data); // Inicializa el estado filtrado
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

  // Función para enviar los datos del formulario (Agregar Status)
  const handleAddStatus = async () => {
    try {
      const response = await axiosInstance.post('/status-bien/create-status-bien', formData);

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

  // Función para cargar datos de status en formulario para edición
  const handleEditStatus = async (id) => {
    try {
      const response = await axiosInstance.get(`/status-bien/get-status-bien/${id}`);
      if (response.data.success) {
        const status = response.data.data;
        setFormData({ descripcion_status: status.descripcion_status });
        setOriginalData({ descripcion_status: status.descripcion_status }); // Guarda los datos originales
        setEditingStatus(id);
      } else {
        console.error('Error al cargar el status:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar el status:', error);
    }
  };

  // Función para guardar cambios de un status editado
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/status-bien/update-status-bien/${editingStatus}`,
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
              text: 'El status se actualizó exitosamente.',
            });

            // Actualiza la lista de status
            setStatusBien((prev) =>
              prev.map((status) =>
                status.id_status_bien === editingStatus
                  ? { ...status, descripcion_status: formData.descripcion_status }
                  : status
              )
            );

            // Restablecer el formulario
            setFormData({ descripcion_status: '' });
            setEditingStatus(null);
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
  
  //Funcion para paginacion
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredStatus.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredStatus.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = statusBien.filter((status) =>
      status.descripcion_status.toLowerCase().includes(term)
    );

    setFilteredStatus(filtered);
  };

  return (
    <div className={styles.agregarStatusContainer}>
      <main className={`${styles.agregarStatusMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarStatusTitle}>
          {editingStatus ? 'Editar Status del Bien' : 'Agregar Status del Bien'}
        </h2>
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
          {editingStatus ? (
            <button
              className={styles.agregarStatusAddButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarStatusAddButton}
              onClick={handleAddStatus}
            >
              Agregar
            </button>
          )}
        </div>

        {/* Campo de búsqueda */}
        <div className={styles.agregarStatusFormActions}>
          <div className={styles.agregarStatusSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por descripción del status"
              className={styles.agregarStatusSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Actualiza los resultados en tiempo real
            />
            <button className={styles.agregarStatusSearchButton} onClick={handleSearch}>🔍</button>
          </div>
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
                  <th>Descripción</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((status) => (
                  <tr key={status.id_status_bien}>
                    <td>{status.descripcion_status}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditStatus(status.id_status_bien)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteStatus(status.id_status_bien)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? styles.active : ""}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
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
