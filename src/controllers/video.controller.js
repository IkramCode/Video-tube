import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;
  
    //TODO: get all videos based on query, sort, pagination
  
    /*This is how i done this task
    
    (1) Firstly added page , limit and sort in variables to use them and gave default value to them
  
   (2) Then searched if query is available : i found there were two methods of doing it (1) one was to add SearchIndex in mongodb and (2) is using $regex which i used cuz it already feels complex to use pipelines
  
   (3) Then searched for userId and passed it in searchQuery directly
  
   (4) Then used an array of aggregateQuery to use all the methods of mongodb ($match etc) in one array to make it clean 
             Added $match , $lookup , $addFields and $project
  
    (5) returned response and error handling
  
    */ 
  
  
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrder = sortType === "asc" ? 1 : -1;
  
    const searchQuery = [];
  
    if (query) {
      searchQuery.push({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
    }
  
    if (userId) {
      searchQuery.push({
        owner: mongoose.Types.ObjectId(userId),
      });
    }
  
    searchQuery.push({
      isPublished: true,
    });
  
    const aggregateQuery = [
      {
        $match: searchQuery.length > 0 ? { $and: searchQuery } : {},
      },
      {
        $sort: {
          [sortBy]: sortOrder,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$user",
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          owner: 1,
          duration: 1,
          views: 1,
          videoFile: 1,
        },
      },
    ];
  
    const videos = await Video.aggregate(aggregateQuery)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));

  } catch (error) {
      throw new ApiError(500 , "Error fetching videos")
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
