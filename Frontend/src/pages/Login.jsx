import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { isLoading, isError, message } = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    try {
      dispatch(login(data));
      const response = await axiosInstance.post("/users/login", data);
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Login error:", error);
    }

    navigate("/homepage");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl max-w-md w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
          {isError && (
            <p className="text-red-500 text-sm text-center mb-4">{message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link
          to="/register"
          className="text-blue-200 mt-6 block text-center text-sm hover:text-blue-500 transition duration-300"
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
