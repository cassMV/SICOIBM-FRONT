import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importar la instancia personalizada
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarRol.module.css';

const AgregarRol = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRol, setEditingRol] = useState(null); // Estado para modo edición
  const [originalData, setOriginalData] = useState({}); // Almacena los datos originales del rol editado
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [filteredRoles, setFilteredRoles] = useState([]); // Estado para roles filtrados

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion_rol: '',
  });

  // Obtener roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/rol/get-roles');
        if (response.data.success) {
          setRoles(response.data.data);
          setFilteredRoles(response.data.data); // Inicializa roles filtrados
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchRoles();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para enviar los datos del formulario (Agregar Rol)
  const handleAddRol = async () => {
    try {
      const response = await axiosInstance.post('/rol/create-rol', formData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Rol agregado!',
          text: 'El rol se ha agregado exitosamente.',
        });
        setRoles([...roles, response.data.data]); // Actualiza la tabla de roles
        setFormData({
          nombre_rol: '',
          descripcion_rol: '',
        }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el rol.',
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

  // Función para cargar datos de rol en formulario para edición
  const handleEditRol = async (id) => {
    try {
      const response = await axiosInstance.get(`/rol/get-rol/${id}`);
      if (response.data.success) {
        const rol = response.data.data;
        setFormData({
          nombre_rol: rol.nombre_rol,
          descripcion_rol: rol.descripcion_rol,
        });
        setOriginalData({
          nombre_rol: rol.nombre_rol,
          descripcion_rol: rol.descripcion_rol,
        }); // Guarda los datos originales
        setEditingRol(id);
      } else {
        console.error('Error al cargar rol:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cargar rol:', error);
    }
  };

  // Función para guardar cambios de un rol editado
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/rol/update-rol/${editingRol}`,
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
              text: 'El rol se actualizó exitosamente.',
            });

            // Actualiza la lista de roles
            setRoles((prev) =>
              prev.map((rol) =>
                rol.id_rol === editingRol ? { ...rol, ...formData } : rol
              )
            );

            // Restablecer el formulario
            setFormData({
              nombre_rol: '',
              descripcion_rol: '',
            });
            setEditingRol(null);
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
  const recordsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredRoles.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredRoles.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = roles.filter((rol) =>
      rol.nombre_rol.toLowerCase().includes(term)
    );

    setFilteredRoles(filtered);
  };

  return (
    <div className={styles.agregarRolContainer}>
      <main className={`${styles.agregarRolMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarRolTitle}>
          {editingRol ? 'Editar Rol' : 'Agregar Rol'}
        </h2>
        <div className={styles.agregarRolFormContainer}>
          <div className={styles.agregarRolFormRow}>
            <input
              type="text"
              placeholder="Nombre del rol"
              className={styles.agregarRolInput2}
              name="nombre_rol"
              value={formData.nombre_rol}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Descripción"
              className={styles.agregarRolInput}
              name="descripcion_rol"
              value={formData.descripcion_rol}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.agregarRolFormActions}>
          <button
            className={styles.agregarRolBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingRol ? (
            <button
              className={styles.agregarRolAddButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarRolAddButton}
              onClick={handleAddRol}
            >
              Agregar
            </button>
          )}
        </div>

        {/* Campo de búsqueda */}
        <div className={styles.agregarRolFormActions}>
          <div className={styles.agregarRolSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por nombre del rol"
              className={styles.agregarRolSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Actualiza la búsqueda en tiempo real
            />
            <button className={styles.agregarRolSearchButton} onClick={handleSearch}>🔍</button>
          </div>
        </div>

        {/* Spinner o tabla de roles */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Roles</h3>
            <table className={`${styles.rolTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((rol) => (
                  <tr key={rol.id_rol}>
                    <td>{rol.nombre_rol}</td>
                    <td>{rol.descripcion_rol}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditRol(rol.id_rol)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteRol(rol.id_rol)}
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
        className={styles.agregarRolHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarRol;
