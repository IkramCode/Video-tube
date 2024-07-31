import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { fetchVideoById } from "../utils/FetchVideo.js";

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

    // added total count of pagination for client / frontend to get meta data of pages

    const totalCount = await Video.countDocuments({
      $match: searchQuery.length > 0 ? { $and: searchQuery } : {},
    });

    const videos = await Video.aggregate(aggregateQuery)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos,
          pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
          },
        },
        "Videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  /* How i did this ?
  It was preety simple as i already have built utils for cloudinary which handels video and pics so i just called it here and handled the errors and response 
  */

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title or description is missing");
  }

  const videoLocalPath = req.file?.videoLocalPath;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing");
  }

  const video = await uploadOnCloudinary(videoLocalPath);

  if (!video.url) {
    throw new ApiError(400, "Error while uploading video");
  }

  const user = await User.findById(req.user._id).select("video -password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  /* How i did this ?   
  I built a new utils to fetch videos as i might need it further and used  isValideObjectId to check if id is valid 
  */

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  try {
    const video = await fetchVideoById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)

      .json(new ApiResponse(200, video, "Video fetched successfully"));
      
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching the video");
  }
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
