import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  let pageNumber = parseInt(page, 1);
  let limitNumber = parseInt(limit, 10);

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  try {
    const comments = await Comment.find({ videoId })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalComments = await Comment.countDocuments({ videoId });
    const totalPages = Math.ceil(totalComments / limitNumber);

    res.json({
      page: pageNumber,
      totalPages,
      limit: limitNumber,
      totalComments,
      comments,
    });
  } catch (error) {
    throw new ApiError(500, "Error fetching comments");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  if (!content?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Content cannot be empty"));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const comment = new Comment({
      videoId: new mongoose.Types.ObjectId(videoId),
      userId: req.user._id,
      content: content,
    });

    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while adding the comment");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
