import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Importa tu archivo de configuración
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2';
import styles from './AgregarUsuario.module.css';

function AgregarUsuario() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Lista de empleados
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  // Estado del formulario
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    id_empleado: '', // ID del empleado seleccionado
    id_rol: '',
  });
  

  // Obtener usuarios y empleados desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosResponse = await axiosInstance.get('/usuario/get-usuarios');
        if (usuariosResponse.data.success) {
          setUsuarios(usuariosResponse.data.data);
        }

        const empleadosResponse = await axiosInstance.get('/empleado/get-empleados');
        if (empleadosResponse.data.success) {
          setEmpleados(empleadosResponse.data.data); // Guardar empleados
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchData();
  }, []);

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'id_empleado' || name === 'id_rol' ? Number(value) : value,
    });
  };
  
  // Enviar el formulario
  const handleAddUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/usuario/create-usuario', formData);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario agregado',
          text: 'El usuario se ha agregado exitosamente.',
        });
        setUsuarios([...usuarios, response.data.data]); // Agregar el nuevo usuario a la lista
        setFormData({
          usuario: '',
          contrasena: '',
          id_empleado: '',
          id_rol: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el usuario.',
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

 // Eliminar un usuario
 const handleDeleteUsuario = async (id) => {
  Swal.fire({
    title: '¿Está seguro?',
    text: 'Esta acción eliminará el usuario permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/usuario/delete-usuario/${id}`);
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'El usuario se ha eliminado exitosamente.',
            timer: 2000,
            showConfirmButton: false,
          });
          setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id_usuario !== id));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'No se pudo eliminar el usuario.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.message || 'Ocurrió un error al intentar eliminar el usuario.',
        });
      }
    }
  });
};

// Editar un usuario
const handleEditUsuario = (id) => {
  const usuario = usuarios.find((usuario) => usuario.id_usuario === id);
  if (usuario) {
    setFormData({
      usuario: usuario.usuario,
      contrasena: '', // No se carga la contraseña por seguridad
      id_empleado: usuario.id_empleado,
      id_rol: usuario.id_rol,
    });
    setEditingId(id);
  }
};

// Guardar cambios al editar un usuario
const handleSaveChanges = async () => {
  if (!formData.usuario.trim() || !formData.id_empleado || !formData.id_rol) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos obligatorios.',
    });
    return;
  }

  // Buscar el usuario original antes de los cambios
  const originalUsuario = usuarios.find((usuario) => usuario.id_usuario === editingId);
  const changes = Object.entries(formData)
    .filter(([key, value]) => value !== originalUsuario[key])
    .map(([key, value]) => `<b>${key}:</b> ${originalUsuario[key] || 'N/A'} → ${value}`)
    .join('<br>');

  if (!changes) {
    Swal.fire({
      icon: 'info',
      title: 'Sin cambios',
      text: 'No se detectaron cambios para guardar.',
    });
    return;
  }

  // Confirmar cambios antes de guardarlos
  const result = await Swal.fire({
    title: 'Confirmar cambios',
    html: changes,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
  });

  if (!result.isConfirmed) return;

  try {
    const response = await axiosInstance.put(`/usuario/update-usuario/${editingId}`, formData);
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'El usuario se actualizó exitosamente.',
      });

      // Actualizar la lista de usuarios
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === editingId ? { ...usuario, ...formData } : usuario
        )
      );

      setFormData({ usuario: '', contrasena: '', id_empleado: '', id_rol: '' });
      setEditingId(null);
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
      text: error.message || 'Ocurrió un error al intentar actualizar el usuario.',
    });
  }
};

  return (
    <div className={styles.agregarUsuarioContainer}>
      <main className={`${styles.agregarUsuarioMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarUsuarioTitle}>
          {editingId ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form className={styles.agregarUsuarioFormContainer} onSubmit={handleAddUsuario}>
          <div className={styles.agregarUsuarioFormRow}>
            <input
              type="text"
              name="usuario"
              placeholder="Nombre de Usuario"
              className={styles.agregarUsuarioInput}
              value={formData.usuario}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              className={styles.agregarUsuarioInput}
              value={formData.contrasena}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.agregarUsuarioFormRow}>
            <select
              name="id_empleado"
              className={styles.agregarUsuarioSelect}
              value={formData.id_empleado}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione Empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.nombre_empleado}
                </option>
              ))}
            </select>
            <select
              name="id_rol"
              className={styles.agregarUsuarioSelect}
              value={formData.id_rol}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione Rol</option>
              <option value="1">Admin</option>
              <option value="2">Usuario</option>
            </select>
          </div>
          <div className={styles.agregarUsuarioFormActions}>
            <button
              type="button"
              className={styles.agregarUsuarioBackButtonAction}
              onClick={() => navigate(-1)}
            >
              Atrás
            </button>
            {editingId ? (
            <button className={styles.agregarUsuarioSaveButton} onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          ) : (
            <button className={styles.agregarUsuarioAddButton} onClick={handleAddUsuario}>
              Agregar
            </button>
          )}
          </div>
        </form>

        {/* Spinner o tabla de usuarios */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Usuarios</h3>
            <table className={`${styles.usuarioTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>ID Empleado</th>
                  <th>Rol</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.usuario}</td>
                    <td>******</td>
                    <td>{usuario.id_empleado}</td>
                    <td>{usuario.id_rol}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditUsuario(usuario.id_usuario)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteUsuario(usuario.id_usuario)}
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
      <button className={styles.agregarUsuarioHomeButton} onClick={() => navigate('/')}>
        🏠
      </button>
    </div>
  );
}

export default AgregarUsuario;
