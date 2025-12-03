// /api/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/comments.routes.js";
import profileRoutes from "./routes/profile.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error de conexión:", err));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);

// Mensaje de prueba
app.get("/", (req, res) => {
  res.json({ msg: "Backend funcionando correctamente" });
});

export default app;
