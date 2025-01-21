import { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import Sidebar from "../../components/Sidebar";
import styles from "./home.module.css";
import { io } from "socket.io-client";

interface HomeProps {
  sideBarVisibility: boolean;
}

export interface HeartRate {
  pacient: string; // Paciente
  data: number; // Dados, como a taxa de batimento cardíaco ou outros valores
}

const Home = ({ sideBarVisibility }: HomeProps) => {
  const [heartRateData, setHeartRateData] = useState<HeartRate[]>([]);
  const [oxygenLevel, setOxygenLevel] = useState<{ [key: string]: number }>({});
  const [bloodPressure, setBloodPressure] = useState<{ [key: string]: string }>({});
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("heartbeat", (data) => {
      setHeartRateData((prevData) => {
        const newData = [...prevData, { pacient: data.pacient, data: data.data }];
        if (newData.length > 10) newData.shift();
        return newData;
      });
    });

    socket.on("oxygen", (data) => {
      setOxygenLevel((prevState) => ({
        ...prevState,
        [data.pacient]: data.data, // Ajuste no campo 'pacient'
      }));
    });

    socket.on("pressure", (data) => {
      setBloodPressure((prevState) => ({
        ...prevState,
        [data.pacient]: data.data, // Ajuste no campo 'pacient'
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
    (data) => data.pacient === selectedPatient
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
        <div className={styles.pacientes_container}>
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
