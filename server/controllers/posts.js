import Post from "../models/Post.js";
import User from "../models/User.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userUId, description, picturePath } = req.body;
    const user = await User.findById(userUId);

    if(!user)
      return res.status(400).json({ "message" : "User not found" })
    
    const newPost = new Post({
      userId: userUId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    
    await newPost.save();

    const posts = await Post.find();
    res.status(201).json(posts); 
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Read - Fetch all feed posts
export const getFeedposts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts); 
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Read - Fetch user-specific posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts); 
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Update - Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { userId } = req.body; 

    const post = await Post.findById(id);
    
    const isLiked = post.likes.get(userId);
    
    if (isLiked) {
      post.likes.delete(userId); 
    } else {
      post.likes.set(userId, true); 
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true } 
    );

    res.status(200).json(updatedPost); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
