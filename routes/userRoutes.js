import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  getAllUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, getAllUsers);

export default router;
