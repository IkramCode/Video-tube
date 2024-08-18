import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get(`/videos/${id}`);
        setVideo(response.data.data);
        console.log("Video fetched:", response.data.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p>No video found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Video Container */}
      <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
        <div className="relative">
          {/* Video Player */}
          <video
            src={video.videoFile}
            controls
            className="w-full h-64 object-cover rounded-t-lg"
          ></video>
          <div className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg text-sm shadow-md">
            {video.views} views
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <div className="flex items-center mb-4">
            <img
              src={video.owner?.avatar || "/default-avatar.png"}
              alt={video.owner?.username || "Unknown User"}
              className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300 object-cover"
            />
            <div>
              <p className="font-semibold text-lg">
                {video.owner?.username || "Unknown User"}
              </p>
              <p className="text-gray-600 text-sm">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{video.description}</p>
          <p className="text-sm text-gray-500">
            Duration: {video.duration} mins
          </p>
        </div>
      </div>
      {/* Add more features like comments, related videos, etc. here */}
    </div>
  );
}
