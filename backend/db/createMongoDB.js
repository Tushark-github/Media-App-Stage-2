import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${(await conn).connection.host}`)
  }
  catch (error) {
    console.log(`Error connecting ${error.message}`)
  }
}


export default connectMongoDB;