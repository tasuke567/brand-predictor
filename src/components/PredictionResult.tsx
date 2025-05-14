import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  // LineChart,
  // Line,
  ResponsiveContainer,
} from "recharts";
import "../styles/PredictionResult.css";
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import { brandThemes } from "../utils/brandThemes";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPrediction } = useTheme();
  const {
    label,
    distribution,
  }: { label?: string; distribution?: Record<string, number> } =
    location.state || {};
  const prediction = label || "ไม่สามารถคาดการณ์ได้";
  const theme = brandThemes[prediction] || brandThemes.default;
  if (!location.state) {
    navigate("/", { replace: true });
    return null;
  }

  const chartData = Object.entries(distribution || {})
    .map(([k, v]) => [k.replace(/^'+|'+$/g, ""), v] as [string, number])
    .sort(([, a], [, b]) => b - a)
    .map(([brand, prob]) => ({ brand, prob: +(prob * 100).toFixed(1) }));
  // const responseTimeData = [
  //   { name: "User A", time: 380 },
  //   { name: "User B", time: 320 },
  //   { name: "User C", time: 340 },
  //   { name: "User D", time: 300 },
  //   { name: "User E", time: 360 },
  // ];

  // const mlProcessingData = [
  //   { run: "Run 1", ms: 390 },
  //   { run: "Run 2", ms: 395 },
  //   { run: "Run 3", ms: 388 },
  //   { run: "Run 4", ms: 400 },
  //   { run: "Run 5", ms: 392 },
  // ];

  useEffect(() => {
    setPrediction(prediction);
  }, [prediction]);

  return (
    <div className="result-card">
      <h2 className="result-title">ผลการพยากรณ์:</h2>
      <div className="result-label" style={{ color: theme.primary }}>
        {prediction}
      </div>
      <img
        src={`/images/${prediction.toLowerCase()}.png`}
        onError={(e) => (e.currentTarget.src = "/images/default.png")}
        alt={`${prediction} logo`}
        className="brand-logo"
      />
      <section className="chart-wrapper">
        <h3>📈 ความน่าจะเป็นของแต่ละแบรนด์</h3>
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={chartData.filter((d) => d.prob > 0)}>
            <XAxis dataKey="brand" />
            <YAxis unit="%" domain={[0, 100]} />
            <Tooltip formatter={(v: number) => `${v} %`} />
            <Bar dataKey="prob" fill={theme.primary} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* <section className="chart-wrapper">
        <h3>📊 Response Time ของผู้ใช้</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-wrapper">
        <h3>⏱️ เวลาการประมวลผลของโมเดล ML</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mlProcessingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="run" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ms" stroke="#f472b6" />
          </LineChart>
        </ResponsiveContainer>
      </section> */}

      <button
        className="retry-button"
        aria-label="พยากรณ์ใหม่"
        style={{
          backgroundColor: theme.primary,
          color: "white",
        }}
        onClick={() => navigate("/")}
      >
        🔁 พยากรณ์ใหม่
      </button>

      <div className="feedback-section">
        <FeedbackForm prediction={label} />
      </div>
      {/* <p className="theme-label">
          🎨 ธีมของคุณ:{" "}
          <strong style={{ color: "var(--color-primary)" }}>
            {prediction}
          </strong>
        </p> */}
    </div>
  );
};

export default PredictionResult;
