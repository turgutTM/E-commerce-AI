import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    blogPhoto: {
      type: String,
      required: false,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
