import PredictionResult from "../components/PredictionResult";
import Layout from "../components/Layout";
import BrandColorPreview from "../components/BrandColorPreview";
import "../styles/BrandColorPreview.css"; // Adjust the path as necessary

const PredictionResultPage = () => {
    const prediction = "Samsung"; // This should be replaced with the actual prediction logic or state management
  return (
    <Layout>
      <title>ผลการพยากรณ์ | Brand Predictor</title>
      <meta
        name="description"
        content="แสดงผลแบรนด์มือถือที่เหมาะกับคุณ พร้อมกราฟสถิติและแบบสอบถาม"
      />

      <PredictionResult />
      <section>
        <p className="theme-label">
          🎨 ธีมของคุณ:{" "}
          <strong style={{ color: "var(--color-primary)" }}>
            {prediction}
          </strong>
        </p>

        <h3 style={{ textAlign: "center" }}>ธีมของแต่ละแบรนด์</h3>
        <BrandColorPreview />
      </section>
    </Layout>
  );
};

export default PredictionResultPage;
