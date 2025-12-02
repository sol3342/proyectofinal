// backend/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ---------- VALIDACIONES ---------- */
function isAdult(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
}

function isGmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith("@gmail.com");
}

function validatePassword(password) {
  // mínimo 8 carácteres y al menos un símbolo (no alfanumérico)
  const re = /^(?=.{8,}$)(?=.*[^A-Za-z0-9]).*$/;
  return re.test(password);
}

/* ---------- REGISTRAR ---------- */
export const registerUser = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      fechaNacimiento,
      email,
      password,
      securityQuestion, // opcionalmente en frontend - nosotros proponemos una pregunta fija si no viene
      securityAnswer
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellidos || !fechaNacimiento || !email || !password || !securityAnswer) {
      return res.status(400).json({ msg: "Todos los campos obligatorios deben completarse" });
    }

    if (!isAdult(fechaNacimiento)) {
      return res.status(400).json({ msg: "Debes ser mayor de 18 años para registrarte" });
    }

    if (!isGmail(email)) {
      return res.status(400).json({ msg: "Solo se permiten correos Gmail (terminan en @gmail.com)" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres y al menos 1 símbolo" });
    }

    // Verificar si ya existe el email
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ msg: "El correo ya está registrado" });

    // Hash de password y de la respuesta de seguridad
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const answerHash = await bcrypt.hash(securityAnswer, salt);

    // Si no viene question, ponemos una por defecto (la que acordamos)
    const questionToStore = securityQuestion || "¿Cuál es el nombre de tu mascota?";

    const newUser = new User({
      nombre,
      apellidos,
      fechaNacimiento,
      email: email.toLowerCase(),
      password: passwordHash,
      securityQuestion: questionToStore,
      securityAnswerHash: answerHash
    });

    await newUser.save();

    // No devolvemos la password ni la respuesta
    return res.status(201).json({
      msg: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
};

/* ---------- LOGIN ---------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email y contraseña requeridos" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "No existe una cuenta con ese correo" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email
      }
    });

  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
};

/* ---------- RECUPERAR CONTRASEÑA (verify + reset de una vez) ----------
   Endpoint: POST /api/auth/forgot
   Body: { email, securityAnswer, newPassword }
   Comportamiento: verifica que exista usuario, verifica respuesta de seguridad (hashed),
   valida newPassword, hashea y actualiza password.
*/
export const forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ msg: "Email, respuesta de seguridad y nueva contraseña son requeridos" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "No existe una cuenta con ese correo" });

    // Compara la respuesta
    const answerMatch = await user.compareSecurityAnswer(securityAnswer);
    if (!answerMatch) return res.status(400).json({ msg: "Respuesta de seguridad incorrecta" });

    // validar nueva contraseña
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ msg: "La nueva contraseña debe tener al menos 8 caracteres y al menos 1 símbolo" });
    }

    // Hashear y actualizar
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    user.password = newHash;

    await user.save();

    return res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
};
