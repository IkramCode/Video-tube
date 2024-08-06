import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist

  if (name === undefined || description === undefined) {
    throw new ApiError(400, "name and description are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const playlist = new Playlist({
      name: name,
      description: description,
      owner: user._id,
    });

    await playlist.save();

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating playlist");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const playlists = await Playlist.find({ owner: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching playlists");
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist ID is missing or invalid");
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching the playlist");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist ID is missing or invalid");
  }

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  try {
    await playlist.updateOne({ $addToSet: { videos: video._id } });
    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while adding the video to playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist ID is missing or invalid");
  }

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is missing or invalid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  try {
    await playlist.updateOne({ $pull: { videos: video._id } });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while removing the video from playlist"
    );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist ID is missing or invalid");
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    await playlist.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Playlist deleted successfully"));
  } catch (error) {
    
    throw new ApiError(500, "An error occurred while deleting the playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist ID is missing or invalid");
  }

  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name and description are required");
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          name: name,
          description: description,
        },
      },
      { new: true }
    );
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while updating the playlist");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
