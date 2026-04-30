import dbConnect from "./utils/db.js";
import Course from "./models/Course.js";
import mongoose from "mongoose";

async function publishAll() {
  try {
    await dbConnect();
    console.log("Connected to DB");
    
    const result = await Course.updateMany({}, { $set: { isPublished: true } });
    console.log(`Updated ${result.modifiedCount} courses to isPublished: true`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

publishAll();
