import express from "express";
import { verify } from "../middleware/auth.js";
import {getFeedposts, getUserPosts, likePost} from "../controllers/posts.js"

const router=express.Router();

//read
router.get("/",verify,getFeedposts);
router.get("/:userId/posts",verify,getUserPosts);

//update
router.patch("/:id/like",verify,likePost);

export default router;
