import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axiosInstance from '../../../config/axios.config.js'; // Importa tu instancia configurada
import Swal from 'sweetalert2'; // Importar SweetAlert
import styles from './AgregarBien2.module.css';
import ListaDesplegable from '../../listaDesplegable/listaDesplegable.jsx';

function AgregarBien2({ onBack }) {
  const location = useLocation();
  const { selectedProductId, selectedProductName } = location.state || {};
  const navigate = useNavigate();

  const [costo, setCosto] = useState('');
  const [fechaAdquisicion, setFechaAdquisicion] = useState('');
  const [serie, setSerie] = useState('');
  const [estadoBien, setEstadoBien] = useState('');
  const [noInventario, setNoInventario] = useState('');
  const [codificacionObjetoGasto, setCodificacionObjetoGasto] = useState('');
  const [propuestoBaja, setPropuestoBaja] = useState('');
  const [reparacionBaja, setReparacionBaja] = useState('');
  const [motivoNoAsignado, setMotivoNoAsignado] = useState('');
  const [idTipoPosesion, setIdTipoPosesion] = useState('');
  const [idSubcuenta, setIdSubcuenta] = useState('');
  const [idPartida, setIdPartida] = useState('');
  const [idStatusBien, setIdStatusBien] = useState('');
  const [idTipoAlta, setIdTipoAlta] = useState('');
  const [idRecursoOrigen, setIdRecursoOrigen] = useState('');
  const [bienes, setBienes] = useState([]);

  const [posesiones, setPosesiones] = useState([]);
  const [subcuentas, setSubcuentas] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [statusBienes, setStatusBienes] = useState([]);
  const [tiposAlta, setTiposAlta] = useState([]);
  const [recursosOrigen, setRecursosOrigen] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedBienId, setSelectedBienId] = useState(null);
  const [originalData, setOriginalData] = useState({});

  const fetchData = async (url, setter, errorMessage) => {
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setter(response.data.data);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: response.data.message || errorMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la petición',
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchData('/tipo-posesion/get-posesiones', setPosesiones, 'No se pudieron obtener las posesiones.');
    fetchData('/subcuenta-armonizada/get-subcuentas', setSubcuentas, 'No se pudieron obtener las subcuentas.');
    fetchData('/codigo-partida-especifica/get-partidas', setPartidas, 'No se pudieron obtener las partidas específicas.');
    fetchData('/status-bien/get-status-bien', setStatusBienes, 'No se pudieron obtener los estados de bienes.');
    fetchData('/tipo-alta/get-tipos-alta', setTiposAlta, 'No se pudieron obtener los tipos de alta.');
    fetchData('/recurso-origen/get-recursos-origen', setRecursosOrigen, 'No se pudieron obtener los recursos de origen.');
  }, []);
  // Función para obtener los bienes existentes
  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await axiosInstance.get('/bien/get-bienes');
        if (response.data.success) {
          setBienes(response.data.data); // Almacena los bienes obtenidos
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: response.data.message || 'No se pudieron obtener los bienes existentes.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error en la petición',
          text: 'No se pudieron obtener los bienes existentes.',
        });
      }
    };

    fetchBienes(); // Llama a la función cuando el componente se monta
  }, []);

  // Función para agregar un nuevo bien
  const handleAddBien = async () => {
    if (!costo.trim() || !fechaAdquisicion || !serie.trim() || !estadoBien.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Favor de llenar todos los campos obligatorios.',
      });
      return;
    }

    const body = {
      costo,
      fecha_adquisicion: new Date(fechaAdquisicion).toISOString(),
      serie,
      estado_bien: estadoBien,
      no_inventario: noInventario,
      codificacion_objeto_gasto: codificacionObjetoGasto,
      propuesto_baja: propuestoBaja,
      reparacion_baja: reparacionBaja,
      motivo_no_asignado: motivoNoAsignado,
      id_producto: selectedProductId,
      id_tipo_posesion: Number(idTipoPosesion) || null,
      id_subcuenta: Number(idSubcuenta) || null,
      id_partida: Number(idPartida) || null,
      id_status_bien: Number(idStatusBien) || null,
      id_tipo_alta: Number(idTipoAlta) || null,
      id_recurso_origen: Number(idRecursoOrigen) || null,
    };

    try {
      setIsLoading(true);

      const response = await axiosInstance.post('/bien/create-bien', body);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Bien agregado!',
          text: 'El bien se ha agregado exitosamente.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Limpiar campos
        setCosto('');
        setFechaAdquisicion('');
        setSerie('');
        setEstadoBien('');
        setNoInventario('');
        setCodificacionObjetoGasto('');
        setPropuestoBaja('');
        setReparacionBaja('');
        setMotivoNoAsignado('');
        setIdTipoPosesion('');
        setIdSubcuenta('');
        setIdPartida('');
        setIdStatusBien('');
        setIdTipoAlta('');
        setIdRecursoOrigen('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el bien.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: error.message || 'Ocurrió un error al intentar agregar el bien.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para activar el modo de edición y obtener los datos del bien
  const handleEditBien = async (id) => {
    try {
      const response = await axiosInstance.get(`/bien/get-bien/${id}`);
      if (response.data.success) {
        const bienData = response.data.data;

        // Convertir fecha a formato compatible con input type="date"
        const formattedDate = bienData.fecha_adquisicion
          ? new Date(bienData.fecha_adquisicion).toISOString().split('T')[0]
          : '';

        // Rellenar el formulario con los datos obtenidos
        setCosto(bienData.costo || '');
        setFechaAdquisicion(formattedDate);
        setSerie(bienData.serie || '');
        setEstadoBien(bienData.estado_bien || '');
        setNoInventario(bienData.no_inventario || '');
        setCodificacionObjetoGasto(bienData.codificacion_objeto_gasto || '');
        setPropuestoBaja(bienData.propuesto_baja || '');
        setReparacionBaja(bienData.reparacion_baja || '');
        setMotivoNoAsignado(bienData.motivo_no_asignado || '');
        setIdTipoPosesion(bienData.id_tipo_posesion || '');
        setIdSubcuenta(bienData.id_subcuenta || '');
        setIdPartida(bienData.id_partida || '');
        setIdStatusBien(bienData.id_status_bien || '');
        setIdTipoAlta(bienData.id_tipo_alta || '');
        setIdRecursoOrigen(bienData.id_recurso_origen || '');

        setOriginalData(bienData); // Guardar los datos originales
        setEditMode(true); // Activar el modo edición
        setSelectedBienId(id); // Guardar el ID del bien en edición
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudieron obtener los datos del bien.',
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

  // Función para guardar cambios al editar un bien
    // Función para guardar cambios al editar un bien
    const handleUpdateBien = async () => {
      const body = {
        costo,
        fecha_adquisicion: new Date(fechaAdquisicion).toISOString(),
        serie,
        estado_bien: estadoBien,
        no_inventario: noInventario,
        codificacion_objeto_gasto: codificacionObjetoGasto,
        propuesto_baja: propuestoBaja,
        reparacion_baja: reparacionBaja,
        motivo_no_asignado: motivoNoAsignado,
        id_producto: selectedProductId,
        id_tipo_posesion: Number(idTipoPosesion) || null,
        id_subcuenta: Number(idSubcuenta) || null,
        id_partida: Number(idPartida) || null,
        id_status_bien: Number(idStatusBien) || null,
        id_tipo_alta: Number(idTipoAlta) || null,
        id_recurso_origen: Number(idRecursoOrigen) || null,
      };
  
      const changes = Object.entries(body)
        .filter(([key, value]) => value !== originalData[key])
        .map(([key, value]) => {
          const previousValue = originalData[key] || 'Sin valor';
          return `<p><b>${key}:</b> ${previousValue} → ${value}</p>`;
        })
        .join('');
  
      // Mostrar un SweetAlert con los cambios
      Swal.fire({
        title: 'Cambios detectados',
        html: changes.length > 0 ? changes : 'No se detectaron cambios.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Enviar datos al servidor si se confirma
          try {
            const response = await axiosInstance.put(`/bien/update-bien/${selectedBienId}`, body);
            if (response.data.success) {
              Swal.fire({
                icon: 'success',
                title: 'Cambios guardados',
                text: 'El bien se ha actualizado exitosamente.',
                timer: 2000,
                showConfirmButton: false,
              });
  
              // Actualizar lista de bienes (opcional)
              const updatedBienes = bienes.map((bien) =>
                bien.id_bien === selectedBienId ? { ...bien, ...body } : bien
              );
              setBienes(updatedBienes);
  
              // Limpiar formulario y desactivar modo edición
              setEditMode(false);
              setSelectedBienId(null);
              setCosto('');
              setFechaAdquisicion('');
              setSerie('');
              setEstadoBien('');
              setNoInventario('');
              setCodificacionObjetoGasto('');
              setPropuestoBaja('');
              setReparacionBaja('');
              setMotivoNoAsignado('');
              setIdTipoPosesion('');
              setIdSubcuenta('');
              setIdPartida('');
              setIdStatusBien('');
              setIdTipoAlta('');
              setIdRecursoOrigen('');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data.message || 'No se pudo actualizar el bien.',
              });
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error en el servidor',
              text: error.message || 'Ocurrió un error al intentar actualizar el bien.',
            });
          }
        }
      });
    };

    // Función para eliminar un bien
const handleDeleteBien = async (id) => {
  Swal.fire({
    title: '¿Está seguro?',
    text: 'Esta acción eliminará el bien permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/api/bien/delete-bien/${id}`);

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Bien eliminado',
            text: 'El bien se ha eliminado exitosamente.',
            timer: 2000,
            showConfirmButton: false,
          });

          // Actualizar la lista de bienes
          setBienes(bienes.filter((bien) => bien.id_bien !== id));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'No se pudo eliminar el bien.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.message || 'Ocurrió un error al intentar eliminar el bien.',
        });
      }
    }
  });
};
  
  return (
    <div className={styles.agregarBien2Container}>
      <ListaDesplegable />
      <main className={styles.agregarBien2MainContent}>
        <h2 className={styles.agregarBien2Title}>
          {editMode ? 'Editar Bien' : 'Agregar Bien'}
        </h2>

        {/* Mostrar el nombre del producto seleccionado (opcional) */}
        <p style={{ fontWeight: 'bold' }}>
          Producto seleccionado: {selectedProductName || 'N/A'}
        </p>

        <div className={styles.agregarBien2FormContainer}>
          <input
            type="text"
            placeholder="Producto (ID)"
            className={styles.agregarBien2Input2}
            value={selectedProductId || ''}
            readOnly
          />

          <div className={styles.agregarBien2FormRow}>
            <input
              type="text"
              placeholder="Costo"
              className={styles.agregarBien2Input}
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
            />
            <input
              type="date"
              placeholder="Fecha de adquisición"
              className={styles.agregarBien2Input}
              value={fechaAdquisicion}
              onChange={(e) => setFechaAdquisicion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Serie"
              className={styles.agregarBien2Input}
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
            />
          </div>

          <div className={styles.agregarBien2FormRow}>
            <select
              className={styles.agregarBien2Input}
              value={estadoBien}
              onChange={(e) => setEstadoBien(e.target.value)}
            >
              <option value="">Estado del bien</option>
              <option value="Asignado">Asignado</option>
              <option value="Extraviado">Extraviado</option>
              <option value="Reasignado">Reasignado</option>
              <option value="Dado de baja">Dado de baja</option>
            </select>
            <input
              type="text"
              placeholder="No. de inventario"
              className={styles.agregarBien2Input}
              value={noInventario}
              onChange={(e) => setNoInventario(e.target.value)}
            />
            <input
              type="text"
              placeholder="Codificación de Objeto Gasto"
              className={styles.agregarBien2Input}
              value={codificacionObjetoGasto}
              onChange={(e) => setCodificacionObjetoGasto(e.target.value)}
            />
            <select
              className={styles.agregarBien2Select}
              value={propuestoBaja}
              onChange={(e) => setPropuestoBaja(e.target.value)}
            >
              <option value="">Propuesto para Baja</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className={styles.agregarBien2FormRow}>
            <select
              className={styles.agregarBien2Select}
              value={reparacionBaja}
              onChange={(e) => setReparacionBaja(e.target.value)}
            >
              <option value="">Reparación o Baja</option>
              <option value="Reparacion">Reparación</option>
              <option value="Baja">Baja</option>
            </select>
            <input
              type="text"
              placeholder="Motivo no asignado"
              className={styles.agregarBien2Input}
              value={motivoNoAsignado}
              onChange={(e) => setMotivoNoAsignado(e.target.value)}
            />
            <select
              className={styles.agregarBien2Select}
              value={idTipoPosesion}
              onChange={(e) => setIdTipoPosesion(e.target.value)}
            >
              <option value="">Tipo de Posesión (ID)</option>
              {posesiones.map((pos) => (
                <option key={pos.id_tipo_posesion} value={pos.id_tipo_posesion}>
                  {pos.id_tipo_posesion} - {pos.descripcion_posesion}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.agregarBien2FormRow}>
            <select
              className={styles.agregarBien2Select}
              value={idSubcuenta}
              onChange={(e) => setIdSubcuenta(e.target.value)}
            >
              <option value="">Subcuenta Armonizada (ID)</option>
              {subcuentas.map((sub) => (
                <option key={sub.id_subcuenta} value={sub.id_subcuenta}>
                  {sub.id_subcuenta} - {sub.nombre_subcuenta}
                </option>
              ))}
            </select>
            <select
              className={styles.agregarBien2Select}
              value={idPartida}
              onChange={(e) => setIdPartida(e.target.value)}
            >
              <option value="">Código de Partida Específica (ID)</option>
              {partidas.map((partida) => (
                <option key={partida.id_partida} value={partida.id_partida}>
                  {partida.id_partida} - {partida.codigo_partida} - {partida.nombre_partida}
                </option>
              ))}
            </select>
            <select
              className={styles.agregarBien2Select}
              value={idStatusBien}
              onChange={(e) => setIdStatusBien(e.target.value)}
            >
              <option value="">Status del Bien (ID)</option>
              {statusBienes.map((status) => (
                <option key={status.id_status_bien} value={status.id_status_bien}>
                  {status.id_status_bien} - {status.descripcion_status}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.agregarBien2FormRow}>
            <select
              className={styles.agregarBien2Select}
              value={idTipoAlta}
              onChange={(e) => setIdTipoAlta(e.target.value)}
            >
              <option value="">Tipo de Alta (ID)</option>
              {tiposAlta.map((tipo) => (
                <option key={tipo.id_tipo_alta} value={tipo.id_tipo_alta}>
                  {tipo.id_tipo_alta} - {tipo.descripcion_alta}
                </option>
              ))}
            </select>
            <select
              className={styles.agregarBien2Select}
              value={idRecursoOrigen}
              onChange={(e) => setIdRecursoOrigen(e.target.value)}
            >
              <option value="">Seleccione Recurso de Origen</option>
              {recursosOrigen.map((recurso) => (
                <option key={recurso.id_recurso_origen} value={recurso.id_recurso_origen}>
                  {recurso.id_recurso_origen} - {recurso.descripcion_recurso}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className={styles.agregarBien2FormActions}>
          <button
            className={styles.agregarBien2BackButtonAction}
            onClick={() => navigate('/agregar-bien')}
          >
            Atrás
          </button>
          {isLoading ? (
            <div className={styles.spinnerContainer}>
              <TailSpin height="40" width="40" color="red" ariaLabel="loading" />
            </div>
          ) : (
            <button
              className={styles.agregarBien2AddButton}
              onClick={editMode ? handleUpdateBien : handleAddBien}
            >
              {editMode ? 'Guardar Cambios' : 'Agregar'}
            </button>
          )}
        </div>

        {/* Tabla de bienes */}
        <div className={styles.agregarBienTableContainer}>
          <h3 className={styles.tableTitle}>Bienes Existentes</h3>
          <table className={styles.bienTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Costo</th>
                <th>Fecha Adquisición</th>
                <th>Serie</th>
                <th>Estado</th>
                <th>No. Inventario</th>
                <th>Codificación Objeto Gasto</th>
                <th>Propuesto Baja</th>
                <th>Reparación Baja</th>
                <th>Motivo No Asignado</th>
                <th>Producto</th>
                <th>Tipo de Posesión</th>
                <th>Subcuenta Armonizada</th>
                <th>Partida Específica</th>
                <th>Estado del Bien</th>
                <th>Tipo de Alta</th>
                <th>Recurso de Origen</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {bienes.map((bien) => (
                <tr key={bien.id_bien}>
                  <td>{bien.id_bien}</td>
                  <td>{bien.costo}</td>
                  <td>{bien.fecha_adquisicion}</td>
                  <td>{bien.serie}</td>
                  <td>{bien.estado_bien}</td>
                  <td>{bien.no_inventario}</td>
                  <td>{bien.codificacion_objeto_gasto}</td>
                  <td>{bien.propuesto_baja}</td>
                  <td>{bien.reparacion_baja}</td>
                  <td>{bien.motivo_no_asignado}</td>
                  <td>{bien.producto.nombre_producto}</td>
                  <td>{bien.tipoposesion.descripcion_posesion}</td>
                  <td>{bien.subcuentaarmonizada.nombre_subcuenta}</td>
                  <td>{bien.codigopartidaespecifica.nombre_partida}</td>
                  <td>{bien.statusbien.descripcion_status}</td>
                  <td>{bien.tipoalta.descripcion_alta}</td>
                  <td>{bien.recursoorigen.descripcion_recurso}</td>
                  <td>
                    <div className={styles.buttonGroup}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditBien(bien.id_bien)}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteBien(bien.id_bien)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Botón para ir al Home (opcional) */}
      <button
        className={styles.agregarBien2HomeButton}
        onClick={() => navigate('/')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarBien2;
