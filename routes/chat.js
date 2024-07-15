import express from "express";
import {getMyProfile, login, logout, newUser,searchUser} from "../controllers/user.js";
import { attachmentsMulter, singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.js";
import { newGroupValidator,addMemberValidator,removeMemberValidator,validateHandler,sendAttachmentsValidator, chatIdValidator,renameValidator} from "../lib/validators.js";

const app=express.Router();

//after here user must be login to access this route
app.use(isAuthenticated)

app.post("/new",newGroupValidator(),validateHandler,newGroupChat)

app.get("/my",getMyChats)

app.get("/my/groups",getMyGroups)

app.put("/addmembers",addMemberValidator(),validateHandler,addMembers)

app.put("/removemember",removeMemberValidator(),validateHandler,removeMember)

app.delete("/leave/:id",chatIdValidator(),validateHandler,leaveGroup)

app.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments)

app.get("/message/:id",chatIdValidator(),validateHandler,getMessages)

app.route("/:id").get(chatIdValidator(),validateHandler,getChatDetails).put(renameValidator(),validateHandler,renameGroup).delete(chatIdValidator(),validateHandler,deleteChat)


export default app;
