const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { crearPost, obtenerPosts } = require("../controllers/postController");

router.post("/create", auth, crearPost);
router.get("/all", obtenerPosts);

module.exports = router;
