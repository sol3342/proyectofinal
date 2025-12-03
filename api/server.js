import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Cargar .env
dotenv.config();

// Crear app
const app = express();

app.use(express.json());
app.use(cors());

// Importar rutas (OJO CON LOS NOMBRES)
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/auth.routes.js";      // ✔ CORRECTO
import commentRoutes from "./routes/comments.routes.js";
import profileRoutes from "./routes/profile.routes.js";

// Usar rutas
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);                      // ✔ NECESARIO
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// Exportar para Vercel
export default app;
