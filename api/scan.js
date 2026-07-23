// ไฟล์: api/scan.js
export default async function handler(req, res) {
  // รับเฉพาะคำสั่ง POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image, mimeType } = req.body;
  // ดึง API Key จากระบบหลังบ้านของ Vercel (ไม่มีใครเห็นรหัสนี้)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Vercel' });
  }

  try {
    // เซิร์ฟเวอร์ Vercel เป็นคนส่งรูปไปหา Gemini API ให้เอง
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "ทำหน้าที่เป็นระบบอ่านใบเสร็จ ดึงชื่อร้านค้า และรายการอาหารทั้งหมดพร้อมราคาต่อหน่วย และจำนวนชิ้น ตอบกลับมาเป็น JSON Format นี้เท่านั้น ห้ามมีข้อความอื่น: {\"shop_name\": \"ชื่อร้าน\", \"items\": [{\"name\": \"ชื่อรายการ\", \"price\": ราคาต่อชิ้นเป็นตัวเลข, \"qty\": จำนวนชิ้นเป็นตัวเลข}]}" },
              { inline_data: { mime_type: mimeType, data: image } }
            ]
          }],
          generationConfig: { response_mime_type: "application/json" }
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
