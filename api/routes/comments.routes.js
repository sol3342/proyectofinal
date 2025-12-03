import { Router } from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Agregar comentario
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      author: req.userId,
      post: req.params.postId,
    });

    await comment.save();
    res.json({ message: "Comentario agregado", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener comentarios por post
router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate("author", "username");
  res.json(comments);
});

export default router;
