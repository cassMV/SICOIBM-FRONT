import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axiosInstance from '../../../config/axios.config'; // Importa la instancia configurada de Axios
import Swal from 'sweetalert2';
import styles from './AgregarBien.module.css';
import ListaDesplegable from '../../listaDesplegable/listaDesplegable.jsx';

function AgregarBien() {
  const navigate = useNavigate();

  // Lista completa de productos
  const [products, setProducts] = useState([]);

  // Lista de productos que se mostrarán (puede estar filtrada)
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para controlar el término de búsqueda (marca o modelo)
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el producto seleccionado (guardamos ID y nombre)
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    name: '',
  });

  // Estado para mostrar el spinner de carga
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para hacer la petición a la API al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/producto/get-productos');
        if (response.data.success) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data); // Inicialmente mostramos todos
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Función para filtrar la lista de productos por marca o modelo
  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter((prod) => {
      const brand = prod.marca?.nombre_marca?.toLowerCase() || '';
      const model = prod.modelo?.toLowerCase() || '';
      return brand.includes(term) || model.includes(term);
    });
    setFilteredProducts(filtered);
  };

  // Función para asignar el producto seleccionado (ID y nombre)
  const handleSelectProduct = (prod) => {
    setSelectedProduct({
      id: prod.id_producto,
      name: prod.nombre_producto,
    });
  };

  // Función para ir a AgregarBien2
  const handleNext = () => {
    if (!selectedProduct.id) {
      // Alertar si no se seleccionó ningún producto
      Swal.fire({
        icon: 'warning',
        title: 'No has seleccionado un producto',
        text: 'Por favor selecciona un producto antes de continuar.',
      });
      return;
    }

    // Navegamos a AgregarBien2 pasando ID y nombre del producto
    navigate('/agregar-bien-2', {
      state: {
        selectedProductId: selectedProduct.id,
        selectedProductName: selectedProduct.name,
      },
    });
  };

  return (
    <div className={styles.agregarBienContainer}>
      <ListaDesplegable />
      <main className={`${styles.agregarBienMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarBienTitle}>Agregar Bien</h2>

        {/* Barra de búsqueda por marca o modelo */}
        <div className={styles.agregarBienSearchContainer}>
          <input
            type="text"
            placeholder="Buscar por marca o modelo"
            className={styles.agregarBienSearchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className={styles.agregarBienSearchButton}
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            {/* Tabla con la lista de productos filtrados */}
            <h3 className={styles.tableTitle}>Lista de Productos</h3>
            <table className={`${styles.bienTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID Producto</th>
                  <th>Nombre Producto</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id_producto}>
                    <td>{prod.id_producto}</td>
                    <td>{prod.nombre_producto}</td>
                    <td>{prod.marca ? prod.marca.nombre_marca : 'N/A'}</td>
                    <td>{prod.modelo}</td>
                    <td>
                      <button
                        className={styles.selectButton}
                        onClick={() => handleSelectProduct(prod)}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mostrar el producto seleccionado */}
            <div className={styles.selectedProductContainer}>
              <label>Producto seleccionado:</label>
              <input
                type="text"
                placeholder="Nombre del Producto"
                className={styles.agregarBienSearchInput}
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                style={{ marginTop: '8px' }}
              />
            </div>

            <div className={styles.agregarBienFormActions}>
              <button
                className={styles.agregarBienBackButtonAction}
                onClick={() => navigate('/')} // Ajusta la ruta si lo deseas
              >
                Atrás
              </button>
              <button
                className={styles.agregarBienNextButton}
                onClick={handleNext}
              >
                Siguiente
              </button>
              <button
                className={styles.agregarBienNext2Button}
                onClick={() => navigate('/agregar-bien-2')}
              >
                Solo ver bienes
              </button>
            </div>
          </>
        )}
      </main>

      {/* Botón para navegar al menú principal */}
      <button
        className={styles.agregarBienHomeButton}
        onClick={() => navigate('/')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarBien;
