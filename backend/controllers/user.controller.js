import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id.toString())
    );

    const suggestedUsers = filteredUsers.slice(0, 5);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in getSuggestedUsers controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/un-follow yourself" });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Un follow the user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      res.status(200).json({
        message: "User Un-followed successfully",
      });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      // Send Notification to User
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();

      // TODO return the id to the user as a response
      res.status(200).json({
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log(`Error in follow-UnfollowUser controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        message: "Please provide both current and new passwords",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password || ""
      );
      if (!isMatch) return res.status(400).json({ error: "Invalid password" });

      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      // Destroy old image from cloudinary
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "profile-images",
      });
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      // Destroy old image from cloudinary
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: "cover-images",
      });
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    console.log("bio", bio);
 
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error in updateUser controller: ${error.message} `);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
