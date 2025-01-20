import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importa la instancia configurada de Axios
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarCodigo.module.css';

function AgregarCodigo() {
  const navigate = useNavigate();
  const [partidas, setPartidas] = useState([]);
  const [subcuentas, setSubcuentas] = useState([]); // Estado para subcuentas
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Modo edición
  const [selectedPartidaId, setSelectedPartidaId] = useState(null); // ID de la partida en edición
  const [filteredPartidas, setFilteredPartidas] = useState([]); // Partidas filtradas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda


  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo_partida: '',
    nombre_partida: '',
    borrador_partida: false,
    status_partida: '',
    id_subcuenta: '',
  });

  // Obtener partidas desde la API
  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const response = await axiosInstance.get('/codigo-partida-especifica/get-partidas');
        if (response.data.success) {
          setPartidas(response.data.data);
          setFilteredPartidas(response.data.data); // Inicializar las partidas filtradas
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las partidas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchPartidas();
  }, []);

  // Obtener subcuentas desde la API
  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const response = await axiosInstance.get('/subcuenta-armonizada/get-subcuentas');
        if (response.data.success) {
          setSubcuentas(response.data.data);
        } else {
          console.error('Error al obtener las subcuentas:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las subcuentas:', error);
      }
    };

    fetchSubcuentas();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'id_subcuenta' ? Number(value) : value,
    });
  };

  // Función para enviar los datos del formulario
  const handleAddPartida = async () => {
    try {
      const response = await axiosInstance.post('/codigo-partida-especifica/create-partida', formData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Partida agregada!',
          text: 'La partida específica se ha agregado exitosamente.',
        });
        setPartidas([...partidas, response.data.data]); // Actualiza la tabla
        setFormData({
          codigo_partida: '',
          nombre_partida: '',
          borrador_partida: false,
          status_partida: '',
          id_subcuenta: '',
        }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la partida.',
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

  // Función para cargar los datos de una partida en el formulario para edición
  const handleEditPartida = async (id) => {
    try {
      const response = await axiosInstance.get(`/codigo-partida-especifica/get-partida/${id}`);
      if (response.data.success) {
        const partida = response.data.data;
        setFormData({
          codigo_partida: partida.codigo_partida,
          nombre_partida: partida.nombre_partida,
          borrador_partida: partida.borrador_partida,
          status_partida: partida.status_partida,
          id_subcuenta: partida.id_subcuenta,
        });
        setEditMode(true);
        setSelectedPartidaId(id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar la partida.',
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

  // Función para guardar los cambios de una partida editada
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/codigo-partida-especifica/update-partida/${selectedPartidaId}`,
        formData
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'La partida se ha actualizado exitosamente.',
        });

        // Actualizar la lista de partidas
        setPartidas((prev) =>
          prev.map((partida) =>
            partida.id_partida === selectedPartidaId ? { ...partida, ...formData } : partida
          )
        );

        // Resetear formulario
        setFormData({
          codigo_partida: '',
          nombre_partida: '',
          borrador_partida: false,
          status_partida: '',
          id_subcuenta: '',
        });
        setEditMode(false);
        setSelectedPartidaId(null);
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

  // Función para eliminar un código con confirmación
  const handleDeleteCodigo = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el código permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `/codigo-partida-especifica/delete-partida/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Código eliminado',
              text: 'El código se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de áreas
            setPartidas(partidas.filter((partida) => partida.id_partida !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el código de partida.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar el código de partida.',
          });
        }
      }
    });
  };

  // Funcion para paginacion
  const recordsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredPartidas.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredPartidas.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función de búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const results = partidas.filter(
      (partida) =>
        partida.codigo_partida?.toLowerCase().includes(value.toLowerCase()) ||
        partida.nombre_partida?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPartidas(value.trim() === "" ? partidas : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=codigopartidaespecifica",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_codigo_partida_especifica.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El archivo Excel ha sido generado y descargado.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el archivo Excel.",
      });
      console.error("Error al generar el Excel:", error);
    }
  };


  return (
    <div className={styles.agregarCodigoContainer}>
      <main className={`${styles.agregarCodigoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarCodigoTitle}>
          {editMode ? 'Editar Código de Partida Específica' : 'Agregar Código de Partida Específica'}
        </h2>
        <div className={styles.agregarCodigoFormContainer}>
          <div className={styles.agregarBajaBienFormRow}>
            <input
              type="text"
              placeholder="Código Partida"
              className={styles.agregarCodigoInput}
              name="codigo_partida"
              value={formData.codigo_partida}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Nombre de la Partida"
              className={styles.agregarCodigoInput}
              name="nombre_partida"
              value={formData.nombre_partida}
              onChange={handleInputChange}
            />
            <label>
              <input
                type="checkbox"
                name="borrador_partida"
                checked={formData.borrador_partida}
                onChange={handleInputChange}
              />
              Borrador
            </label>
          </div>
          <div className={styles.agregarBajaBienFormRow}>
            <select
              className={styles.agregarCodigoInput}
              name="status_partida"
              value={formData.status_partida}
              onChange={handleInputChange}
            >
              <option value="">Status del Código</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {/* Select para Subcuenta Armonizada */}
            <select
              className={styles.agregarCodigoInput}
              name="id_subcuenta"
              value={formData.id_subcuenta}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una Subcuenta</option>
              {subcuentas.map((subcuenta) => (
                <option key={subcuenta.id_subcuenta} value={subcuenta.id_subcuenta}>
                  {subcuenta.nombre_subcuenta}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.agregarCodigoFormActions}>
          <button
            className={styles.agregarCodigoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editMode ? (
            <button
              className={styles.agregarCodigoSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarCodigoAddButton}
              onClick={handleAddPartida}
            >
              Agregar
            </button>
          )}
          <button
            className={styles.agregarAreaExcelButton}
            onClick={handleGenerateExcel}
          >
            <img
              src="/icon-excel.png" // Ruta relativa desde la carpeta public
              alt="Ícono de Excel"
              className={styles.excelIcon}
            />
          </button>

        </div>

        {/* Campo de búsqueda */}
        <div className={styles.agregarCodigoFormActions}>
        <div className={styles.agregarCodigoSearchContainer}>
          <input
            type="text"
            placeholder="Buscar por Código o Nombre de Partida"
            className={styles.agregarCodigoSearchInput}
            value={searchTerm}
            onChange={handleSearch} // Llama a la función de búsqueda en tiempo real
          />
          <button className={styles.agregarCodigoSearchButton} disabled>
            🔍
          </button>
        </div>
        </div>

        {/* Spinner o tabla de partidas */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Partidas</h3>
            <table className={`${styles.codigoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Borrador</th>
                  <th>Status</th>
                  <th>Subcuenta</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((partida) => (
                  <tr key={partida.id_partida}>
                    <td>{partida.codigo_partida}</td>
                    <td>{partida.nombre_partida}</td>
                    <td>{partida.borrador_partida ? 'Sí' : 'No'}</td>
                    <td>{partida.status_partida}</td>
                    <td>{subcuentas.find((s) => s.id_subcuenta === partida.id_subcuenta)?.nombre_subcuenta || 'N/A'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditPartida(partida.id_partida)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteCodigo(partida.id_partida)}
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
      {/* Botón para ir al Home (opcional) */}
      <button
        className={styles.agregarCodigoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarCodigo;
