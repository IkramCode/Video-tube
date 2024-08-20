import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <div className="flex items-center space-x-2">
          <button onClick={toggleSidebar} className="text-white">
            <FaBars className="h-6 w-6" />
          </button>
          <Link to={"/homepage"}>
            <span className="text-xl font-bold text-white ml-6">
              Video Tube
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-white">
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <FaUserCircle className="h-10 w-10" />
          </button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
