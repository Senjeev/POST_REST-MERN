import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// Register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passHash, // Save the hashed password
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save the user to the database
    const saveuser = await newUser.save();

    // Return the saved user data as a response
    res.status(201).json(saveuser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///Logging

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    console.log(token);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
