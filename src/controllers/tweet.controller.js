import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const { content } = req.body;

  if ([content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Content is missing");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweet = new Tweet({
    content: content,
    owner: req.user._id,
  });

  try {
    await tweet.save();
  } catch (error) {
    throw new ApiError(500, "Error saving tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(
        200, 
        tweet, 
        "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const user = await User.findById(req.user._id);

  if (!user?.trim()) {
    throw new ApiError(400, "Invalid username");
  }

  const tweet = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "owner",
        as: "tweets",
        pipeline: [
          {
            $project: {
              content: 1,
              owner: 1,
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        tweet[0].tweets, 
        "User tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet ID is missing or invalid");
  }

  const { content } = req.body;

  if ([content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Content is missing");
  }

  try {
    const tweet = await Tweet.findByIdAndUpdate(
      
      {
        $set: {
          content: content,
        },
      },
      { new: true }
    );
    return res
    .status(200)
    .json(new ApiResponse(
        200 , 
        tweet , 
        "Tweet updated successfully"))

  } catch (error) {
    throw new ApiError(400, "Content is missing");
  }

 
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const { tweetId } = req.params

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet ID is missing or invalid");
  }

  try {
    const result = await Tweet.delete({ _id : tweetId })
  
    if (result.deletedCount === 0) {
      throw new ApiError(404, "Tweet not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        null, 
        "Tweet deleted successfully"
      ))

  } catch (error) {
    throw new ApiError(500, "An error occurred while deleting the tweet")
  }

});

export { 
  createTweet, 
  getUserTweets, 
  updateTweet, 
  deleteTweet 
};
