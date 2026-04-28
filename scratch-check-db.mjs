import mongoose from "mongoose";
import Course from "./models/Course.ts"; // Need to check path

try {
  process.loadEnvFile(".env");
} catch(e) {}
try {
  process.loadEnvFile(".env.local");
} catch(e) {}

const uri = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(uri);
  const courses = await mongoose.model("Course").find({});
  console.log("Courses:", courses.map(c => ({ id: c._id, title: c.title })));
  process.exit(0);
}
run();
