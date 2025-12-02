import { Router } from "express";
import Post from "../models/Post.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Crear post (requiere login)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.userId,
    });

    await newPost.save();
    res.json({ message: "Publicación creada", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los posts
router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.json(posts);
});

export default router;
