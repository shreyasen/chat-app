import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats,
  createChat,
  createGroupChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/new", protect, createChat);
router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);

export default router;
