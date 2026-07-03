// MongoDB shell script for HealHub seed data
// Run with: mongosh < backend/seed_data/insert_many_scripts.js

const dbName = "healhub";
const seedDir = "./seed_data";
const db = db.getSiblingDB(dbName);

const collections = [
  { name: "users", file: "users.json" },
  { name: "doctors", file: "doctors.json" },
  { name: "appointments", file: "appointments.json" },
  { name: "faqs", file: "faqs.json" },
  { name: "chat_sessions", file: "chat_sessions.json" },
  { name: "contact", file: "contact.json" },
  { name: "website_content", file: "content.json" },
  { name: "admins", file: "admins.json" }
];

for (const { name, file } of collections) {
  const docs = JSON.parse(cat(`${seedDir}/${file}`));
  if (!docs || docs.length === 0) continue;

  const existingCount = db.getCollection(name).countDocuments();
  if (existingCount > 0) {
    print(`Skipping ${name}: collection already has ${existingCount} document(s)`);
    continue;
  }

  const result = db.getCollection(name).insertMany(docs);
  print(`Inserted ${result.insertedCount} document(s) into ${name}`);
}
