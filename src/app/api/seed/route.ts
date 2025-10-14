import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      return NextResponse.json({ error: 'Brak MONGO_URI' }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db("Tavros");
    const collection = db.collection("products");

    // Generator prostych losowych produktów
    function generateFakeProduct() {
      const names = ["T-shirt", "Jacket", "Trouser", "Hat", "Shoes"];
      const categories = ["Sprzęt", "Akcesoria", "Chemia", "Odzież", "Inne"];
      
      function randomItem(arr: string[]) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      return {
        name: randomItem(names) + " " + Math.floor(Math.random() * 1000),
        price: parseFloat((Math.random() * 150 + 10).toFixed(2)),
        description: "Świetny produkt z kategorii " + randomItem(categories),
        category: randomItem(categories),
        image: `https://picsum.photos/seed/${Math.random()}/400/400`,
        createdAt: new Date(),
      };
    }

    const fakeProducts = [];
    for (let i = 0; i < 100; i++) {
      fakeProducts.push(generateFakeProduct());
    }

    const result = await collection.insertMany(fakeProducts);
    await client.close();

    return NextResponse.json({ 
      message: `Dodano ${result.insertedCount} nowych produktów`,
      insertedCount: result.insertedCount 
    });

  } catch (error) {
    console.error('Błąd seedowania:', error);
    return NextResponse.json({ 
      error: 'Błąd podczas seedowania',
      details: error instanceof Error ? error.message : 'Nieznany błąd'
    }, { status: 500 });
  }
}
