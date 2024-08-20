import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";

export default function UploadVideo() {
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (!user) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail[0]);
      formData.append("videoFile", data.videoFile[0]);
      formData.append("published", data.published);
      formData.append("duration", data.duration);
      formData.append("userId", user._id); // Attach user ID

      const response = await axiosInstance.post("/videos", formData);
      console.log(response.data);

      toast.success("Video uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setIsUploading(false);
      setTimeout(() => navigate("/dashboard"), 3500);
    } catch (error) {
      setError(
        "An error occurred while uploading the video. Please try again."
      );
      setIsUploading(false);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <ToastContainer />
      {isUploading && (
        <div className="flex items-center justify-center fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <Rings
              height="100"
              width="100"
              color="#ffffff"
              radius="6"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <p className="text-white mt-4">Your video is uploading...</p>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter video title"
            {...register("title", { required: "Title is required" })}
            className="mt-1 block w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            placeholder="Enter video description"
            {...register("description", {
              required: "Description is required",
            })}
            className="mt-1 block w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Thumbnail</label>
          <input
            type="file"
            {...register("thumbnail", { required: "Thumbnail is required" })}
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-gray-100 hover:file:bg-indigo-700"
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Video File</label>
          <input
            type="file"
            {...register("videoFile", { required: "Video file is required" })}
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-gray-100 hover:file:bg-indigo-700"
          />
          {errors.videoFile && (
            <p className="text-red-500 text-xs mt-1">
              {errors.videoFile.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("published")}
            className="h-4 w-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm">Published</label>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Duration (seconds)
          </label>
          <input
            type="number"
            placeholder="Enter video duration"
            {...register("duration", { required: "Duration is required" })}
            className="mt-1 block w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isUploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
