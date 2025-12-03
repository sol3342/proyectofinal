import express from "express";
import {
    registerUser,
    loginUser,
    getPista,
    validarRespuesta,
    cambiarPassword
} from "../controllers/authController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Recuperar contraseña
router.post("/get-pista", getPista);
router.post("/validar-respuesta", validarRespuesta);
router.post("/cambiar-pass", cambiarPassword);

export default router;
