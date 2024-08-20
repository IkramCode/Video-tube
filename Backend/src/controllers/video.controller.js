import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

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
        owner: new mongoose.Types.ObjectId(userId),
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
          as: "owner",
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
            $first: "$owner",
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

    const totalCount = await Video.countDocuments(
      searchQuery.length > 0 ? { $and: searchQuery } : {}
    );

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
  const { title, description, duration } = req.body;
  // TODO: get video, upload to cloudinary, create video

  /* How i did this ?
  It was pretty simple as i already have built utils for cloudinary which handels video and pics so i just called it here and handled the errors and response 
  */

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title or description is missing");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is missing");
  }

  let videoUploadResponse, thumbnailUploadResponse;

  try {
    [videoUploadResponse, thumbnailUploadResponse] = await Promise.all([
      uploadOnCloudinary(videoLocalPath),
      uploadOnCloudinary(thumbnailLocalPath),
    ]);

    if (!videoUploadResponse.url) {
      throw new ApiError(400, "Error while uploading video");
    }

    if (!thumbnailUploadResponse.url) {
      throw new ApiError(400, "Error while uploading thumbnail");
    }
  } catch (error) {
    throw new ApiError(500, "Error uploading files");
  }

  const user = await User.findById(req.user._id).select("video");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newVideo = new Video({
    videoFile: videoUploadResponse.url,
    thumbnail: thumbnailUploadResponse.url,
    title,
    description,
    duration: parseFloat(duration),
    owner: req.user._id,
  });

  try {
    await newVideo.save();
  } catch (error) {
    throw new ApiError(500, "Error saving video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  try {
    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
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
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          videoFile: 1,
          thumbnail: 1,
          duration: 1,
          views: 1,
          createdAt: 1,
          owner: 1,
        },
      },
    ]);

    if (video.length === 0) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video[0], "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching video");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title or description not provided");
  }

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is not available");
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.url) {
      throw new ApiError(400, "Error while uploading thumbnail");
    }
  } catch (error) {
    throw new ApiError(500, "Error uploading thumbnail");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const oldThumbnail = video.thumbnail;

  const updateData = {
    title,
    description,
    thumbnail: thumbnail.url,
  };

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true }
    );

    if (oldThumbnail) {
      await deleteFromCloudinary(oldThumbnail);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error updating video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }
  try {
    const result = await Video.deleteOne({ _id: videoId });

    if (result.deletedCount === 0) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while deleting the video");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: !video.isPublished,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          updatedVideo.isPublished
            ? "Video published successfully"
            : "Video unpublished successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling publish status");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
