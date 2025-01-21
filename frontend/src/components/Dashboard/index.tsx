import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./Dashboard.module.css";
import { HeartRate } from "../../pages/Home";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DashboardProps {
  heartRateData: HeartRate[];
  oxygenLevel: number | null;
  bloodPressure: string | null;
  selectedPatient: string;
}

const Dashboard = ({
  heartRateData,
  oxygenLevel,
  bloodPressure,
  selectedPatient,
}: DashboardProps) => {
  const [averageHeartRate, setAverageHeartRate] = useState<number | null>(null);

  useEffect(() => {
    const lastBpms: number[] = heartRateData.map((entry) => entry.data)
    const soma: number = lastBpms.reduce((acc: number, valor: number) => acc + valor, 0);
    setAverageHeartRate(soma / lastBpms.length)

  }, [heartRateData])

  console.log(heartRateData,
    oxygenLevel,
    bloodPressure,
    selectedPatient)

  const data = {
    labels: heartRateData.map((_, index) => `T${index + 1}`),
    datasets: [
      {
        label: "Batimentos Cardíacos",
        data: heartRateData.map((entry) => entry.data),
        fill: false,
        borderColor: "#BA0021",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Batimentos cardíacos a cada 5 segundos",
      },
    },
  };

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.main_container}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <h2 className={styles.subtitle}>Visão geral</h2>
        </div>

        <div className={styles.ala}>
          Ala: 306 Leito: 16
        </div>

        <div className={styles.inputContainer}>
          <input id="date" type="date" className={styles.styled_date_input} />
        </div>
      </div>
      <div className={styles.cards}>
        {/* Card de Batimentos Cardíacos */}
        <div className={styles.card}>
          <h2>Média Batimentos Cardíacos</h2>
          <p className={styles.value}>{averageHeartRate}</p>
        </div>

        {/* Card de Oxigenação do Sangue */}
        <div className={styles.card}>
          <h2>Oxigenação do Sangue</h2>
          <p className={styles.value}>{oxygenLevel}</p>
        </div>

        {/* Card de Pressão Arterial */}
        <div className={styles.card}>
          <h2>Pressão Arterial</h2>
          <p className={styles.value}>{bloodPressure}</p>
        </div>

        <div className={styles.card_notas}>
            <h2>Notas do paciente</h2>
            <h3>Máx 5.</h3>

            <div className={styles.notas_container}>
                <p>Apresentou comportamentos agressivos</p>
                <p>Tomou 30gm de dopanina barata</p>
                <p>Precisa de atenção periodica</p>
            </div>

        </div>

        {/* Card do gráfico */}
        <div className={styles.card_bpms}>
          <h2>Gráfico de Batimentos Cardíacos</h2>
          <Line data={data} options={options} />
        </div>

        <div className={styles.card_notas2}>
            <h2>Ficha do Paciente</h2>
            <h3>{selectedPatient}</h3>

            <div className={styles.notas_container}>
            <p><strong>Data de Nascimento:</strong> 15/03/1985</p>
            <p><strong>Idade:</strong> 40 anos</p>
            <p><strong>Sexo:</strong> Masculino</p>
            <p><strong>Suspeita:</strong> Dengue</p>
            <p><strong>Data da Internação:</strong> 01/01/2025</p>
            </div>

        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
