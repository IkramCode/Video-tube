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

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  if (isNaN(limitNumber) || limitNumber < 1) {
    limitNumber = 10;
  }

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  // const video = await Video.findById(videoId);

  try {
    console.log("Querying comments with video ID:", videoId);
    const comments = await Comment.find({ video : videoId })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate("owner", "username avatar");
    console.log("comments", comments);

    const numberOfComments = await Comment.countDocuments(videoId);
    console.log("Number of comments:", numberOfComments);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          comments,
          pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalCount: numberOfComments,
            totalPages: Math.ceil(numberOfComments / limitNumber),
          },
        },
        "Comments fetched successfully"
      )
    );
  } catch (error) {
    console.log("error", error);

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
    const comment = await Comment.create({
      content: content,
      owner: req.user._id,
      video : videoId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating comment");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
