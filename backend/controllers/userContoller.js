import User from '../models/userModel.js';
import { Notification } from '../models/notificationModel.js';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    return res.status(500).json({ error: error.message });
  }
};



export const followunfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id) {
      return res.status(400).json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      console.log("Trying to find out error");
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      const newNotification = new Notification({
        type: "unfollow",
        from: req.user._id,
        to: userToModify._id
      });

      await newNotification.save();
      res.status(200).json({ msg: "User unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id
      });

      await newNotification.save();
      res.status(200).json({ msg: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser:", error.message);
    res.status(500).json({ error: error.message });
  }
};