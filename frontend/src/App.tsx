import { useState } from 'react'
import styles from './App.module.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Modal from './components/Modal'

const App = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const handleSideBarVisibility = () => {
    setIsSideBarOpen((prevState) => !prevState);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar handleSideBarVisibility={handleSideBarVisibility}  />
      <Home sideBarVisibility={isSideBarOpen} />
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className={styles.alert_container}>
          <h1>Alerta de Saúde!</h1>
          <h2>SUSPEITA DE ARRITMIA CARDÍACA</h2>
          <div className={styles.alert_main_info}>
            <p><strong>Paciente:</strong> Thales da Silva</p>
            <p><strong>Ala:</strong> 306  <strong>Leito:</strong> 16</p>
          </div>

          <div>
            <h3>Quadro geral</h3>
            <p><strong>Batimentos Cardíacos</strong> 140bpm</p>
            <p><strong>Pressão Arterial</strong> 120/80 mmHg</p>
            <p><strong>Oxigenação</strong> 97.5%</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default App
