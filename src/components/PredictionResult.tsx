import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "../styles/PredictionResult.css"; // Assuming you have a CSS file for styling
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";

const PredictionResult = () => {
  const responseTimeData = [
    { name: "User A", time: 380 },
    { name: "User B", time: 320 },
    { name: "User C", time: 340 },
    { name: "User D", time: 300 },
    { name: "User E", time: 360 },
  ];

  const mlProcessingData = [
    { run: "Run 1", ms: 390 },
    { run: "Run 2", ms: 395 },
    { run: "Run 3", ms: 388 },
    { run: "Run 4", ms: 400 },
    { run: "Run 5", ms: 392 },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction || "ไม่สามารถคาดการณ์ได้";
  
  return (
    <div className="result-card">
      <h2 className="result-title">ผลการพยากรณ์:</h2>
      <div className="result-label">{prediction}</div>
      <img
        src={`/images/${prediction.toLowerCase()}.png`}
        alt={`${prediction} logo`}
        className="brand-logo"
      />

      <h3>Response Time ของผู้ใช้</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>เวลาการประมวลผลของโมเดล ML</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mlProcessingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="run" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ms" stroke="#f472b6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button className="retry-button" onClick={() => navigate("/")}>
        🔁 พยากรณ์ใหม่
      </button>

      <div className="feedback-section">
  <FeedbackForm prediction={prediction} />
</div>
    </div>
  );
};

export default PredictionResult;
