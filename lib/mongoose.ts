import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL)
    return console.log(
      "file: mongoose.ts:10 ~ connectToDB ~ : MOGODB_URL not found"
    );

  if (isConnected)
    return console.log(
      "file: mongoose.ts:15 ~ connectToDB ~ : Already conneted to MongoDB"
    );

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    console.log("file: mongoose.ts:22 ~ connectToDB ~ : Conneted to MongoDB");
  } catch (error) {
    console.log("file: mongoose.ts:24 ~ connectToDB ~ : " + error);
  }
};
