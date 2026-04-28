import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables natively in Node 22+
try {
  process.loadEnvFile(".env");
} catch(e) {}
try {
  process.loadEnvFile(".env.local");
} catch(e) {}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ ERROR: MONGODB_URI is not defined in your .env or .env.local file.");
  process.exit(1);
}

// User schema matching our Next.js model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "admin"], default: "student" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  console.log("⏳ Connecting to Database...");
  
  try {
    await mongoose.connect(uri);
    console.log("✅ Database Connected Successfully!");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@isoftware.com" });
    
    if (adminExists) {
      console.log("✅ Admin user already exists database-level.");
      console.log(`- Email: ${adminExists.email}`);
      console.log(`- Name: ${adminExists.name}`);
      console.log(`- Role: ${adminExists.role}`);
    } else {
      console.log("⏳ Creating new Admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);

      const newAdmin = await User.create({
        name: "Super Admin",
        email: "admin@isoftware.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ New Admin user successfully inserted into MongoDB!");
      console.log(`- Db _id: ${newAdmin._id}`);
      console.log(`- Email: ${newAdmin.email}`);
      console.log(`- Role: ${newAdmin.role}`);
    }
  } catch (error) {
    console.error("❌ Database Operation Failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database Disconnected.");
    process.exit(0);
  }
}

seed();
