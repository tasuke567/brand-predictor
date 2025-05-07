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
import axios from "axios";     
import { useState } from "react";

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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSurveySubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/feedback", {
        prediction,
        uiEase: 4.5,
        satisfaction: 4.2,
        clarity: 4
      });
      setDone(true);                 // โชว์ข้อความ “ขอบคุณ”
    } catch (e) {
      alert("ส่งแบบสอบถามไม่สำเร็จ ลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };
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
        <h3>แบบสอบถาม UI/UX</h3>
        {/* range inputs (อาจเปลี่ยนเป็น state จริงภายหลัง) */}
        {/* … */}
        {done ? (
          <p className="thanks-text">🙏 ขอบคุณสำหรับความคิดเห็น!</p>
        ) : (
          <button
            className="submit-feedback-button"
            onClick={handleSurveySubmit}
            disabled={submitting}
          >
            {submitting ? "กำลังส่ง..." : "ส่งแบบสอบถาม"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;
