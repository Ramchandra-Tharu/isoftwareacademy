import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://sirzan143:Sirzan1431@cluster0.lm4udem.mongodb.net/isoftwarelabacademy?appName=Cluster0";

const CourseSchema = new mongoose.Schema({
  title: String,
  slug: String,
  totalLessons: Number
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const allCourses = await Course.find({}, 'title slug _id');
    
    if (allCourses.length === 0) {
      console.log("No courses found in the database!");
    } else {
      console.log("\n--- List of All Courses ---");
      allCourses.forEach(course => {
        console.log(`Title: "${course.title}" | Slug: "${course.slug}" | ID: ${course._id}`);
      });
      console.log("---------------------------\n");
    }

    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

check();
