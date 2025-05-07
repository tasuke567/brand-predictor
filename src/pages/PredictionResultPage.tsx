import PredictionResult from "../components/PredictionResult";
import Layout from "../components/Layout";

const PredictionResultPage = () => {
  return (
    <Layout>
      <title>ผลการพยากรณ์ | Brand Predictor</title>
      <meta
        name="description"
        content="แสดงผลแบรนด์มือถือที่เหมาะกับคุณ พร้อมกราฟสถิติและแบบสอบถาม"
      />

      <PredictionResult />
    </Layout>
  );
};

export default PredictionResultPage;
