import { MongoClient } from "mongodb";

const uri = "mongodb+srv://wooojtek1993_db_user:TpRC7J5CmqAbpLQR@cluster0.mongodb.net/products?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log("🔄 Próba połączenia...");
    await client.connect();
    console.log("✅ Połączenie udane!");
    
    const db = client.db("Tavros");
    const collections = await db.listCollections().toArray();
    console.log("📋 Kolekcje:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("❌ Błąd połączenia:", err.message);
  } finally {
    await client.close();
  }
}

testConnection();
