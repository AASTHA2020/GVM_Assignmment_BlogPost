import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  tags: [String],
  image: {
    type: String,
    default: null
  },
  likes: [{
    type: String
  }],
  comments: [commentSchema]
}, {
  timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;

