import mongoose from "mongoose";

try {
  process.loadEnvFile(".env");
} catch(e) {}
try {
  process.loadEnvFile(".env.local");
} catch(e) {}

const uri = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  email: String,
  role: String,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

async function check() {
  await mongoose.connect(uri);
  const users = await User.find({ role: "admin" });
  console.log("Admins in DB:");
  users.forEach(u => console.log(u.email));
  process.exit(0);
}
check();
