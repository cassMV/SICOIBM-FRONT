import Logo from '../imagenes/logo.jpeg';
import Logo2 from '../imagenes/Usuario.PNG';
import styles from './navbar.module.css'; // Importa los estilos como un objeto

const Navbar = () => {
  return (
    <div >
      <header className={styles.header}>
        <img src={Logo} alt="Hidalgo Logo" className={styles.logo} />
        <div className={styles['user-icon']}>
          <img src={Logo2} alt="User Icon" />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
