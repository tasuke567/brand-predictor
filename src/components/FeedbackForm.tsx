import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/FeedbackForm.css"; // Assuming you have a CSS file for styling

interface FeedbackFormProps {
  prediction?: string;
}

const FeedbackForm = ({ prediction }: FeedbackFormProps) => {
  const [uiEase, setUiEase] = useState(3);
  const [satisfaction, setSatisfaction] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    // เพิ่มความ “ว้าว” ด้วย firework สองข้าง
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
    });
  };

  useEffect(() => {
    if (done) {
      fireConfetti();
    }
  }, [done]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL ?? "https://waka-api-hw3h.onrender.com"
        }/feedback`,
        { prediction, uiEase, satisfaction, clarity },
        { headers: { "Content-Type": "application/json" } }
      );

      setDone(true);
    } catch (e) {
      alert("ส่งแบบสอบถามไม่สำเร็จ ลองใหม่อีกทีนะ 😢");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h3>แบบสอบถาม UI/UX</h3>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <label>
              ความง่ายในการใช้งาน UI: {uiEase}
              <input
                type="range"
                min={1}
                max={5}
                value={uiEase}
                onChange={(e) => setUiEase(+e.target.value)}
              />
            </label>

            <label>
              ความพึงพอใจภาพรวม: {satisfaction}
              <input
                type="range"
                min={1}
                max={5}
                value={satisfaction}
                onChange={(e) => setSatisfaction(+e.target.value)}
              />
            </label>

            <label>
              ความชัดเจนของผลลัพธ์: {clarity}
              <input
                type="range"
                min={1}
                max={5}
                value={clarity}
                onChange={(e) => setClarity(+e.target.value)}
              />
            </label>

            <button
              className="submit-feedback-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "กำลังส่ง..." : "ส่งแบบสอบถาม"}
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="thanks"
            className="thanks-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            🙏 ขอบคุณสำหรับความคิดเห็น!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;
