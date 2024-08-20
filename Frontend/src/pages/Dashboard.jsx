import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Features/userSlice";
import { TailSpin } from "react-loader-spinner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [totalSubs, setTotalSubs] = useState(0);
  const [totalVids, setTotalVids] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/videos", {
          params: {
            page: 1,
            limit: 10,
            query: "",
            sortBy: "createdAt",
            sortType: "desc",
          },
        });

        const videosData = response.data.data.videos;
        setVideos(videosData);

        const totalSubscribers = videosData.reduce(
          (acc, video) => acc + video.subscribers,
          0
        );
        const totalVideos = videosData.length;
        const totalViews = videosData.reduce(
          (acc, video) => acc + video.views,
          0
        );
        const totalLikes = videosData.reduce(
          (acc, video) => acc + video.likes,
          0
        );

        setTotalSubs(totalSubscribers);
        setTotalVids(totalVideos);
        setTotalViews(totalViews);
        setTotalLikes(totalLikes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/users/current-user");
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="p-8  bg-gray-800 text-gray-200 rounded-lg shadow-lg">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition-all hover:bg-red-800"
      >
        Logout
      </button>
      <div className="relative bg-gray-900 rounded-lg shadow-md mb-12 overflow-hidden">
        <img
          src={user.coverImage}
          alt={`${user.username} cover`}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative flex items-center space-x-6 p-6">
          <div className="relative z-10">
            <img
              src={user.avatar}
              alt={`${user.username} avatar`}
              className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg -mt-12 object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{user.fullName}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="stat-item bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200 transition duration-300 hover:scale-105">
          <span className="block text-sm text-gray-400">Total Subscribers</span>
          <span className="text-3xl font-semibold">{totalSubs}</span>
        </div>
        <div className="stat-item bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200 transition duration-300 hover:scale-105">
          <span className="block text-sm text-gray-400">Total Videos</span>
          <span className="text-3xl font-semibold">{totalVids}</span>
        </div>
        <div className="stat-item bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200 transition duration-300 hover:scale-105">
          <span className="block text-sm text-gray-400">Total Views</span>
          <span className="text-3xl font-semibold">{totalViews}</span>
        </div>
        <div className="stat-item bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200 transition duration-300 hover:scale-105">
          <span className="block text-sm text-gray-400">Total Likes</span>
          <span className="text-3xl font-semibold">{totalLikes}</span>
        </div>
      </div>

      <div className="video-list">
        <h3 className="text-3xl font-bold mb-6">Your Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              className="video-item bg-gray-900 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <Link to={`/video/${video._id}`}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{video.title}</h4>
                <p className="text-gray-400 mb-2">{video.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Views: {video.views}</span>
                  <span>Likes: {video.likes}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
