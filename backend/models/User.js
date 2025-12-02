import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pista: { type: String, required: true },
    respuesta: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
