import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PredictionResult.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import { useQuery} from "@tanstack/react-query";
import FeedbackForm from "../components/FeedbackForm";
import { brandThemes } from "../utils/brandThemes";
import { useTheme } from "../context/ThemeContext";
import { api } from "@/lib/api";
type Metrics = { accuracy: number | null; kappa: number | null };
interface ModelInfo {
  updatedAt: string;
  size: number;
  classAttr: string;
  metrics?: Metrics;
}

/* ---------------- react-query fetch ---------------- */
const useModelInfo = () =>
  useQuery({
    queryKey: ["model-info"],
    queryFn: () => api.get<ModelInfo>("/model-info").then((r) => r.data),
    retry: false,
  });

const PredictionResult: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setPrediction } = useTheme();
  const { data: info } = useModelInfo();
  /* ถ้าไม่มี state → เด้งกลับหน้าแรก */
  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  const { label = "ไม่สามารถคาดการณ์ได้" } = state as {
    label?: string;
  };

  const theme = brandThemes[label] || brandThemes.default;

  /* บอก ThemeContext */
  useEffect(() => setPrediction(label), [label]);
  return (
    <div className="result-card">
      <h2 className="result-title">ผลการแนะนำสมาร์ตโฟน</h2>

      <div className="result-label" style={{ color: theme.primary }}>
        {label}
      </div>

      <img
        src={`/images/${label.toLowerCase()}.png`}
        onError={(e) => (e.currentTarget.src = "/images/default.png")}
        alt={`${label} logo`}
        className="brand-logo"
      />

      {/* Current model info */}
      {info?.updatedAt && (
        <section className="mm-section mm-meta">
          {info.metrics && (
            <p>
              Accuracy:{" "}
              <strong>
                {info.metrics.accuracy !== null
                  ? `${(info.metrics.accuracy * 100).toFixed(2)} %`
                  : "–"}
              </strong>
            </p>
          )}
        </section>
      )}

      {/* ปุ่มลองใหม่ */}
      <button
        className="btn-primary"
        onClick={() => navigate("/")}
        style={{ background: theme.primary }}
      >
        🔁 แนะนำสมาร์ตโฟนที่เหมาะกับคุณใหม่
      </button>

      {/* ฟอร์มฟีดแบ็ก */}
      <div className="feedback-section">
        <FeedbackForm prediction={label} />
      </div>
    </div>
  );
};

export default PredictionResult;
