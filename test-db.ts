import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("No MONGODB_URI found in process.env");
  process.exit(1);
}

console.log("Attempting to connect to:", uri.replace(/:([^:@]{3,})@/, ":***@")); // Log mask password

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB");
    // List databases
    return mongoose.connection.db?.admin().listDatabases();
  })
  .then(result => {
    console.log("Databases available:");
    result?.databases.forEach(db => console.log(` - ${db.name}`));
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:");
    console.error(err);
    process.exit(1);
  });
