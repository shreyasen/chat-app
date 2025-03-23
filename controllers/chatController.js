import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroupChat: false,
        users: [req.user._id, userId],
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Access a One-to-One Chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!chat) {
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    chat = await Chat.findById(newChat._id).populate("users", "-password");
  }

  res.status(200).json(chat);
};

// Fetch all Chats of Logged-in User
const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user._id })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
};

export { createChat, accessChat, fetchChats };
