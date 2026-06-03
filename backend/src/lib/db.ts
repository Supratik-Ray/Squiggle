import mongoose from "mongoose";

export async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Successfully connected to db");
  } catch (error) {
    console.log("Couldn't connect to db!");
    process.exit(1);
  }
}
