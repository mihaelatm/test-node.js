import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error while connecting database: ", error.message);
  }
};

export default connectDB;
