import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, profilePic } = req.body;
  console.log(name, email, password, profilePic);

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, profilePic });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login User
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const user = await User.findById(req.user._id);

// if (user) {
//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     profilePic: user.profilePic,
//   });
// } else {
//   res.status(404).json({ message: "User not found" });
// }

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { registerUser, authUser, getUserProfile, getAllUsers };
