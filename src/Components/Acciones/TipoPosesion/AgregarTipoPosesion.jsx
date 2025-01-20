import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importar instancia personalizada de Axios
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarTipoPosesion.module.css';

function AgregarTipoPosesion() {
  const navigate = useNavigate();
  const [posesiones, setPosesiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPosesiones, setFilteredPosesiones] = useState([]); // Posesiones filtradas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

  // Estado del formulario
  const [descripcionPosesion, setDescripcionPosesion] = useState('');
  const [clavePosesion, setClavePosesion] = useState('');
  const [statusPosesion, setStatusPosesion] = useState('');

  // Estado para edición
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Obtener posesiones desde la API
  useEffect(() => {
    const fetchPosesiones = async () => {
      try {
        const response = await axiosInstance.get('/tipo-posesion/get-posesiones');
        if (response.data.success) {
          setPosesiones(response.data.data);
          setFilteredPosesiones(response.data.data); // Inicializar posesiones filtradas
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las posesiones:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchPosesiones();
  }, []);

  // Función para enviar los datos del formulario
  const handleAddPosesion = async () => {
    try {
      const body = {
        descripcion_posesion: descripcionPosesion,
        clave_posesion: clavePosesion,
        status_posesion: statusPosesion,
      };

      const response = await axiosInstance.post('/tipo-posesion/create-posesion', body);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Posesión agregada!',
          text: 'El tipo de posesión se ha agregado exitosamente.',
        });
        setPosesiones([...posesiones, response.data.data]); // Actualiza la tabla
        setDescripcionPosesion('');
        setClavePosesion('');
        setStatusPosesion('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la posesión.',
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

  // Función para eliminar un tipo de posesión con confirmación
  const handleDeleteTipoPosesion = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el tipo de posesión permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/tipo-posesion/delete-posesion/${id}`);

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Posesión eliminada',
              text: 'El tipo de posesión se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de posesiones
            setPosesiones((prev) =>
              prev.filter((posesion) => posesion.id_tipo_posesion !== id)
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar la posesión.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Error desconocido.',
          });
        }
      }
    });
  };

  // Función para iniciar la edición de una posesión
  const handleEditPosesion = async (id) => {
    try {
      const response = await axiosInstance.get(`/tipo-posesion/get-posesion/${id}`);
      if (response.data.success) {
        const { descripcion_posesion, clave_posesion, status_posesion } = response.data.data;
        setDescripcionPosesion(descripcion_posesion);
        setClavePosesion(clave_posesion);
        setStatusPosesion(status_posesion);
        setEditingId(id);
        setOriginalData(response.data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar la posesión.',
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

  // Función para guardar los cambios de la posesión
  const handleSaveChanges = async () => {
    try {
      const body = {
        descripcion_posesion: descripcionPosesion,
        clave_posesion: clavePosesion,
        status_posesion: statusPosesion,
      };

      const response = await axiosInstance.put(
        `/tipo-posesion/update-posesion/${editingId}`,
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
              text: 'La posesión se ha actualizado exitosamente.',
            });

            // Actualizar la lista de posesiones
            setPosesiones((prev) =>
              prev.map((posesion) =>
                posesion.id_tipo_posesion === editingId ? { ...posesion, ...body } : posesion
              )
            );

            // Resetear el formulario
            setDescripcionPosesion('');
            setClavePosesion('');
            setStatusPosesion('');
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

  //Funcion para paginacion
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredPosesiones.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredPosesiones.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const results = posesiones.filter((posesion) =>
      posesion.descripcion_posesion?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPosesiones(value.trim() === '' ? posesiones : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=tipoposesion",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_tipo_posesion.xlsx");
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
    <div className={styles.agregarTipoPosesionContainer}>
      <main className={`${styles.agregarTipoPosesionMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoPosesionTitle}>
          {editingId ? 'Editar Tipo de Posesión' : 'Agregar Tipo de Posesión'}
        </h2>
        <div className={styles.agregarTipoPosesionFormContainer}>
          <div className={styles.agregarTipoPosesionFormRow}>
            <input
              type="text"
              placeholder="Descripción de la Posesión"
              className={styles.agregarTipoPosesionInput}
              value={descripcionPosesion}
              onChange={(e) => setDescripcionPosesion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Clave de Posesión"
              className={styles.agregarTipoPosesionInput}
              value={clavePosesion}
              onChange={(e) => setClavePosesion(e.target.value)}
            />
            <select
              className={styles.agregarTipoPosesionSelect}
              value={statusPosesion}
              onChange={(e) => setStatusPosesion(e.target.value)}
            >
              <option value="">Status de posesión</option>
              <option value="Activo">Activa</option>
              <option value="Inactivo">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarTipoPosesionFormActions}>
          <button
            className={styles.agregarTipoPosesionBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingId ? (
            <button
              className={styles.agregarTipoPosesionSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarTipoPosesionAddButton}
              onClick={handleAddPosesion}
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
        <div className={styles.agregarTipoPosesionFormActions}>
          <div className={styles.agregarTipoPosesionSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por descripción de posesión"
              className={styles.agregarTipoPosesionSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Búsqueda en tiempo real
            />
            <button className={styles.agregarTipoPosesionSearchButton} disabled>
              🔍
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Tipos de Posesión</h3>
            <table className={`${styles.posesionTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Clave</th>
                  <th>Status</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((posesion) => (
                  <tr key={posesion.id_tipo_posesion}>
                    <td>{posesion.descripcion_posesion}</td>
                    <td>{posesion.clave_posesion}</td>
                    <td>{posesion.status_posesion}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditPosesion(posesion.id_tipo_posesion)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteTipoPosesion(posesion.id_tipo_posesion)}
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
        className={styles.agregarTipoPosesionHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarTipoPosesion;