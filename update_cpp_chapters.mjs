import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://sirzan143:Sirzan1431@cluster0.lm4udem.mongodb.net/isoftwarelabacademy?appName=Cluster0";

const CourseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function update() {
  try {
    await mongoose.connect(MONGODB_URI);
    const result = await Course.updateMany(
      { $or: [{ title: /C\+\+/i }, { slug: /cpp/i }] },
      { $set: { totalChapters: 8 } }
    );
    console.log(`Updated ${result.modifiedCount} courses.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

update();
