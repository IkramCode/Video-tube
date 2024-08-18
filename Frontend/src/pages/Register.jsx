import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log("onSubmit", data);

    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.coverImage && data.coverImage[0]) {
      formData.append("coverImage", data.coverImage[0]);
    }
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    console.log("formData", formData);

    try {
      const response = await axiosInstance.post("/users/register", formData,);
      console.log("register response", response.data);
    } catch (error) {
      console.error(error);
    }

    navigate("/videos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cover Image</label>
            <input
              type="file"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("coverImage")}
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Avatar</label>
            <input
              type="file"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("avatar")}
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm">{errors.avatar.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <Link to="/login" className="text-blue-500 mt-4 block text-center">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
