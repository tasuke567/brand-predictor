import React, { useState, useEffect } from "react";
import "./styles/App.css";
import { useNavigate } from "react-router-dom";

import { labels, options, initialState, sections } from "./utils/formConfig";
import { formDataToCSV } from "./utils/formUtils";
import FieldGroup from "./components/FieldGroup";

type FormKey = keyof typeof initialState;

type FormData = typeof initialState;

const App = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("smartphone-form");
    return saved ? (JSON.parse(saved) as FormData) : initialState;
  });
  const [errors, setErrors] = useState<Partial<Record<FormKey, boolean>>>({});
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  /** -------------------- handlers -------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    const key = name as FormKey;
    const isCheckbox = (target as HTMLInputElement).type === "checkbox";

    setFormData((prev) => {
      if (isCheckbox && Array.isArray(prev[key])) {
        const checked = (target as HTMLInputElement).checked;
        const list = prev[key] as string[];
        const updatedList = checked
          ? [...list, value]
          : list.filter((v) => v !== value);
        return { ...prev, [key]: updatedList } as FormData;
      }
      return { ...prev, [key]: value } as FormData;
    });
  };

  const validate = (fields: FormKey[]) => {
    const newErrors: Partial<Record<FormKey, boolean>> = {};
    fields.forEach((k) => {
      const v = formData[k];
      if (!v || (Array.isArray(v) && v.length === 0)) newErrors[k] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const csv = formDataToCSV(formData);
    const blob = new Blob([csv], { type: "text/csv" });
    const formDataUpload = new FormData();
    formDataUpload.append("file", blob, "predict.csv");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formDataUpload,
      });
      const result = await res.json();
      navigate("/result", { state: { prediction: result.prediction.label } });
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  /** -------------------- effects -------------------- */
  useEffect(() => {
    const filled = (Object.keys(formData) as FormKey[]).filter((k) => {
      const v = formData[k];
      return v && (!Array.isArray(v) || v.length);
    }).length;
    setProgress((filled / (Object.keys(formData) as FormKey[]).length) * 100);
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("smartphone-form", JSON.stringify(formData));
  }, [formData]);

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
      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {currentSection.fields.length ? (
          <div className="form-step-active fade-in fade-transition">
            <div className="form-section-title">{currentSection.title}</div>
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
        ) : (
          <div className="summary-section fade-in">
            <h2 className="form-section-title">{currentSection.title}</h2>
            {(Object.keys(labels) as FormKey[]).map((k) => (
              <div key={k} className="summary-item">
                <strong>{labels[k]}</strong>: {Array.isArray(formData[k]) ? (formData[k] as string[]).join(", ") : formData[k] || "-"}
              </div>
            ))}
          </div>
        )}

        <div className="form-submit-wrapper">
          {step > 0 && (
            <button type="button" onClick={handleBack} className="step-button">
              ย้อนกลับ
            </button>
          )}
          {step < sections.length - 1 && (
            <button type="button" onClick={handleNext} className="step-button">
              ถัดไป
            </button>
          )}
          {step === sections.length - 1 && (
            <button type="submit" className="submit-button">
              ยืนยันและส่ง
            </button>
          )}
        </div>
      </form>

      {showToast && <div className="toast">กรุณากรอกข้อมูลให้ครบถ้วน</div>}


      <div className="toggle-dark" onClick={() => setDark(!dark)}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </div>
    </div>
  );
};

export default App;