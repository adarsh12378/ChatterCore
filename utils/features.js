import mongoose from "mongoose"
import jwt from "jsonwebtoken";
const cookieOption={
    maxAge:15*24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true,
}
const connectDB=(url)=>{
mongoose.connect(url,{
    dbname:"hostelapplication"}).then((data)=>
console.log(`Connected to DB :${data.connection.host}`)
    ).catch((err)=>{
        throw err;
    });
};

const sendToken=(res,user,code,message)=>{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
    return res.status(code).cookie("hostel-token",token,cookieOption).json({
        success:true,
        message,
     }); 
}

const emitEvent=(req,event,user,data)=>{
console.log("emmiting event",event);
}

const deleteFilesFromCloudinary=async(public_id)=>{
    //delete files from cloudinary
}
export {connectDB,sendToken,cookieOption,emitEvent,deleteFilesFromCloudinary};