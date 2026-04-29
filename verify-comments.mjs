import mongoose from 'mongoose';
import dbConnect from './utils/db.js';
import Comment from './models/Comment.js';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import { checkSpam } from './utils/spamFilter.js';

async function verifyCommentSystem() {
  try {
    console.log("🚀 Starting Comment System Verification...");
    await dbConnect();
    console.log("✅ DB Connected.");

    // 1. Verify Spam Filter
    console.log("\n--- Testing Spam Filter ---");
    const spamText = "Click here for free money and crypto casino poker!";
    const legitText = "I really enjoyed this lesson on Next.js patterns. Very helpful!";
    
    const spamResult = checkSpam(spamText);
    const legitResult = checkSpam(legitText);
    
    console.log(`Spam check: ${spamResult.isSpam ? "✅ Flagged correctly" : "❌ Failed to flag"}`);
    console.log(`Legit check: ${!legitResult.isSpam ? "✅ Passed correctly" : "❌ Flagged incorrectly"}`);

    // 2. Check Model Schema (Attempt to find one)
    console.log("\n--- Testing DB Query ---");
    const testComment = await Comment.findOne({});
    if (testComment) {
        console.log(`✅ Found existing comment. Status: ${testComment.status || 'default'}`);
        // Update it with a status if it doesn't have one
        if (!testComment.status) {
            testComment.status = 'pending';
            await testComment.save();
            console.log("✅ Updated legacy comment to 'pending' status.");
        }
    } else {
        console.log("ℹ️ No comments in DB yet. Creating a test one...");
        const user = await User.findOne({});
        const course = await Course.findOne({});
        const lesson = await Lesson.findOne({});
        
        if (user && course && lesson) {
            const newComment = await Comment.create({
                userId: user._id,
                courseId: course._id,
                lessonId: lesson._id,
                content: "System verification test comment.",
                status: "pending",
                rating: 5
            });
            console.log("✅ Created test comment.");
        } else {
            console.log("⚠️ Missing seed data (User/Course/Lesson) to create test comment.");
        }
    }

    console.log("\n✅ Verification Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Verification Failed:", error);
    process.exit(1);
  }
}

verifyCommentSystem();
