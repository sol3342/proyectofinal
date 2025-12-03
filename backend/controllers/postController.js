const Post = require("../../api/models/Post");

exports.crearPost = async (req, res) => {
    try {
        const { titulo, contenido, imagen } = req.body;
        const usuarioId = req.user.id;

        const nuevoPost = new Post({
            usuarioId,
            titulo,
            contenido,
            imagen
        });

        await nuevoPost.save();
        res.json({ msg: "Post creado", post: nuevoPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ fecha: -1 }).populate("usuarioId", "nombre email");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
