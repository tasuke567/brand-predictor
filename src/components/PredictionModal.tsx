// PredictionModal.tsx
import React from "react";
import "../styles/PredictionModal.css"; // Import your CSS styles here

type PredictionModalProps = {
  show: boolean;
  prediction: string | null;
  onClose: () => void;
};

const PredictionModal: React.FC<PredictionModalProps> = ({ show, prediction, onClose }) => {
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
      </div>
    </div>
  );
};

export default PredictionModal;
