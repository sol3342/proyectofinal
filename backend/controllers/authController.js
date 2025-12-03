import User from "./models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { nombre, apellidos, fechaNacimiento, email, password, pista, respuesta } = req.body;

        // Email único
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ error: "El correo ya está registrado." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedResp = await bcrypt.hash(respuesta, 10);

        const newUser = new User({
            nombre,
            apellidos,
            fechaNacimiento,
            email,
            password: hashedPassword,
            pista,
            respuesta: hashedResp
        });

        await newUser.save();

        res.json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};
