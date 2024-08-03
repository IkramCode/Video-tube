import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  try {
    const like = await Like.findOne({
      likedBy: user,
      video: videoId,
    });

    if (like) {
      await Like.deleteOne();
      video.likes = video.likes - 1;
    } else {
      await Like.create({
        likedBy: user,
        video: videoId,
      });

      video.likes = video.likes + 1;
    }

    await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          { message: "Like toggled successfully" },
          { video: video.toObject({ getters: true }) }
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
