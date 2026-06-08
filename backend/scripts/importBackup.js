require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");

const BACKUP_DIR = path.join(__dirname, "..", "mongodb-backup");
const BATCH_SIZE = 500;

const COLLECTIONS = [
  { file: "users.json", name: "users" },
  { file: "comments.json", name: "comments" },
  { file: "blogs.json", name: "blogs" },
  { file: "portfolios.json", name: "portfolios" },
];

async function importCollection(db, { file, name }) {
  const filePath = path.join(BACKUP_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${name}: ${file} not found`);
    return 0;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const documents = EJSON.parse(raw);

  if (!Array.isArray(documents) || documents.length === 0) {
    console.log(`Skipping ${name}: no documents in ${file}`);
    return 0;
  }

  const collection = db.collection(name);
  await collection.deleteMany({});

  let imported = 0;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    await collection.insertMany(batch, { ordered: false });
    imported += batch.length;
  }

  console.log(`Imported ${imported} documents into "${name}"`);
  return imported;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    console.log(`Using database: ${db.databaseName}`);

    let total = 0;
    for (const entry of COLLECTIONS) {
      total += await importCollection(db, entry);
    }

    console.log(`\nImport complete. Total documents imported: ${total}`);
  } catch (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
