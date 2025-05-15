import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PredictionResult.css";

import FeedbackForm from "../components/FeedbackForm";
import { brandThemes } from "../utils/brandThemes";
import { useTheme } from "../context/ThemeContext";

const PredictionResult: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setPrediction } = useTheme();

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
      <h2 className="result-title">ผลการพยากรณ์:</h2>

      <div className="result-label" style={{ color: theme.primary }}>
        {label}
      </div>

      <img
        src={`/images/${label.toLowerCase()}.png`}
        onError={(e) => (e.currentTarget.src = "/images/default.png")}
        alt={`${label} logo`}
        className="brand-logo"
      />

      {/* ปุ่มลองใหม่ */}
      <button
        className="btn-primary"
        onClick={() => navigate("/")}
        style={{ background: theme.primary }}
      >
        🔁 พยากรณ์ใหม่
      </button>

      {/* ฟอร์มฟีดแบ็ก */}
      <div className="feedback-section">
        <FeedbackForm prediction={label} />
      </div>
    </div>
  );
};

export default PredictionResult;
