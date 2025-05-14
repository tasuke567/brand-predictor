import PredictionResult from "../components/PredictionResult";
import Layout from "../components/Layout";
import "../styles/BrandColorPreview.css"; 

const PredictionResultPage = () => {
  

  return (
    <Layout>
      <title>ผลการพยากรณ์ | Brand Predictor</title>
      <meta
        name="description"
        content="แสดงผลแบรนด์มือถือที่เหมาะกับคุณ พร้อมกราฟสถิติและแบบสอบถาม"
      />

      <PredictionResult />
      {/* <section>
        <h3 style={{ textAlign: "center" }}>ธีมของแต่ละแบรนด์</h3>
        <BrandColorPreview />
      </section> */}
    </Layout>
  );
};

export default PredictionResultPage;
