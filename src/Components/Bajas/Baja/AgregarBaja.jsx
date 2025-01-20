import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import styles from './AgregarBaja.module.css';

function AgregarBaja() {
  const navigate = useNavigate();
  const [bajas, setBajas] = useState([]);
  const [bienes, setBienes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredBajas, setFilteredBajas] = useState([]); // Estado para bajas filtradas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [formData, setFormData] = useState({
    fecha_baja: '',
    documento_ampare: '',
    poliza_no: '',
    fecha_poliza: '',
    id_bien: '',
    id_usuario: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBien, setSelectedBien] = useState(null);

  useEffect(() => {
    const fetchBajas = async () => {
      try {
        const response = await axiosInstance.get('/baja-bien/get-bajas-bien');
        if (response.data.success) {
          setBajas(response.data.data);
          setFilteredBajas(response.data.data); // Inicializar bajas filtradas
        }
      } catch (error) {
        console.error('Error al obtener las bajas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBajas();
  }, []);

  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await axiosInstance.get('/bien/get-bienes');
        if (response.data.success) {
          setBienes(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener los bienes:', error);
      }
    };

    fetchBienes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'id_bien' || name === 'id_usuario' ? parseInt(value, 10) : value,
    });
  };

  const formatISODate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const prepareFormData = () => ({
    ...formData,
    fecha_baja: formData.fecha_baja ? formatISODate(formData.fecha_baja) : null,
    fecha_poliza: formData.fecha_poliza ? formatISODate(formData.fecha_poliza) : null,
  });

  const handleAddOrUpdateBaja = async () => {
    if (!formData.fecha_baja || !formData.id_bien) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete los campos obligatorios.',
      });
      return;
    }
  
    const bajaRequest = editingId
      ? axiosInstance.put(`/baja-bien/update-baja-bien/${editingId}`, prepareFormData())
      : axiosInstance.post('/baja-bien/create-baja-bien', prepareFormData());
  
    try {
      const bajaResponse = await bajaRequest;
  
      if (bajaResponse.data.success) {
        const updatedBaja = bajaResponse.data.data;
  
        // Actualizar el estado del bien
        const bienUpdatePayload = { estado_bien: 'Inactivo' }; // Estado que deseas asignar
        const bienResponse = await axiosInstance.put(
          `/bien/update-status-bien/${formData.id_bien}`,
          bienUpdatePayload
        );
  
        if (bienResponse.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Operación exitosa',
            text: editingId
              ? 'La baja y la actualización del bien se realizaron exitosamente.'
              : 'La baja y el estado del bien fueron registrados exitosamente.',
          });
  
          if (editingId) {
            setBajas((prev) =>
              prev.map((baja) => (baja.id_baja_bien === editingId ? updatedBaja : baja))
            );
          } else {
            setBajas((prev) => [...prev, updatedBaja]);
          }

          // Actualizar lista de bienes automáticamente
          const updatedBienesResponse = await axiosInstance.get('/bien/get-bienes');
          if (updatedBienesResponse.data.success) {
            setBienes(updatedBienesResponse.data.data.filter(bien => bien.estado_bien !== 'Inactivo'));
          }

          // Limpiar formulario y el input de bien seleccionado
          setFormData({
            fecha_baja: '',
            documento_ampare: '',
            poliza_no: '',
            fecha_poliza: '',
            id_bien: '',
            id_usuario: '',
          });
          setSelectedBien(null);
          setEditingId(null);
          setOriginalData({});
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en la actualización del bien',
            text: bienResponse.data.message || 'No se pudo actualizar el estado del bien.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: bajaResponse.data.message || 'No se pudo completar la operación.',
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
  

  const handleEditBaja = (id) => {
    const bajaToEdit = bajas.find((baja) => baja.id_baja_bien === id);
    if (bajaToEdit) {
      setFormData({
        fecha_baja: bajaToEdit.fecha_baja.split('T')[0],
        documento_ampare: bajaToEdit.documento_ampare,
        poliza_no: bajaToEdit.poliza_no,
        fecha_poliza: bajaToEdit.fecha_poliza.split('T')[0],
        id_bien: bajaToEdit.id_bien,
        id_usuario: bajaToEdit.id_usuario,
      });
      setEditingId(id);
      setOriginalData(bajaToEdit);
    }
  };

  const handleDeleteBaja = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la baja de manera permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/baja-bien/delete-baja-bien/${id}`);
          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La baja se ha eliminado exitosamente.',
            });

            setBajas((prev) => prev.filter((baja) => baja.id_baja_bien !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar la baja.',
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectBien = (bien) => {
    setSelectedBien(bien);
    formData.id_bien = bien.id_bien; // Actualiza formData con el id del bien seleccionado
    handleInputChange({
      target: {
        name: 'id_bien',
        value: bien.id_bien,
      },
    });
    setIsModalOpen(false); // Cierra el modal después de seleccionar
  };

  // Funcion para paginacion
  const recordsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredBajas.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredBajas.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const results = bajas.filter(
      (baja) =>
        baja.documento_ampare?.toLowerCase().includes(value.toLowerCase()) ||
        baja.poliza_no?.toLowerCase().includes(value.toLowerCase()) 
    );

    setFilteredBajas(value.trim() === '' ? bajas : results);
  };

  return (
    <div className={styles.agregarBajaContainer}>
      <main className={`${styles.agregarBajaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarBajaTitle}>
          {editingId ? 'Editar Baja' : 'Agregar Baja'}
        </h2>
        <div className={styles.agregarBajaFormContainer}>
          <div className={styles.agregarBajaFormRow}>
          <label htmlFor="fecha_baja" className={styles.inputLabel}>
            Fecha Baja
          </label>
            <input
              type="date"
              placeholder="Fecha de Baja"
              className={styles.agregarBajaInput}
              name="fecha_baja"
              value={formData.fecha_baja}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Documento Ampara"
              className={styles.agregarBajaInput}
              name="documento_ampare"
              value={formData.documento_ampare}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Número de Póliza"
              className={styles.agregarBajaInput}
              name="poliza_no"
              value={formData.poliza_no}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarBajaFormRow}>
          <label htmlFor="fecha_poliza" className={styles.inputLabel}>
            Fecha Poliza
          </label>
            <input
              type="date"
              placeholder="Fecha de Póliza"
              className={styles.agregarBajaInput}
              name="fecha_poliza"
              value={formData.fecha_poliza}
              onChange={handleInputChange}
            />
            {/* Botón para abrir el modal */}
            {/*<button onClick={handleOpenModal}>Seleccionar Bien</button>*/}

            {/* Modal */}
            {isModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h2>Seleccione un Bien</h2>
                  <ul className={styles.bienList}>
                    {bienes.map((bien) => (
                    <li
                      key={bien.id_bien}
                      onClick={() => handleSelectBien(bien)}
                      className={styles.bienItem}
                      >
                        {`ID: ${bien.id_bien} - Inventario: ${bien.no_inventario}`}
                    </li>
                    ))}
                  </ul>
                    <button onClick={handleCloseModal} className={styles.closeButton}>Cerrar</button>
                </div>
              </div>
            )}
            {/* Input para mostrar el bien seleccionado */}
            <input
              type="text"
              className={styles.agregarBajaInput}
              value={selectedBien ? `${selectedBien.id_bien} - Inventario: ${selectedBien.no_inventario}` : 'Seleccione un Bien'}
              readOnly
              onClick={handleOpenModal}
            />
            <input
              type="text"
              placeholder="ID Usuario"
              className={styles.agregarBajaInput}
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.agregarBajaFormActions}>
          <button
            className={styles.agregarBajaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarBajaAddButton}
            onClick={handleAddOrUpdateBaja}
          >
            {editingId ? 'Guardar Cambios' : 'Agregar'}
          </button>
        </div>

        {/* Campo de búsqueda */}
        <div className={styles.agregarBajaFormActions}>
          <div className={styles.agregarBajaSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por Documento Ampara o Póliza No"
              className={styles.agregarBajaSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Búsqueda en tiempo real
            />
            <button className={styles.agregarBajaSearchButton} disabled>
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
            <h3 className={styles.tableTitle}>Lista de Bajas</h3>
            <table className={`${styles.bajaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Baja</th>
                  <th>Documento Ampara</th>
                  <th>Número de Póliza</th>
                  <th>Fecha Póliza</th>
                  <th>Bien ID</th>
                  <th>Usuario ID</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                { currentData.map((baja) => (
                  <tr key={baja.id_baja_bien}>
                    <td>{baja.id_baja_bien}</td>
                    <td>{new Date(baja.fecha_baja).toLocaleDateString()}</td>
                    <td>{baja.documento_ampare}</td>
                    <td>{baja.poliza_no}</td>
                    <td>{new Date(baja.fecha_poliza).toLocaleDateString()}</td>
                    <td>{baja.id_bien}</td>
                    <td>{baja.id_usuario}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditBaja(baja.id_baja_bien)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteBaja(baja.id_baja_bien)}
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
        className={styles.agregarBajaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}


export default AgregarBaja;
