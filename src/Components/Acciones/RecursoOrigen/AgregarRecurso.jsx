import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Asegúrate de importar la configuración de Axios
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarRecurso.module.css';

function AgregarRecurso() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRecursos, setFilteredRecursos] = useState([]); // Recursos filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

  // Estado del formulario
  const [descripcionRecurso, setDescripcionRecurso] = useState('');

  // Estado para edición
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Obtener recursos desde la API
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const response = await axiosInstance.get('/recurso-origen/get-recursos-origen');
        if (response.data.success) {
          setRecursos(response.data.data);
          setFilteredRecursos(response.data.data); // Inicializa los recursos filtrados
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los recursos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchRecursos();
  }, []);

  // Función para enviar los datos del formulario
  const handleAddRecurso = async () => {
    try {
      const body = {
        descripcion_recurso: descripcionRecurso,
      };

      const response = await axiosInstance.post('/recurso-origen/create-recurso-origen', body);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Recurso agregado!',
          text: 'El recurso de origen se ha agregado exitosamente.',
        });
        setRecursos([...recursos, response.data.data]);
        setDescripcionRecurso('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el recurso.',
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

  // Función para eliminar un recurso con confirmación
  const handleDeleteRecurso = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el recurso permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/recurso-origen/delete-recurso-origen/${id}`);

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Recurso eliminado',
              text: 'El recurso se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            setRecursos(recursos.filter((recurso) => recurso.id_recurso_origen !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el recurso.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: 'Ocurrió un error al intentar eliminar el recurso.',
          });
        }
      }
    });
  };

  // Función para iniciar la edición de un recurso
  const handleEditRecurso = async (id) => {
    try {
      const response = await axiosInstance.get(`/recurso-origen/get-recurso-origen/${id}`);
      if (response.data.success) {
        const { descripcion_recurso } = response.data.data;
        setDescripcionRecurso(descripcion_recurso);
        setEditingId(id);
        setOriginalData(response.data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar el recurso.',
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

  // Función para guardar los cambios de un recurso editado
  const handleSaveChanges = async () => {
    try {
      const body = {
        descripcion_recurso: descripcionRecurso,
      };

      const response = await axiosInstance.put(
        `/recurso-origen/update-recurso-origen/${editingId}`,
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
              text: 'El recurso se ha actualizado exitosamente.',
            });

            setRecursos((prev) =>
              prev.map((recurso) =>
                recurso.id_recurso_origen === editingId ? { ...recurso, ...body } : recurso
              )
            );

            setDescripcionRecurso('');
            setEditingId(null);
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

  //Funcion de paginacion
  const recordsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredRecursos.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredRecursos.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const results = recursos.filter((recurso) =>
      recurso.descripcion_recurso?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRecursos(value.trim() === '' ? recursos : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=recursoorigen",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_recurso_origen.xlsx");
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
    <div className={styles.agregarRecursoContainer}>
      <main className={`${styles.agregarRecursoMainContent} ${styles.fadeIn}`}>
      <h2 className={styles.agregarRecursoTitle}>
          {editingId ? 'Editar Recurso Origen' : 'Agregar Recurso Origen'}
        </h2>
        <div className={styles.agregarRecursoFormContainer}>
          <div className={styles.agregarRecursoFormRow}>
            <select
              className={styles.agregarRecursoSelect}
              value={descripcionRecurso}
              onChange={(e) => setDescripcionRecurso(e.target.value)}
            >
              <option value="">Descripción Origen</option>
              <option value="Estatal">Estatal</option>
              <option value="FASP">FASP</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarRecursoFormActions}>
          <button
            className={styles.agregarRecursoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingId ? (
            <button
              className={styles.agregarRecursoSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarRecursoAddButton}
              onClick={handleAddRecurso}
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
        <div className={styles.agregarRecursoFormActions}>
          <div className={styles.agregarRecursoSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por Descripción de Recurso"
              className={styles.agregarRecursoSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Actualiza los resultados en tiempo real
            />
            <button className={styles.agregarRecursoSearchButton} disabled>
              🔍
            </button>
          </div>
        </div>

        {/* Spinner o tabla de recursos */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Recursos de Origen</h3>
            <table className={`${styles.recursoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((recurso) => (
                  <tr key={recurso.id_recurso_origen}>
                    <td>{recurso.descripcion_recurso}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                      <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditRecurso(recurso.id_recurso_origen)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteRecurso(recurso.id_recurso_origen)}
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
        className={styles.agregarRecursoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarRecurso;
