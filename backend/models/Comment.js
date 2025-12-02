import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
