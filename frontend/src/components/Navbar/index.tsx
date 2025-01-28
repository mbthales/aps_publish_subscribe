import styles from "./Navbar.module.css"
import Logo from "../../assets/imgs/logo.png"
import { FaPerson } from "react-icons/fa6";

interface NavbarProps {
  handleSideBarVisibility: VoidFunction;
}

const Navbar = ({handleSideBarVisibility}: NavbarProps) => {

  return (
    <nav>
      <div className={styles.navbar_container}>
        <div className={styles.main_container}>
            <div className={styles.image_container}>
                <img src={Logo} alt="" />
            </div>

            <div className={styles.name_container}>
                <h1>Olá, Daniel</h1>
                <h2>Bem-vindo!</h2>
            </div>
        </div>
        
        <div>
            <button onClick={handleSideBarVisibility}><FaPerson />Pacientes</button>
        </div>

        <div className={styles.profile_container}>
            <h1>D</h1>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
