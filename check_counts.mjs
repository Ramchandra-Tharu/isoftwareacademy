import dbConnect from "./utils/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";

async function checkCounts() {
  await dbConnect();
  const studentCount = await User.countDocuments({ role: "student" });
  const totalUsers = await User.countDocuments();
  const enrollmentCount = await Enrollment.countDocuments();
  const courses = await Course.find();
  
  console.log({
    totalUsers,
    studentCount,
    enrollmentCount,
    courseCount: courses.length
  });

  process.exit(0);
}

checkCounts();
