import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Spinner para animación de carga
import Swal from "sweetalert2"; // Notificaciones
import styles from "./AgregarProducto.module.css";

const AgregarProducto = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]); // Estado para las marcas
  const [isLoading, setIsLoading] = useState(true);
  const [editingProducto, setEditingProducto] = useState(null); // Estado para modo edición
  const [originalData, setOriginalData] = useState({}); // Almacena los datos originales del producto editado

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_producto: "",
    modelo: "",
    ruta_imagen: "",
    caracteristicas: "",
    id_marca: "", // Para manejar el select de marcas
  });

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/producto/get-productos`
        );
        if (response.data.success) {
          setProductos(response.data.data);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Obtener marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/marca/get-marcas`
        );
        if (response.data.success) {
          setMarcas(response.data.data);
        } else {
          console.error("Error al obtener las marcas:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener las marcas:", error);
      }
    };

    fetchMarcas();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "id_marca" ? Number(value) : value, // Convierte id_marca a número
    });
  };

  // Función para enviar los datos del formulario (Agregar Producto)
  const handleAddProducto = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/producto/create-producto`,
        formData
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          text: "El producto se ha agregado exitosamente.",
        });
        setProductos([...productos, response.data.data]); // Actualiza la tabla
        setFormData({
          nombre_producto: "",
          modelo: "",
          ruta_imagen: "",
          caracteristicas: "",
          id_marca: "",
        }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudo agregar el producto.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message || "Error desconocido.",
      });
    }
  };

  // Función para cargar datos de producto en formulario para edición
  const handleEditProducto = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/producto/get-producto/${id}`
      );
      if (response.data.success) {
        const producto = response.data.data;
        setFormData({
          nombre_producto: producto.nombre_producto,
          modelo: producto.modelo,
          ruta_imagen: producto.ruta_imagen,
          caracteristicas: producto.caracteristicas,
          id_marca: producto.id_marca,
        });
        setOriginalData({
          nombre_producto: producto.nombre_producto,
          modelo: producto.modelo,
          ruta_imagen: producto.ruta_imagen,
          caracteristicas: producto.caracteristicas,
          id_marca: producto.id_marca,
        }); // Guarda los datos originales
        setEditingProducto(id);
      } else {
        console.error("Error al cargar producto:", response.data.message);
      }
    } catch (error) {
      console.error("Error al cargar producto:", error);
    }
  };

  // Función para guardar cambios de un producto editado
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/producto/update-producto/${editingProducto}`,
        formData
      );

      if (response.data.success) {
        // Obtener nombre de la marca actualizada
        const marcaResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/marca/get-marca/${formData.id_marca}`
        );
        const nombreMarca = marcaResponse.data.data.nombre_marca;

        const changes = Object.entries(formData)
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => {
            const displayValue =
              key === "id_marca" ? `${originalData[key]} → ${nombreMarca}` : `${originalData[key]} → ${value}`;
            return `<p><b>${key}:</b> ${displayValue}</p>`;
          })
          .join('');

        Swal.fire({
          title: "Confirmar Cambios",
          html: changes.length > 0 ? changes : '<p>No hay cambios realizados.</p>',
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "Cambios guardados",
              text: "El producto se actualizó exitosamente.",
            });

            // Actualiza la lista de productos
            setProductos((prev) =>
              prev.map((producto) =>
                producto.id_producto === editingProducto
                  ? { ...producto, ...formData }
                  : producto
              )
            );

            // Restablecer el formulario
            setFormData({
              nombre_producto: "",
              modelo: "",
              ruta_imagen: "",
              caracteristicas: "",
              id_marca: "",
            });
            setEditingProducto(null);
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudieron guardar los cambios.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message || "Error desconocido.",
      });
    }
  };

  // Función para eliminar un producto con confirmación
  const handleDeleteProducto = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el producto permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/producto/delete-producto/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Producto eliminado',
              text: 'El producto se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de productos
            setProductos(productos.filter((producto) => producto.id_producto !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el producto.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message || 'Ocurrió un error al intentar eliminar el producto.',
          });
        }
      }
    });
  };

  return (
    <div className={styles.agregarProductoContainer}>
      <main className={`${styles.agregarProductoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarProductoTitle}>
          {editingProducto ? "Editar Producto" : "Agregar Producto"}
        </h2>
        <div className={styles.agregarProductoFormContainer}>
          <div className={styles.agregarProductoFormRow}>
            <input
              type="text"
              placeholder="Nombre del producto"
              className={styles.agregarProductoInput}
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Modelo"
              className={styles.agregarProductoInput}
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Ruta imagen"
              className={styles.agregarProductoInput}
              name="ruta_imagen"
              value={formData.ruta_imagen}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarProductoFormRow}>
            <input
              type="text"
              placeholder="Características"
              className={              styles.agregarProductoInput
              }
              name="caracteristicas"
              value={formData.caracteristicas}
              onChange={handleInputChange}
            />
            {/* Select para las marcas */}
            <select
              name="id_marca"
              className={styles.agregarProductoSelect}
              value={formData.id_marca}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.nombre_marca}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.agregarProductoFormActions}>
          <button
            className={styles.agregarProductoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingProducto ? (
            <button
              className={styles.agregarProductoAddButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarProductoAddButton}
              onClick={handleAddProducto}
            >
              Agregar
            </button>
          )}
        </div>

        {/* Spinner o tabla de productos */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Productos</h3>
            <table className={`${styles.productoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Modelo</th>
                  <th>Ruta Imagen</th>
                  <th>Características</th>
                  <th>Marca</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.id_producto}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.modelo}</td>
                    <td>{producto.ruta_imagen}</td>
                    <td>{producto.caracteristicas}</td>
                    <td>{marcas.find((marca) => marca.id_marca === producto.id_marca)?.nombre_marca || "Sin marca"}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditProducto(producto.id_producto)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteProducto(producto.id_producto)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default AgregarProducto;

