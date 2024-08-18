import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortType] = useState("desc");
  const [userId] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/videos", {
          params: {
            page,
            limit,
            query,
            sortBy,
            sortType,
            userId,
          },
        });
        setVideos(response.data.data.videos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [page, limit, query, sortBy, sortType, userId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/video/${video._id}`}
            className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
              <p className="text-gray-600 mb-2">{video.description}</p>
              <p className="text-sm text-gray-500">
                viewCount: {video.viewCount}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {video.duration} mins
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <p className="text-gray-700">Page {page}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
