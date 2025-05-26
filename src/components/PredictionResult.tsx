import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PredictionResult.css";

import FeedbackForm from "../components/FeedbackForm";
import { brandThemes } from "../utils/brandThemes";
import { useTheme } from "../context/ThemeContext";

/* ---------- Utils ---------- */

const PredictionResult: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setPrediction } = useTheme();

  /* redirect if no state */
  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  const { label = "ไม่สามารถคาดการณ์ได้" } = state as {
    label?: string;
  };

  const theme = brandThemes[label] || brandThemes.default;



 

  /* ---------- set theme context ---------- */
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

      {/* ---------- Retry button ---------- */}
      <button
        className="btn-primary"
        onClick={() => navigate("/")}
        style={{ background: theme.primary }}
      >
        🔁 แนะนำสมาร์ตโฟนที่เหมาะกับคุณใหม่
      </button>

      {/* ---------- Feedback ---------- */}
      <div className="feedback-section">
        <FeedbackForm prediction={label} />
      </div>
    </div>
  );
};

export default PredictionResult;
