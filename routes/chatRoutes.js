import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats,
  createChat,
  createGroupChat,
  markChatAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/new", protect, createChat);
router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.put("/:chatId/read", protect, markChatAsRead);
router.post("/group", protect, createGroupChat);

export default router;
