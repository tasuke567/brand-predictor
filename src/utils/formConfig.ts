// formConfig.ts

export const initialState = {
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
  
  export const sections = [
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
  
  export const labels = {
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
  
  export const options = {
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
  