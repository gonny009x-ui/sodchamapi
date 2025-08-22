// api/order.js
const { getDb } = require("./_db");

module.exports = async (req, res) => {
  // CORS (ให้หน้าเว็บคนละโดเมนเรียกได้)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    if (req.method === "POST") {
      const { name, phone, size, qty } = req.body || {};
      if (!name || !phone || !size || !qty)
        return res.status(400).json({ ok: false, error: "กรอกข้อมูลไม่ครบ" });

      const result = await db.collection("orders").insertOne({
        name, phone, size, qty: Number(qty),
        status: "new",
        createdAt: new Date(),
      });

      return res.status(201).json({ ok: true, id: String(result.insertedId) });
    }

    if (req.method === "GET") {
      const rows = await db
        .collection("orders")
        .find({}, { projection: { name: 1, size: 1, qty: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();
      return res.json({ ok: true, orders: rows });
    }

    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "server error" });
  }
};
