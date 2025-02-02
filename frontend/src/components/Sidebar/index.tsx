import styles from "./Sidebar.module.css"
import { FaHeartPulse } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa6";
import { FaCircleDot } from "react-icons/fa6";

interface SidebarProps {
  onSelectPatient: (name: string) => void;
  selectedPatient: string
}

const Sidebar = ({ onSelectPatient, selectedPatient }: SidebarProps) => {

  return (
    <div className={styles.sidebar_container}>
      <div className={styles.side_title}>
        <h1>Meus pacientes</h1>
      </div>
      <ul className={styles.list_container}>
        <li>
          <button onClick={() => onSelectPatient("joao")}><FaHeartPulse /> João {selectedPatient === "joao" ? <FaCircleDot /> : <FaCircle />}</button>
        </li>
        <li>
          <button onClick={() => onSelectPatient("maria")}><FaHeartPulse /> Maria {selectedPatient === "maria" ? <FaCircleDot /> : <FaCircle />}</button>
        </li>
        <li>
          <button onClick={() => onSelectPatient("roberto")}><FaHeartPulse /> Roberto {selectedPatient === "roberto" ? <FaCircleDot /> : <FaCircle />}</button>
        </li>
        <li>
          <button onClick={() => onSelectPatient("giovana")}><FaHeartPulse /> Giovana {selectedPatient === "giovana" ? <FaCircleDot /> : <FaCircle />}</button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
