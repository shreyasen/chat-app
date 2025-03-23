import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// Send a Message
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data passed" });
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const populatedMessage = await message.populate("sender", "name");
    await populatedMessage.populate("chat");
    await User.populate(populatedMessage, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    // Emit to chat room instead of individual users
    const io = req.app.get("io");
    io.to(chatId).emit("messageReceived", populatedMessage);

    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Messages for a Chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name profilePic")
    .populate("chat");

  res.status(200).json(messages);
};

export { sendMessage, getMessages };
