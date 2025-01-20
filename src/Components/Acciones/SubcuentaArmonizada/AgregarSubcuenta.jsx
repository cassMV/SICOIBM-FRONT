import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importar la instancia de Axios
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarSubcuenta.module.css';

function AgregarSubcuenta() {
  const navigate = useNavigate();
  const [subcuentas, setSubcuentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSubcuentas, setFilteredSubcuentas] = useState([]); // Subcuentas filtradas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

  // Estado del formulario
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [statusSubcuenta, setStatusSubcuenta] = useState('');
  const [borradorSubcuenta, setBorradorSubcuenta] = useState('');

  // Estado para edición
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Obtener subcuentas desde la API
  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const response = await axiosInstance.get('/subcuenta-armonizada/get-subcuentas');
        if (response.data.success) {
          setSubcuentas(response.data.data);
          setFilteredSubcuentas(response.data.data); // Inicializar subcuentas filtradas
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las subcuentas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchSubcuentas();
  }, []);

  // Función para enviar los datos del formulario
  const handleAddSubcuenta = async () => {
    try {
      const body = {
        nombre_subcuenta: nombreSubcuenta,
        status_subcuenta: statusSubcuenta,
        borrador_subcuenta: borradorSubcuenta === 'Habilitado', // Convierte a booleano
      };

      const response = await axiosInstance.post('/subcuenta-armonizada/create-subcuenta', body);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Subcuenta agregada!',
          text: 'La subcuenta armonizada se ha agregado exitosamente.',
        });
        setSubcuentas([...subcuentas, response.data.data]); // Actualiza la tabla
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la subcuenta.',
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

  // Función para eliminar la subcuenta con confirmación
  const handleDeleteSubcuenta = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la subcuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/subcuenta-armonizada/delete-subcuenta/${id}`);
          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Subcuenta eliminada',
              text: 'La subcuenta se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });
            setSubcuentas(subcuentas.filter((subcuenta) => subcuenta.id_subcuenta !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar la subcuenta.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar la subcuenta.',
          });
        }
      }
    });
  };

  // Función para iniciar la edición de una subcuenta
  const handleEditSubcuenta = async (id) => {
    try {
      const response = await axiosInstance.get(`/subcuenta-armonizada/get-subcuenta/${id}`);
      if (response.data.success) {
        const { nombre_subcuenta, status_subcuenta, borrador_subcuenta } = response.data.data;
        setNombreSubcuenta(nombre_subcuenta);
        setStatusSubcuenta(status_subcuenta);
        setBorradorSubcuenta(borrador_subcuenta ? 'Habilitado' : 'Inhabilitado');
        setEditingId(id);
        setOriginalData(response.data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar la subcuenta.',
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

  // Función para guardar los cambios de la subcuenta
  const handleSaveChanges = async () => {
    try {
      const body = {
        nombre_subcuenta: nombreSubcuenta,
        status_subcuenta: statusSubcuenta,
        borrador_subcuenta: borradorSubcuenta === 'Habilitado',
      };

      const response = await axiosInstance.put(
        `/subcuenta-armonizada/update-subcuenta/${editingId}`,
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
              text: 'La subcuenta se ha actualizado exitosamente.',
            });

            setSubcuentas((prev) =>
              prev.map((subcuenta) =>
                subcuenta.id_subcuenta === editingId ? { ...subcuenta, ...body } : subcuenta
              )
            );

            resetForm();
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

  // Restablecer el formulario
  const resetForm = () => {
    setNombreSubcuenta('');
    setStatusSubcuenta('');
    setBorradorSubcuenta('');
    setEditingId(null);
    setOriginalData({});
  };

  //Funcion para paginacion
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredSubcuentas.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredSubcuentas.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const results = subcuentas.filter((subcuenta) =>
      subcuenta.nombre_subcuenta?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSubcuentas(value.trim() === '' ? subcuentas : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=subcuentaarmonizada",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_subcuenta_armonizada.xlsx");
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
    <div className={styles.agregarSubcuentaContainer}>
      <main className={`${styles.agregarSubcuentaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarSubcuentaTitle}>
          {editingId ? 'Editar Subcuenta Armonizada' : 'Agregar Subcuenta Armonizada'}
        </h2>
        <div className={styles.agregarSubcuentaFormContainer}>
          <div className={styles.agregarSubcuentaFormRow}>
            <input
              type="text"
              placeholder="Código de la Subcuenta"
              className={styles.agregarSubcuentaInput}
              value={nombreSubcuenta}
              onChange={(e) => setNombreSubcuenta(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre de la Subcuenta Armonizada"
              className={styles.agregarSubcuentaInput}
              value={nombreSubcuenta}
              onChange={(e) => setNombreSubcuenta(e.target.value)}
            />
          </div>
          <div className={styles.agregarSubcuentaFormRow}>
            <select
              className={styles.agregarSubcuentaSelect}
              value={borradorSubcuenta}
              onChange={(e) => setBorradorSubcuenta(e.target.value)}
            >
              <option value="">Borrador de Subcuenta Armonizada</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Inhabilitado">Inhabilitado</option>
            </select>
            <select
              className={styles.agregarSubcuentaSelect}
              value={statusSubcuenta}
              onChange={(e) => setStatusSubcuenta(e.target.value)}
            >
              <option value="">Status de la Subcuenta</option>
              <option value="Activo">Activa</option>
              <option value="Inactivo">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarSubcuentaFormActions}>
          <button
            className={styles.agregarSubcuentaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingId ? (
            <button
              className={styles.agregarSubcuentaSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarSubcuentaAddButton}
              onClick={handleAddSubcuenta}
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
        <div className={styles.agregarSubcuentaFormActions}>
          <div className={styles.agregarSubcuentaSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por Nombre de Subcuenta"
              className={styles.agregarSubcuentaSearchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className={styles.agregarSubcuentaSearchButton} disabled>🔍</button>
        </div>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Subcuentas</h3>
            <table className={`${styles.subcuentaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Status</th>
                  <th>Borrador</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((subcuenta) => (
                  <tr key={subcuenta.id_subcuenta}>
                    <td>{subcuenta.nombre_subcuenta}</td>
                    <td>{subcuenta.status_subcuenta}</td>
                    <td>{subcuenta.borrador_subcuenta ? 'Sí' : 'No'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditSubcuenta(subcuenta.id_subcuenta)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteSubcuenta(subcuenta.id_subcuenta)}
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
        className={styles.agregarSubcuentaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarSubcuenta;