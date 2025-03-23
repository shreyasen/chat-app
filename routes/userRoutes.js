import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  getAllUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, getAllUsers);

export default router;
