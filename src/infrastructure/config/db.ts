import { env } from "./env.js";
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const URI = env.mongo_uri;
    await mongoose.connect(URI as string);
    console.log("Mongodb connected!");
  } catch (err) {
    console.error("Mongodb connection failed❌", err);
    process.exit();
  }
};

export default connectDb;
