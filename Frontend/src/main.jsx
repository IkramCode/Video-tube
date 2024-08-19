import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Landingpage from "./pages/Landingpage.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import Videos from "./pages/Videos.jsx";
import Homepage from "./pages/Homepage.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Layout from "./Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="" element={<Landingpage />} />
      <Route path="/" element={<Layout />}>
        <Route path="homepage" element={<Homepage />} />
        <Route path="videos" element={<Videos />} />
        <Route path="video/:id" element={<VideoPlayer />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
