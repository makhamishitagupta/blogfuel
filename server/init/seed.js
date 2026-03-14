import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config({ path: "../.env" });

const seedAdmin = async () => {
  try {

    const DB_URL = process.env.MONGO_DB_URL;

    if (!DB_URL) {
      console.error("MONGO_DB_URL is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(DB_URL);

    console.log("MongoDB Connected");

    const adminEmail = "admin@blog.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("Admin created successfully");

    process.exit();

  } catch (error) {

    console.error("Seed error:", error);
    process.exit(1);

  }
};

seedAdmin();