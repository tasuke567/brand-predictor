import React, { useState, useEffect } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;
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
  const [prediction] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState("");

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

  const translateMap = {
    gender: { ชาย: "Male", หญิง: "Female", อื่นๆ: "LGBTQ+" },
    ageRange: {
      "18-25 ปี": "18-25",
      "26-32 ปี": "26-32",
      "33-40 ปี": "33-40",
      "41-50 ปี": "36-45",
      "50-60 ปี": "46-55",
      "60 ปีขึ้นไป": "60+",
    },
    maritalStatus: {
      โสด: "Single",
      สมรส: "Married",
      หย่าร้าง: "Single",
      แยกกันอยู่: "Single",
    },
    dailyUsage: {
      "0 - 1 ชั่วโมง": "0-1 hours",
      "1 - 3 ชั่วโมง": "1-3 hours",
      "3 - 5 ชั่วโมง": "3-5 hours",
      "มากกว่า 5 ชั่วโมง": ">5 hours",
    },
    importance: {
      จำเป็นมากที่สุด: "Highly essential",
      จำเป็น: "Essential",
      ไม่จำเป็น: "Not important",
    },
    purchaseFactors: {
      ราคา: "Price",
      รีวิวสินค้า: "Product reviews",
      ฟีเจอร์สินค้า: "Features",
    },
    onlinePurchaseIssues: {
      ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน:
        "Concerns about payment security",
      ไม่สามารถสัมผัสหรือลองสินค้าได้จริง: "Unable to inspect product",
      ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย:
        "Uncertainty about after-sales service",
      ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง: "Issues with delivery",
    },
    income: {
      "น้อยกว่า 15,000 บาท": "Less than 15000",
      "15,001 - 20,000 บาท": "15001-20000",
      "20,001 - 30,000 บาท": "20001-30000",
      "30,001 - 40,000 บาท": "30001-40000",
      "40,001 - 50,000 บาท": "30001-50000",
      "มากกว่า 50,001 บาทขึ้นไป": " 50001 ",
    },
    occupation: {
      "นักเรียน / นักศึกษา": "Student",
      พนักงานบริษัทเอกชน: "Private company employee",
      พนักงานข้าราชการ: "Civil servant",
      พนักงานรัฐวิสาหกิจ: "Employee",
      พนักงานโรงงานอุตสาหกรรม: "Factory worker",
      "เจ้าของธุรกิจ/ธุรกิจส่วนตัว": "Business owner",
    },
    currentBrand: {
      Apple: "Apple",
      Samsung: "Samsung",
      Oppo: "Oppo",
      Vivo: "Vivo",
      Xiaomi: "Xiaomi",
      Other: "Other",
    },
  };

  // const csvHeaders = [
  //   'Gender', 'Age_range', 'Status', 'Top3_smartphone_activities',
  //   'Frequent_apps', 'Daily_usage_duration', 'Smartphone_importance',
  //   'Key_factor_online_purchase', 'Brand_satisfaction',
  //   'Purchase_problem', 'Monthly_income', 'Occupation', 'Current_brand'
  // ];

  function translate(field: string, value: any): string {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    const dict = translateMap[field as keyof typeof translateMap] as Record<
      string,
      string
    >;
    return dict[value] || value || "?";
  }

  function mapToCsvRow(formData: Record<string, any>): string {
    const row = [
      translate("gender", formData.gender),
      translate("ageRange", formData.ageRange),
      translate("maritalStatus", formData.maritalStatus),
      translate("activities", formData.activities),
      translate("apps", formData.apps),
      translate("dailyUsage", formData.dailyUsage),
      translate("importance", formData.importance),
      translate("purchaseFactors", formData.purchaseFactors),
      formData.satisfaction, // numeric, no need to translate
      translate("onlinePurchaseIssues", formData.onlinePurchaseIssues),
      translate("income", formData.income),
      translate("occupation", formData.occupation),
      
    ];
    return row.map((v) => `"${v}"`).join(",");
  }

  function formDataToCSV(data: typeof formData): string {
    const headers = [
      "Gender",
      "Age_range",
      "Status",
      "Top3_smartphone_activities",
      "Frequent_apps",
      "Daily_usage_duration",
      "Smartphone_importance",
      "Key_factor_online_purchase",
      "Brand_satisfaction",
      "Purchase_problem",
      "Monthly_income",
      "Occupation",
     
    ];

    const values = [
      data.gender,
      data.ageRange,
      data.maritalStatus,
      data.activities.join(", "),
      data.apps.join(", "),
      data.dailyUsage,
      data.importance,
      data.purchaseFactors,
      data.satisfaction,
      data.onlinePurchaseIssues,
      data.income,
      data.occupation,

    ];

    return `${headers.join(",")}\n${values.map((v) => `"${v}"`).join(",")}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const csvContent = mapToCsvRow(formData); // ใช้ฟังก์ชันจากโพสต์ก่อน
    const csv = formDataToCSV(formData);
    setCsvPreview(csv);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const formDataUpload = new FormData();
    formDataUpload.append("file", blob, "predict.csv");

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formDataUpload,
      });
      const result = await res.json();
      console.log("🎯 Prediction:", result);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
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
      {csvPreview && (
        <div className="csv-preview">
          <h3>CSV Preview</h3>
          <pre>{csvPreview}</pre>
        </div>
      )}
      <div className="toggle-dark" onClick={() => setDark(!dark)}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </div>
    </div>
  );
};

export default App;
