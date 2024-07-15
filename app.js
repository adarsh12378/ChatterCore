import express from "express";
import userRoutes from "./routes/user.js"
import chatRoutes from "./routes/chat.js"
import adminRoute from "./routes/admin.js"
import { connectDB } from "./utils/features.js";
import dotenv from 'dotenv'
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {createServer} from 'http'
import { createGroupChats, createMessagesInAChat, createSingleChats } from "./seeders/chat.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid} from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./model/message.js";
//  import { createUser } from "./seeders/user.js";
dotenv.config({
    path:"./.env",
});
const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
 const adminSecretKey=process.env.ADMIN_SECRET_KEY||"adarshgupta"
const envMode=process.env.NODE_ENV.trim()||"PRODUCTION"

const userSocketIDs=new Map();
connectDB(mongoURI)
const app=express();
const server=createServer(app);
const io=new Server(server,{});
//   createMessagesInAChat("666aa26fecc5fbf968a37fc5",50)
// createUser(10);
//using middleware here
// createSingleChats(10)
// createGroupChats(10)
app.use(express.json()); 
app.use(cookieParser()); //his middleware is used to parse incoming requests with JSON payloads. It parses the incoming request body and makes it available under req.body property.
app.use('/user',userRoutes);
app.use('/chat',chatRoutes)
app.use('/admin',adminRoute)

app.get("/",(req,res)=>{
res.send("hello world 2 ")
})

// io.use((socket,next)=>{
  
// })
io.on("connection",(socket)=>{
    const user={
        _id:"asjbd",
        name:"adarsh",
    };
    userSocketIDs.set(user._id.toString(),socket.id)
    console.log(userSocketIDs);
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = {
          content: message,
          _id: uuid(),
          sender: {
            _id: user._id,
            name: user.name,
          },
          chat: chatId,
          createdAt: new Date().toISOString(), 
          //firat pass the event then pass the listner
        };    


        const messageForDB = {
            content: message, 
            sender: user._id,
            Chat: chatId,
          };

          const memberSocket=getSockets(members);
          io.to(memberSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealTime,
          });
          io.to(memberSocket).emit(NEW_MESSAGE_ALERT,{chatId});
          try {
            await Message.create(messageForDB);
          } catch (error) {
            throw new Error(error);
          }
    });

    socket.on("disconnect",()=>{ 
        console.log("user disconnected")
        userSocketIDs.delete(user._id.toString());
    })
})  
app.use(errorMiddleware);

server.listen(port,()=>{
    console.log(`server is running on the port ${port} IN ${envMode} mode`);
});

export {envMode,adminSecretKey,userSocketIDs}

