import React, { useState, useEffect } from "react";
import "./App.css";

type FormKey = keyof typeof initialState;
type FormData = typeof initialState;
type FieldProps = {
  label: string;
  name: FormKey;
  multiple: boolean;
};

const initialState = {
  gender: "",
  ageRange: "",
  maritalStatus: "",
  occupation: "",
  income: "",
  apps: [],
  activities: [],
  dailyUsage: "",
  importance: "",
  purchaseFactors: "",
  satisfaction: "",
  onlinePurchaseIssues: "",
};

const sections: {
  title: string;
  fields: (keyof typeof initialState)[];
}[] = [
  {
    title: "ข้อมูลพื้นฐาน",
    fields: ["gender", "ageRange", "maritalStatus", "occupation", "income"],
  },
  {
    title: "พฤติกรรมการใช้งาน",
    fields: ["apps", "activities", "dailyUsage"],
  },
  {
    title: "พฤติกรรมการใช้งาน (ต่อ)",
    fields: [
      "importance",
      "purchaseFactors",
      "satisfaction",
      "onlinePurchaseIssues",
    ],
  },
  {
    title: "สรุปข้อมูลก่อนส่ง",
    fields: [],
  },
];

const labels = {
  gender: "เพศ",
  ageRange: "ช่วงอายุ",
  maritalStatus: "สถานภาพ",
  occupation: "อาชีพ",
  income: "รายได้ต่อเดือน",
  apps: "แอปที่ใช้เป็นประจำ",
  activities: "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ",
  dailyUsage: "ระยะเวลาการใช้งาน",
  importance: "ความสำคัญของสมาร์ทโฟน",
  purchaseFactors: "ปัจจัยเมื่อซื้อสมาร์ทโฟน",
  satisfaction: "ระดับความพึงพอใจ",
  onlinePurchaseIssues: "ปัญหาในการซื้อออนไลน์",
};

const options = {
  gender: ["ชาย", "หญิง", "อื่นๆ"],
  ageRange: [
    "18-25 ปี",
    "26-32 ปี",
    "33-40 ปี",
    "41-50 ปี",
    "50-60 ปี",
    "60 ปีขึ้นไป",
  ],
  maritalStatus: ["โสด", "สมรส", "หย่าร้าง", "แยกกันอยู่"],
  occupation: [
    "นักเรียน / นักศึกษา",
    "พนักงานบริษัทเอกชน",
    "พนักงานข้าราชการ",
    "พนักงานรัฐวิสาหกิจ",
    "พนักงานโรงงานอุตสาหกรรม",
    "เจ้าของธุรกิจ/ธุรกิจส่วนตัว",
  ],
  income: [
    "น้อยกว่า 15,000 บาท",
    "15,001 - 20,000 บาท",
    "20,001 - 30,000 บาท",
    "30,001 - 40,000 บาท",
    "40,001 - 50,000 บาท",
    "มากกว่า 50,001 บาทขึ้นไป",
  ],
  apps: [
    "Instagram",
    "Facebook",
    "YouTube",
    "Snapchat",
    "Facebook Messenger",
    "Spotify",
    "WhatsApp",
    "TikTok",
    "Telegram",
    "Other",
  ],
  activities: [
    "ดูหนัง / ฟังเพลง",
    "เล่นเกม",
    "ถ่ายรูป / ถ่ายวิดีโอ",
    "Application บน cloud",
    "ติดต่อสื่อสาร / ประชุมงาน",
    "โซเชียลมีเดีย",
  ],
  dailyUsage: [
    "0 - 1 ชั่วโมง",
    "1 - 3 ชั่วโมง",
    "3 - 5 ชั่วโมง",
    "มากกว่า 5 ชั่วโมง",
  ],
  importance: ["จำเป็นมากที่สุด", "จำเป็น", "ไม่จำเป็น"],
  purchaseFactors: ["ราคา", "รีวิวสินค้า", "ฟีเจอร์สินค้า"],
  satisfaction: ["1", "2", "3", "4", "5"],
  onlinePurchaseIssues: [
    "ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน",
    "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง",
    "ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย",
    "ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง",
  ],
};

const App = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("smartphone-form");
    return saved ? JSON.parse(saved) : initialState;
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof initialState, boolean>>
  >({});

  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev: FormData) => {
      const key = name as keyof typeof initialState;
      const updated =
        type === "checkbox"
          ? {
              ...prev,
              [key]: checked
                ? [...(prev[key] as string[]), value]
                : (prev[key] as string[]).filter((v) => v !== value),
            }
          : { ...prev, [key]: value };
      return updated;
    });
  };

  const validate = (fields: (keyof typeof initialState)[]) => {
    const newErrors: Partial<Record<keyof typeof initialState, boolean>> = {};
    fields.forEach((key) => {
      const value = formData[key];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const currentFields = sections[step].fields;
    if (!validate(currentFields)) {
      setShowToast(true);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = sections.flatMap((s) => s.fields);
    if (!validate(allFields)) {
      setShowToast(true);
      return;
    }
    setPrediction("Apple");
    setShowModal(true);
  };

  useEffect(() => {
    const filled = Object.keys(formData).filter(
      (k) => formData[k] && (!Array.isArray(formData[k]) || formData[k].length)
    ).length;
    setProgress((filled / Object.keys(formData).length) * 100);
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("smartphone-form", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const Field = ({ label, name, multiple }: FieldProps) => (
    <div className="form-group fade-in">
      <label className="form-label">{label} *</label>
      {!multiple ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`form-select ${
            errors[name as FormKey] ? "form-error" : ""
          }`}
        >
          <option value="">เลือก</option>
          {(options[name as FormKey] as string[]).map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="checkbox-group">
          {(options[name as FormKey] as string[]).map((opt: string) => (
            <label key={opt} className="checkbox-label">
              <input
                type="checkbox"
                name={name}
                value={opt}
                checked={(formData[name as FormKey] as string[]).includes(opt)}
                onChange={handleChange}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const currentSection = sections[step];

  return (
    <div className="container">
      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <form onSubmit={handleSubmit} className="form">
        {currentSection.fields.length > 0 ? (
          <div className="form-step-active fade-in fade-transition">
            <div className="form-section-title">{currentSection.title}</div>
            {currentSection.fields.map((field) => (
              <Field
                key={field}
                label={labels[field]}
                name={field}
                multiple={Array.isArray(initialState[field])}
              />
            ))}
          </div>
        ) : (
          <div className="summary-section fade-in">
            <h2 className="form-section-title">{currentSection.title}</h2>
            {(Object.keys(labels) as FormKey[]).map((key) => (
              <div key={key} className="summary-item">
                <strong>{labels[key]}</strong>:{" "}
                {Array.isArray(formData[key])
                  ? (formData[key] as string[]).join(", ")
                  : formData[key] || "-"}
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </div>
            <p className="modal-text">ผลลัพธ์การคาดการณ์: {prediction}</p>
          </div>
        </div>
      )}
      <div className="toggle-dark" onClick={() => setDark(!dark)}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </div>
    </div>
  );
};

export default App;
