const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()
const Mongodburl = process.env.URL;
const dbconnection=async()=>{
try{
    await mongoose.connect(Mongodburl);
    console.log("Data Base Connected Successfully");
}catch(e){
    console.log("Error Occurred At Connecting Database:", e.message);
    console.log("Make sure MongoDB is running on:", Mongodburl);
}
}
module.exports= dbconnection