// api/_db.js
const { MongoClient, ServerApiVersion } = require("mongodb");

let client, db;
async function getDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  client = client || new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  db = client.db(process.env.MONGODB_DB || "sodcham");
  return db;
}

module.exports = { getDb };
