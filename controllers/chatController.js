import Chat from "../models/chatModel.js";

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
  const userId = req.user._id; // Get the user ID from the request object
  const chats = await Chat.find({ users: userId })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 }) // Sort by updatedAt to get the most recent chats first
    .lean();

  const updatedChats = chats.map((chat) => ({
    ...chat,
    unreadCount: chat.unreadCounts?.[userId.toString()] || 0,
  }));

  res.status(200).json(updatedChats);
};

const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "Please provide all details" });
  }

  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 users are required for a group chat" });
  }

  parsedUsers.push(req.user._id);

  const groupChat = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users: parsedUsers,
    groupAdmin: req.user._id,
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
};

const markChatAsRead = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findById(chatId);
  if (chat.unreadCounts.has(userId.toString())) {
    chat.unreadCounts.set(userId.toString(), 0);
    await chat.save();
  }

  res.json({ success: true });
};

export { createChat, accessChat, fetchChats, createGroupChat, markChatAsRead };
