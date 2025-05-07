import PredictionResult from "../components/PredictionResult";

// หน้านี้ใช้สำหรับ routing ผ่าน <Route path="/result" element={<... />} />
const PredictionResultPage = () => {
  return (
    <main className="page">
      <PredictionResult />
    </main>
  );
};

export default PredictionResultPage;
