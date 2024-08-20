import React from "react";
import {
  FaTachometerAlt,
  FaListUl,
  FaHistory,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { RiVideoUploadFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <nav className="flex flex-col space-y-4">
        <button onClick={toggleSidebar} className="text-right text-white">
          &#10005;
        </button>
        <Link
          to={"/dashboard"}
          className="flex items-center text-lg px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </Link>
        <Link
          to={"/upload-a-video"}
          className={
            "flex items-center text-lg px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          }
        >
          <RiVideoUploadFill className="mr-3" />
          Upload Video
        </Link>
        <Link
          to={"#"}
          className="flex items-center text-lg px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          <FaListUl className="mr-3" />
          Playlist
        </Link>
        <Link
          to={"#"}
          className="flex items-center text-lg px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          <FaHistory className="mr-3" />
          Watch History
        </Link>
        <Link
          to={"#"}
          className="flex items-center text-lg px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          <FaUserCog className="mr-3" />
          User Settings
        </Link>
        <Link
          to={"#"}
          className="flex items-center text-lg px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          <FaSignOutAlt className="mr-3" />
          Sign Out
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
