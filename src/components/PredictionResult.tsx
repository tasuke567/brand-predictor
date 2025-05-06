
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import "../style/PredictionResult.css"; // Assuming you have a CSS file for styling

const PredictionResult = ({ label }: { label: string }) => {
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

  return (
    <div className="result-card">
      <h2 className="result-title">ผลการพยากรณ์:</h2>
      <p>มือถือสมาร์ทโฟนที่เหมาะกับคุณคือ: <strong>{label}</strong></p>
      <img src={`/logos/${label.toLowerCase()}.png`} alt={`${label} logo`} className="brand-logo" />

      <h3>Response Time ของผู้ใช้</h3>
      <BarChart width={400} height={200} data={responseTimeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" fill="#60a5fa" />
      </BarChart>

      <h3>เวลาการประมวลผลของโมเดล ML</h3>
      <LineChart width={400} height={200} data={mlProcessingData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="run" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="ms" stroke="#f472b6" />
      </LineChart>

      <button className="retry-button">พยากรณ์ใหม่</button>

      <div className="feedback-section">
        <h3>แบบสอบถาม UI/UX</h3>
        <label>ความง่ายในการใช้งาน (4.5)</label>
        <input type="range" min="1" max="5" value="4.5" readOnly />
        <label>ความพึงพอใจต่อผลการพยากรณ์ (4.2)</label>
        <input type="range" min="1" max="5" value="4.2" readOnly />
        <label>การให้ผลลัพธ์ที่ชัดเจนพอใช้งานได้ (4)</label>
        <input type="range" min="1" max="5" value="4" readOnly />
        <button className="submit-feedback-button">ส่งแบบสอบถาม</button>
      </div>
    </div>
  );
};

export default PredictionResult;
