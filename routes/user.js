import express from "express";
import {acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser,searchUser, sendFriendRequest} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidator,validateHandler,loginValidator,sendRequestValidator,acceptRequestValidator  } from "../lib/validators.js";
const app=express.Router();

app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser);  //So, when a POST request is made to the "/new" path:

// First, it will pass through the singleAvatar middleware.
// Then, it will reach the newUser route handler function.

app.post("/login",loginValidator(),validateHandler,login);

app.use(isAuthenticated)
//after here user must be logged in to accces the route
app.get("/me",getMyProfile)
app.get("/logout",logout)
app.get("/search",searchUser)
app.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest)
app.put("/acceptrequest",acceptRequestValidator(),validateHandler,acceptFriendRequest)
app.get("/notification",getMyNotifications)
app.get("/friends",getMyFriends)


export default app;
