import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

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
          200,
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

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment ID is missing or invalid");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  try {
    const like = await Like.findOne({
      likedBy: user,
      comment: commentId,
    });

    if (like) {
      await Like.deleteOne();
      comment.likes = comment.likes - 1;
    } else {
      await Like.create({
        likedBy: user,
        comment: commentId,
      });

      comment.likes = comment.likes + 1;
    }

    await comment.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "Like toggled successfully" },
          { comment: comment.toObject({ getters: true }) }
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet ID is missing or invalid");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }

    const like = await Like.findOne({
      likedBy: user,
      tweet: tweetId,
    });

    if (like) {
      await like.deleteOne();
      tweet.likes = tweet.likes - 1;
    } else {
      await Like.create({
        likedBy: user,
        tweet: tweetId,
      });
      tweet.likes = tweet.likes + 1;
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "Like toggled successfully" },
          { tweet: tweet.toObject({ getters: true }) }
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling the like");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const likedVideos = await Like.aggregate([
      {
        $match: { likedBy: new mongoose.Types.ObjectId(user) },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "Liked_Videos",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                      owner: 1,
                      _id: 0,
                      description: 1,
                      thumbnail: 1,
                      duration: 1,
                      views: 1,
                      likes: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$owner",
            },
          ],
        },
      },
      {
        $unwind: "$Liked_Videos",
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          { message: "Liked videos fetched successfully" },
          { likedVideos }
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching liked videos");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
