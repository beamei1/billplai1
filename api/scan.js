// ไฟล์: api/scan.js (เปลี่ยนเป็น gemini-1.5-flash เพื่อใช้สิทธิ์ Free Tier)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image, mimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Vercel' });
  }

  try {
    // 💥 บรรทัดนี้สำคัญมาก! ต้องใช้ gemini-1.5-flash เท่านั้น ถึงจะไม่ติด limit: 0
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { 
                text: `คุณคือ AI ช่วยอ่านใบเสร็จร้านอาหารและบิลค่าใช้จ่าย กรุณาวิเคราะห์รูปภาพนี้แล้วสกัดข้อมูลออกมาเป็น JSON เท่านั้น โดยมีกฎดังนี้:
1. "shop_name": ดึงชื่อร้านค้า หรือหัวบิล ถ้าไม่มีชื่อร้านเลยให้ใส่ว่า "ค่าอาหาร/เครื่องดื่ม"
2. "items": ให้ดึงรายการสินค้า/อาหารทั้งหมดที่มีในบิล พร้อมราคาต่อหน่วย (price) และจำนวนชิ้น (qty)
   - ถ้าในบิลไม่มีระบุจำนวนชิ้น ให้ถือว่า qty = 1
   - ถ้าเป็นบิลที่มีแต่ยอดรวม ไม่มีรายการย่อย ให้ใส่ name = "ค่าใช้จ่ายรวม", price = ยอดรวมทั้งหมด, qty = 1
3. ตอบกลับมาเป็นโครงสร้าง JSON นี้เท่านั้น ห้ามมีข้อความอธิบายใดๆ ทั้งสิ้น:
{"shop_name": "ชื่อร้าน", "items": [{"name": "ชื่อรายการ", "price": 100, "qty": 1}]}` 
              },
              { inline_data: { mime_type: mimeType, data: image } }
            ]
          }],
          generationConfig: { 
            response_mime_type: "application/json",
            temperature: 0.1 
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: `Google API Error: ${data.error.message}` });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
