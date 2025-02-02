import { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import Sidebar from "../../components/Sidebar";
import styles from "./Home.module.css";
import { io } from "socket.io-client";

interface HomeProps {
  sideBarVisibility: boolean;
  handleCriticalModal: (patient: string, heartRate?: number, oxygenLevel?: number, bloodPressure?: string, type?: string) => void;
}

export interface HeartRate {
  patient: string; // paciente
  data: number; // Dados, como a taxa de batimento cardíaco ou outros valores
}

const Home = ({ sideBarVisibility, handleCriticalModal }: HomeProps) => {
  const [heartRateData, setHeartRateData] = useState<HeartRate[]>([]);
  const [oxygenLevel, setOxygenLevel] = useState<{ [key: string]: number }>({});
  const [bloodPressure, setBloodPressure] = useState<{ [key: string]: string }>({});
  const [selectedPatient, setSelectedPatient] = useState<string>("joao");

  useEffect(() => {
    const socket = io("http://localhost:5000");
  
    socket.on("heartbeat", (data) => {
      if (data.priority === "high") {
        handleCriticalModal(data.patient, data.data, oxygenLevel[data.patient], bloodPressure[data.patient], "heartbeat");
      }
  
      setHeartRateData((prevData) => {
        const newData = [...prevData, { patient: data.patient, data: data.data }];
        if (newData.length > 10) newData.shift();
        return newData;
      });
    });
  
    socket.on("oxygen", (data) => {
      if (data.priority === "high") {
        handleCriticalModal(data.patient, heartRateData.find((hr) => hr.patient === data.patient)?.data, data.data, bloodPressure[data.patient], "oxygen");
      }
  
      setOxygenLevel((prevState) => ({
        ...prevState,
        [data.patient]: data.data,
      }));
    });
  
    socket.on("pressure", (data) => {
      if (data.priority === "high") {
        handleCriticalModal(data.patient, heartRateData.find((hr) => hr.patient === data.patient)?.data, oxygenLevel[data.patient], data.data, "pressure");	  
      }
  
      setBloodPressure((prevState) => ({
        ...prevState,
        [data.patient]: data.data,
      }));
    });
  
    return () => {
      socket.disconnect();
    };
  }, []); 

  const handlePatientSelect = (name: string) => {
    setSelectedPatient(name);
  };

  // Filtragem dos dados baseados no paciente selecionado
  const filteredHeartRateData = heartRateData.filter(
    (data) => data.patient === selectedPatient
  );
  const filteredOxygenLevel = selectedPatient
    ? oxygenLevel[selectedPatient]
    : null;
  const filteredBloodPressure = selectedPatient
    ? bloodPressure[selectedPatient]
    : null;

  return (
    <div className={styles.home_container}>
      {sideBarVisibility && (
        <div className={styles.patientes_container}>
          <Sidebar
            onSelectPatient={handlePatientSelect}
            selectedPatient={selectedPatient}
          />
        </div>
      )}

      <div className={styles.dashboard_container}>
        <Dashboard
          heartRateData={filteredHeartRateData}
          oxygenLevel={filteredOxygenLevel}
          bloodPressure={filteredBloodPressure}
          selectedPatient={selectedPatient}
        />
      </div>
    </div>
  );
};

export default Home;
