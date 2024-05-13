import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      }).populate("comments.user", "-password");
    if (posts.length === 0) return res.status(200).json([]);

    return res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in getAllPost controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!text && !img)
      return res.status(400).json({ error: "Post must have text or image" });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        upload_preset: "post",
      });
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: req.user._id,
      text,
      img,
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error in createPost controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //  Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        postId,
      });
      await notification.save();

      const updatedLikes = post.likes;
      return res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log(`Error in likeUnlikePost controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: "Text field is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = { user: userId, text };
    post.comments.push(comment);

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    console.log(`Error in commentOnPost controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error in deletePost controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
