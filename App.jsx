import { useState, useEffect } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const token = "p0bqtB3Qx0boCpUWhukeXRP-TLLT66hP";

  const [moisture, setMoisture] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://blynk.cloud/external/api/get?token=${token}&V0`)
        .then(res => res.text())
        .then(val => {
          setMoisture(val);
          setDataList(prev => [...prev.slice(-10), val]);
          setLabels(prev => [...prev.slice(-10), new Date().toLocaleTimeString()]);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendCrop = (value) => {
    fetch(`https://blynk.cloud/external/api/update?token=${token}&V7=${value}`);
  };

  const controlPump = (value) => {
    fetch(`https://blynk.cloud/external/api/update?token=${token}&V1=${value}`);
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Soil Moisture %",
        data: dataList,
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,0.2)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="main">

      {/* HEADER */}
      <header className="header">
        <h1>🌱 Smart Agriculture System</h1>
        <p>IoT Based Automatic Irrigation Dashboard</p>
      </header>

      {/* HERO */}
      <section className="hero">
        <img 
          src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg"
          alt="agriculture"
        />
      </section>

      {/* CONTROL PANEL */}
      <section className="card">
        <h2>🌾 Crop Selection</h2>
        <select onChange={(e) => sendCrop(e.target.value)}>
          <option>Select Crop</option>
          <option value="1">Rice</option>
          <option value="2">Jowar</option>
          <option value="3">Sugarcane</option>
          <option value="4">Cotton</option>
          <option value="5">Wheat</option>
        </select>

        <h2>💧 Moisture Level: {moisture}%</h2>

        <div className="buttons">
          <button className="on" onClick={() => controlPump(1)}>Pump ON</button>
          <button className="off" onClick={() => controlPump(0)}>Pump OFF</button>
        </div>
      </section>

      {/* GRAPH */}
      <section className="card">
        <h2>📊 Live Moisture Graph</h2>
        <Line data={chartData} />
      </section>

      {/* INFO SECTION */}
      <section className="info">
        <h2>🌿 Why Soil Moisture is Important?</h2>
        <p>
          Soil moisture plays a critical role in agriculture. It directly affects plant growth,
          crop yield, and water efficiency. Maintaining proper moisture levels ensures that crops
          receive adequate water without wastage.
        </p>

        <p>
          This smart irrigation system automatically controls water supply based on soil conditions,
          reducing human effort and conserving water resources.
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Smart Agriculture Project</p>
      </footer>

    </div>
  );
}

export default App;