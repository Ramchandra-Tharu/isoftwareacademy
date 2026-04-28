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

const email = "admin@isoftware.com";
const password = "admin";
const name = "Super Admin";

console.log("=========================================");
console.log(`Setting up Admin with fixed credentials:`);
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
console.log("=========================================");

// User schema matching our Next.js model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  console.log("⏳ Connecting to Database...");
  
  try {
    await mongoose.connect(uri);
    console.log("✅ Database Connected Successfully!");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(`⚠️ User with email ${email} already exists.`);
      let updated = false;

      if (existingUser.role !== "admin") {
        console.log("⏳ Upgrading user to admin...");
        existingUser.role = "admin";
        updated = true;
      }

      if (password) {
        console.log("⏳ Updating user password...");
        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(password, salt);
        updated = true;
      }
      
      if (!existingUser.isVerified) {
        existingUser.isVerified = true;
        updated = true;
      }

      if (updated) {
        await existingUser.save();
        console.log("✅ User successfully updated and/or upgraded to Admin!");
      } else {
        console.log("✅ User is already an Admin and no updates were needed.");
      }
    } else {
      console.log(`⏳ Creating new Admin user (${email})...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });

      console.log("✅ New Admin user successfully inserted into MongoDB!");
      console.log(`- Db _id: ${newAdmin._id}`);
      console.log(`- Email: ${newAdmin.email}`);
      console.log(`- Role: ${newAdmin.role}`);
      console.log(`- Verified: ${newAdmin.isVerified}`);
    }
  } catch (error) {
    console.error("❌ Database Operation Failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database Disconnected.");
    process.exit(0);
  }
}

createAdmin();
