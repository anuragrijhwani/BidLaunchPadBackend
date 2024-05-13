import mongoose from "mongoose";
 const URI = "mongodb://localhost:27017/Practice"
//const URI = process.env.MONGODB_URI ;

export const connectDB = async () =>{
    try {
        await mongoose.connect(URI);
        console.log("connected successful")
    } catch (error) {
        console.log(error);
        console.error("connected failed");
        process.exit(0);
    }
}