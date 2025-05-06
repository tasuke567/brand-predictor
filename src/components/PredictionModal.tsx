// src/components/PredictionModal.tsx
import React from "react";
import "../styles/PredictionModal.css"; // CSS styles for the modal

type Props = {
  show: boolean;
  prediction: string | null;
  onClose: () => void;
};

const PredictionModal: React.FC<Props> = ({ show, prediction, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-close" onClick={onClose}>
          ×
        </div>
        <p className="modal-text">
          📱 รุ่นที่เหมาะกับคุณคือ: <strong>{prediction}</strong>
        </p>
        {/* เพิ่ม content หรือกราฟต่าง ๆ ได้ที่นี่ */}
      </div>
    </div>
  );
};

export default PredictionModal;
