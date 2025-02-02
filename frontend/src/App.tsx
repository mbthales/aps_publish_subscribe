import { useState } from 'react'
import styles from './App.module.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Modal from './components/Modal'

const App = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [criticalPatientData, setCriticalPatientData] = useState<{
    patient: string;
    heartRate?: number;
    oxygenLevel?: number;
    bloodPressure?: string;
    type?: string;
  } | null>(null);

  const handleSideBarVisibility = () => {
    setIsSideBarOpen((prevState) => !prevState);
  };

  const handleCriticalModal = (patient: string, heartRate?: number, oxygenLevel?: number, bloodPressure?: string, type?: string) => {
    setCriticalPatientData({ patient, heartRate, oxygenLevel, bloodPressure, type });
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar handleSideBarVisibility={handleSideBarVisibility}  />
      <Home sideBarVisibility={isSideBarOpen} handleCriticalModal={handleCriticalModal} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.alert_container}>
          <h1>Alerta de Saúde!</h1>
          {criticalPatientData?.type === 'heartbeat' && <h2>TAQUICARDIA DETECTADA</h2>}
          {criticalPatientData?.type === 'oxygen' && <h2>BAIXA OXIGENAÇÃO</h2>}
          {criticalPatientData?.type === 'pressure' && <h2>PRESSÃO ARTERIAL ELEVADA</h2>}
          <div className={styles.alert_main_info}>
            <p><strong>Paciente:</strong> {criticalPatientData?.patient}</p>
            <p><strong>Ala:</strong> 306  <strong>Leito:</strong> 16</p>
          </div>

          <div>
            <h3>Quadro geral</h3>
            <p><strong>Batimentos Cardíacos</strong> {criticalPatientData?.heartRate ?? 'N/A'} bpm</p>
            <p><strong>Pressão Arterial</strong> {criticalPatientData?.bloodPressure ?? 'N/A'}</p>
            <p><strong>Oxigenação</strong> {criticalPatientData?.oxygenLevel ? `${criticalPatientData.oxygenLevel}%` : 'N/A'}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default App
