import mongoose from "mongoose";
import dns from "dns" 

const dbconnection = async () => { 
  dns.setServers(["1.1.1.1", "8.8.8.8"])
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};

export default dbconnection;