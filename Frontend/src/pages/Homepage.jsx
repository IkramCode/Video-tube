import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Features/userSlice"; 

export default function Homepage() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortType] = useState("desc");
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user); 

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
          },
        });
        setVideos((prevVideos) => [
          ...prevVideos,
          ...response.data.data.videos,
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [page, query, sortBy, sortType]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/users/current-user");
        dispatch(setUser(response.data.data));
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    const handleIntersection = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef]);

  return (
    <div className="p-4 bg-gray-800 min-h-screen">
      {user ? (
        <>
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="p-2 border border-gray-700 bg-gray-600 text-white rounded-lg w-full sm:w-1/2 lg:w-1/3 placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video._id}
                to={`/video/${video._id}`}
                className="block p-4 bg-gray-700 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {video.title}
                  </h3>
                  <p className="text-white mb-2">{video.description}</p>
                  <p className="text-sm text-gray-400">
                    Views: {video.viewCount}
                  </p>
                  <p className="text-sm text-gray-400">
                    Duration: {video.duration} mins
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div
            ref={loaderRef}
            className="h-10 w-full flex justify-center items-center"
          >
            <p className="text-white">Loading more videos...</p>
          </div>
        </>
      ) : (
        <div className="text-center text-white">
          <p>Please log in to view videos.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
