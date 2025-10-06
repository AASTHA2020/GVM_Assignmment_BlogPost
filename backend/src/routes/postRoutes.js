import express from "express";
import { getPosts, createPost, updatePost, deletePost, likePost, addComment } from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);

export default router;
