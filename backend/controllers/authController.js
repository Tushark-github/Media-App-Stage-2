import User from "../models/userModel.js";
import { generateTokenAndSetCookie } from '../lib/generateToken.js';
import bcrypt from 'bcrypt';


export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    console.log(fullName);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username is already taken" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password size must be grater than 6" })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    if (newUser) {
      await newUser.save();

      // Generate token and set cookie
      generateTokenAndSetCookie(newUser._id, res);

      // Return success response
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg
      });
    }
    else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const validPassword = await bcrypt.compare(password, user?.password || "");
      if (validPassword) {
        generateTokenAndSetCookie(user._id, res);
        return res.status(201).json({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          followers: user.followers,
          following: user.following,
          profileImg: user.profileImg,
          coverImg: user.coverImg
        });
      }
      else {
        return res.status(400).json({ msg: "Password is incorrect" })
      }
    }
    else {
      return res.status(400).json({ msg: "Username is incorrect" });
    }


  } catch (error) {
    console.log("Error in Login controller ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ msg: "Logged out successfully" })

  } catch (error) {
    console.log("Error in Login controller ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in Login controller ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
