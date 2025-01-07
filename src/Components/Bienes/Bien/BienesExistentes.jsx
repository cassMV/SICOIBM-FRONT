import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import axiosInstance from '../../../config/axios.config'; // Instancia personalizada
import styles from './BienesExistentes.module.css';

const BienesExistentes = () => {
  const navigate = useNavigate();

  // Estados principales
  const [bienes, setBienes] = useState([]);
  const [filteredBienes, setFilteredBienes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para almacenar la información de cada entidad
  const [productos, setProductos] = useState({});
  const [posesiones, setPosesiones] = useState({});
  const [subcuentas, setSubcuentas] = useState({});
  const [partidas, setPartidas] = useState({});
  const [statusBien, setStatusBien] = useState({});
  const [tiposAlta, setTiposAlta] = useState({});
  const [recursosOrigen, setRecursosOrigen] = useState({});

  // 1) Petición para obtener los bienes
  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await axiosInstance.get('/bien/get-bienes');
        if (response.data.success) {
          setBienes(response.data.data);
          setFilteredBienes(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los bienes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBienes();
  }, []);

  // 2) Petición para obtener la información de los productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const uniqueProductIds = [...new Set(bienes.map((bien) => bien.id_producto))];
        if (uniqueProductIds.length === 0) return;

        const productRequests = uniqueProductIds.map(async (id) => {
          try {
            const res = await axiosInstance.get(`/producto/get-producto/${id}`);
            return res.data.data;
          } catch (error) {
            console.error(`Error al obtener producto con id ${id}:`, error);
            return null;
          }
        });

        const productosData = await Promise.all(productRequests);
        const productosDict = {};

        productosData.forEach((prod) => {
          if (prod && prod.id_producto) {
            productosDict[prod.id_producto] = prod;
          }
        });

        setProductos(productosDict);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    if (bienes.length > 0) {
      fetchProductos();
    }
  }, [bienes]);

  // 3) Petición para obtener la información de los tipos de posesión
  useEffect(() => {
    const fetchPosesiones = async () => {
      try {
        const uniquePosesionIds = [...new Set(bienes.map((bien) => bien.id_tipo_posesion))];
        if (uniquePosesionIds.length === 0) return;

        const posesionRequests = uniquePosesionIds.map(async (id) => {
          try {
            const res = await axiosInstance.get(`/tipo-posesion/get-posesion/${id}`);
            return res.data.data;
          } catch (error) {
            console.error(`Error al obtener tipo de posesión con id ${id}:`, error);
            return null;
          }
        });

        const posesionesData = await Promise.all(posesionRequests);
        const posesionesDict = {};

        posesionesData.forEach((pos) => {
          if (pos && pos.id_tipo_posesion) {
            posesionesDict[pos.id_tipo_posesion] = pos;
          }
        });

        setPosesiones(posesionesDict);
      } catch (error) {
        console.error('Error al obtener los tipos de posesión:', error);
      }
    };

    if (bienes.length > 0) {
      fetchPosesiones();
    }
  }, [bienes]);

  // 4) Petición para obtener la información de las subcuentas
  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const uniqueSubcuentaIds = [...new Set(bienes.map((bien) => bien.id_subcuenta))];
        if (uniqueSubcuentaIds.length === 0) return;

        const subcuentaRequests = uniqueSubcuentaIds.map(async (id) => {
          try {
            const res = await axiosInstance.get(`/subcuenta-armonizada/get-subcuenta/${id}`);
            return res.data.data;
          } catch (error) {
            console.error(`Error al obtener la subcuenta con id ${id}:`, error);
            return null;
          }
        });

        const subcuentasData = await Promise.all(subcuentaRequests);
        const subcuentasDict = {};

        subcuentasData.forEach((sub) => {
          if (sub && sub.id_subcuenta) {
            subcuentasDict[sub.id_subcuenta] = sub;
          }
        });

        setSubcuentas(subcuentasDict);
      } catch (error) {
        console.error('Error al obtener las subcuentas:', error);
      }
    };

    if (bienes.length > 0) {
      fetchSubcuentas();
    }
  }, [bienes]);

  // Función para manejar la búsqueda
  const handleSearch = () => {
    const results = bienes.filter(
      (bien) =>
        bien.serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.no_inventario?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No encontrado',
        text: 'No se encontró ningún bien con ese número de inventario o serie.',
      });
    }

    setFilteredBienes(results.length > 0 ? results : bienes);
  };

  return (
    <div className={styles.bienesExistentesContainer}>
      <main className={`${styles.bienesExistentesMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.bienesExistentesTitle}>Bienes Existentes</h2>

        <div className={styles.bienesExistentesSearchContainer}>
          <input
            type="text"
            placeholder="Número de inventario o serie"
            className={styles.bienesExistentesSearchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.bienesExistentesSearchButton} onClick={handleSearch}>
            🔍
          </button>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Bienes</h3>
            <table className={`${styles.bienesExistentesTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Costo</th>
                  <th>Fecha Adquisición</th>
                  <th>Serie</th>
                  <th>Estado</th>
                  <th>No. Inventario</th>
                  <th>Producto</th>
                  <th>Tipo de Posesión</th>
                  <th>Subcuenta</th>
                </tr>
              </thead>
              <tbody>
                {filteredBienes.map((bien) => (
                  <tr key={bien.id_bien}>
                    <td>{bien.id_bien}</td>
                    <td>{bien.costo}</td>
                    <td>{bien.fecha_adquisicion}</td>
                    <td>{bien.serie}</td>
                    <td>{bien.estado_bien}</td>
                    <td>{bien.no_inventario}</td>
                    <td>{productos[bien.id_producto]?.nombre_producto || 'Cargando...'}</td>
                    <td>
                      {posesiones[bien.id_tipo_posesion]?.descripcion_posesion || 'Cargando...'}
                    </td>
                    <td>{subcuentas[bien.id_subcuenta]?.nombre_subcuenta || 'Cargando...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button
          className={styles.bienesExistentesHomeButton}
          onClick={() => navigate('/menu')}
        >
          🏠
        </button>
      </main>
    </div>
  );
};

export default BienesExistentes;
