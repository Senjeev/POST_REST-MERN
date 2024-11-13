import express from "express";
import {getUser,getUserFriends,addRemoveFriend} from "../controllers/user.js";
import { verify } from "../middleware/auth.js";

const router=express.Router ();
//Read
router.get("/:id",verify,getUser);
router.get("/:id/friends",verify,getUserFriends);

//Update
router.patch("/:id/:friendId",verify,addRemoveFriend);

export default router;
