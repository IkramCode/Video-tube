import { Video } from "../models/video.model";

export const fetchVideoById = async (videoId) => {
  return await Video.findById(videoId);
};
