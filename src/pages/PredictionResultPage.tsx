import { Helmet } from "react-helmet-async";
import PredictionResult from "../components/PredictionResult";
import Layout from "../components/Layout";

const PredictionResultPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>ผลการพยากรณ์ | Brand Predictor</title>
        <meta name="description" content="แสดงผลแบรนด์มือถือที่เหมาะกับคุณ พร้อมกราฟสถิติและแบบสอบถาม" />
      </Helmet>
      <PredictionResult />
    </Layout>
  );
};

export default PredictionResultPage;
