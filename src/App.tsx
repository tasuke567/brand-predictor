import React, { useState, useEffect } from "react";
import "./styles/App.css";
import { useNavigate } from "react-router-dom";
import { labels, options, initialState, sections } from "./utils/formConfig";
import { formDataToCSV } from "./utils/formUtils";
import FieldGroup from "./components/FieldGroup";
import Layout from "./components/Layout";
/**
 * Type helpers
 */
type FormKey = keyof typeof initialState;
type FormData = typeof initialState;

const App = () => {
  /** -------------------- state -------------------- */
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("smartphone-form");
    return saved ? (JSON.parse(saved) as FormData) : initialState;
  });
  const [errors, setErrors] = useState<Partial<Record<FormKey, boolean>>>({});
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0); // 0-100
  const [isUploading, setIsUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  /** -------------------- handlers -------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const key = name as FormKey;

    setFormData((prev) => {
      if (type === "checkbox" && Array.isArray(prev[key])) {
        const list = prev[key] as string[];
        const updated = checked
          ? [...list, value]
          : list.filter((v) => v !== value);
        return { ...prev, [key]: updated } as FormData;
      }
      return { ...prev, [key]: value } as FormData;
    });
  };

  const validate = (fields: FormKey[]) => {
    const errs: Partial<Record<FormKey, boolean>> = {};
    fields.forEach((k) => {
      const v = formData[k];
      if (!v || (Array.isArray(v) && !v.length)) errs[k] = true;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    const currentFields = sections[step].fields as FormKey[];
    if (!validate(currentFields)) {
      setShowToast(true);
      return;
    }
    setStep((p) => p + 1);
  };

  const handleBack = () => setStep((p) => p - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setProcessing(false); // รีเซ็ต
    setUploadPercent(0);
    const csv = formDataToCSV(formData);
    const blob = new Blob([csv], { type: "text/csv" });
    const fd = new FormData(); // <── ใส่กลับ
    fd.append("file", blob, "predict.csv");
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${
        import.meta.env.VITE_API_URL ?? "https://waka-api-hw3h.onrender.com"
      }/predict`,
      true
    );

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        setUploadPercent(pct);
        if (pct === 100) setProcessing(true); // 🆕 กำลังประมวลผล
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setIsUploading(false);
        setProcessing(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            navigate("/result", {
              state: { prediction: res.prediction.label },
            });
            +(
              /* -- API คืน { questionnaireId, prediction:{ label, distribution } } -- */
              navigate("/result", {
                state: {
                  questionnaireId: res.questionnaireId,
                  label: res.prediction.label,
                  distribution: res.prediction.distribution,
                },
              })
            );
          } catch (_) {
            alert("แปลงผลลัพธ์ไม่สำเร็จ");
          }
        } else {
          alert("อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง");
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      alert("เครือข่ายมีปัญหา ลองใหม่");
    };

    xhr.send(fd);
  };

  /** -------------------- effects -------------------- */
  useEffect(() => {
    const filled = (Object.keys(formData) as FormKey[]).filter((k) => {
      const v = formData[k];
      return v && (!Array.isArray(v) || v.length);
    }).length;
    setProgress((filled / (Object.keys(formData) as FormKey[]).length) * 100);
  }, [formData]);

  useEffect(
    () => localStorage.setItem("smartphone-form", JSON.stringify(formData)),
    [formData]
  );

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  /** -------------------- render -------------------- */
  const currentSection = sections[step];

  return (
    <div className="container">
      <Layout>
        {/* Loading overlay with real % */}
        {isUploading && (
          <div className="loading-overlay">
            {processing ? (
              <>
                <p className="loading-text">กำลังประมวลผล...</p>
              </>
            ) : (
              <>
                <div className="loader-bar">
                  <div
                    className="loader-fill"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                <p className="loading-text">อัปโหลด {uploadPercent}%</p>
              </>
            )}
          </div>
        )}

        <div className="progress-wrapper">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {currentSection.fields.length ? (
            <div className="form-step-active fade-in fade-transition">
              <div className="form-section-title">{currentSection.title}</div>
              <div className="form-grid">
                {currentSection.fields.map((field) => (
                  <FieldGroup
                    key={field}
                    label={labels[field as FormKey]}
                    name={field as FormKey}
                    multiple={Array.isArray(initialState[field as FormKey])}
                    value={formData[field as FormKey]}
                    error={errors[field as FormKey]}
                    onChange={handleChange}
                    options={options[field as FormKey]}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="summary-section fade-in">
              <h2 className="form-section-title">{currentSection.title}</h2>

              {/* ⬇️ เปลี่ยน div-list → definition list */}
              <dl className="summary-grid">
                {(Object.keys(labels) as FormKey[]).map((k) => (
                  <React.Fragment key={k}>
                    <dt className="summary-term">{labels[k]}</dt>
                    <dd className="summary-desc">
                      {Array.isArray(formData[k])
                        ? (formData[k] as string[]).join(", ")
                        : formData[k] || "-"}
                    </dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}

          <div className="form-submit-wrapper">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="step-button"
              >
                ย้อนกลับ
              </button>
            )}
            {step < sections.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="step-button"
              >
                ถัดไป
              </button>
            )}
            {step === sections.length - 1 && (
              <button
                type="submit"
                className="submit-button"
                disabled={isUploading}
              >
                {processing
                  ? "กำลังประมวลผล..."
                  : isUploading
                  ? `อัปโหลด ${uploadPercent}%`
                  : "พยากรณ์สมาร์ตโฟนที่เหมาะกับคุณ"}
              </button>
            )}
          </div>
        </form>

        {showToast && <div className="toast">กรุณากรอกข้อมูลให้ครบถ้วน</div>}

        <div className="toggle-dark" onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </div>
      </Layout>
    </div>
  );
};

export default App;
