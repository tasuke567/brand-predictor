/* ---------- 1. แอป & กิจกรรม (เหมือนเดิม แต่แก้เคส/ช่องว่างเล็กน้อย) ---------- */
export const appMap = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  Facebook: "Facebook",
  YouTube: "YouTube",
  "Facebook Messenger": "Facebook Messenger",
  Spotify: "Spotify",
  WhatsApp: "WhatsApp",
  Telegram: "Telegram",
  Snapchat: "Snapchat",
  Other: "Other",
};

export const activityMap = {
  "ดูหนัง / ฟังเพลง": "Watch movies / Listen to music",
  "เล่นเกม": "Play games",
  "ถ่ายรูป / ถ่ายวิดีโอ": "Take photos / Videos",
  "Application บน cloud": "Cloud applications",
  "ติดต่อสื่อสาร / ประชุมงาน": "Communication / Meetings",
  "โซเชียลมีเดีย": "Social media",
};

/* ---------- 2. แผนที่คำแปลหลัก ---------- */
export const translateMap = {
  /** เพศ */
  gender: { ชาย: "Male", หญิง: "Female" },

  /** ช่วงอายุ */
  ageRange: {
    "18-25 ปี": "18-25",
    "26-32 ปี": "26-32",
    "33-40 ปี": "33-40",
    "41-50 ปี": "41-50",
    "50-60 ปี": "50-60",
    "60 ปีขึ้นไป": "60+",
  },

  /** สถานภาพสมรส */
  maritalStatus: {
    โสด: "Single",
    สมรส: "Married",
    หย่าร้าง: "Divorced",
    แยกกันอยู่: "Separated",
  },

  /** ระยะเวลาการใช้งาน */
  dailyUsage: {
    "0 - 1 ชั่วโมง": "0-1 hours",
    "1 - 3 ชั่วโมง": "1-3 hours",
    "3 - 5 ชั่วโมง": "3-5 hours",
    "มากกว่า 5 ชั่วโมง": "More than 5 hours",
  },

  /** ความสำคัญของสมาร์ตโฟน */
  importance: {
    จำเป็นมากที่สุด: "Most necessary",
    จำเป็น: "Necessary",
    ไม่จำเป็น: "Not necessary",
  },

  /** ปัจจัยซื้อ */
  purchaseFactors: {
    ราคา: "Price",
    รีวิวสินค้า: "Product review",
    ฟีเจอร์สินค้า: "Product feature",
  },

  /** ปัญหาในการซื้อออนไลน์ */
  onlinePurchaseIssues: {
    ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน:
      "Concerns about payment security",
    ไม่สามารถสัมผัสหรือลองสินค้าได้จริง: "Unable to inspect product",
    ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย:
      "Warranty or service concerns",
    ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง: "Delivery delay",
  },

  /** ช่วงรายได้ต่อเดือน */
  income: {
    "น้อยกว่า 15,000 บาท": "Less than 15000",
    "15,001 - 20,000 บาท": "15001-20000",
    "20,001 - 30,000 บาท": "20001-30000",
    "30,001 - 40,000 บาท": "30001-40000",
    "40,001 - 50,000 บาท": "40001-50000",
    "มากกว่า 50,001 บาทขึ้นไป": "More than 50001",
  },

  /** อาชีพ */
  occupation: {
    "นักเรียน / นักศึกษา": "Student",
    พนักงานบริษัทเอกชน: "Private company employee",
    พนักงานข้าราชการ: "Government officer",
    พนักงานรัฐวิสาหกิจ: "State enterprise officer",
    พนักงานโรงงานอุตสาหกรรม: "Factory worker",
    "เจ้าของธุรกิจ/ธุรกิจส่วนตัว": "Business owner",
  },
};

/* ---------- 3. Helper functions (ไม่เปลี่ยน) ---------- */
export function translate(field: string, value: any): string {
  if (Array.isArray(value)) return value.join(", ");
  const dict =
    translateMap[field as keyof typeof translateMap] as Record<string, string>;
  return dict?.[value] ?? value ?? "?";
}

export function translateList(
  inputList: string[],
  map: Record<string, string>,
): string {
  return inputList.map((item) => map[item] ?? item).join(", ");
}

export function mapToCsvRow(formData: Record<string, any>): string {
  const row = [
    translate("gender", formData.gender),
    translate("ageRange", formData.ageRange),
    translate("maritalStatus", formData.maritalStatus),
    translateList(formData.activities, activityMap),
    translateList(formData.apps, appMap),
    translate("dailyUsage", formData.dailyUsage),
    translate("importance", formData.importance),
    translate("purchaseFactors", formData.purchaseFactors),
    formData.satisfaction,
    translate("onlinePurchaseIssues", formData.onlinePurchaseIssues),
    translate("income", formData.income),
    translate("occupation", formData.occupation),
  ];
  return row.map((v) => `"${v}"`).join(",");
}

export function formDataToCSV(data: Record<string, any>): string {
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
  const row = mapToCsvRow(data);
  return `${headers.join(",")}\n${row}`;
}
