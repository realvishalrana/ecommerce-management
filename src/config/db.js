import mongoose from "mongoose";

const connectDb = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: `);
  } catch (erorr) {
    console.log(`Connect Db ${erorr}`);
    process.exit(1);
  }
};

export default connectDb;
