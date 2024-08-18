import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
      <div className="flex items-center space-x-2">
        <img src="https://via.placeholder.com/40" alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="text-xl font-bold text-white">VideoTube</span>
      </div>
      <div className="flex items-center space-x-4 text-white">
        <button onClick={() => {navigate('/dashboard')}}>
        <FaUserCircle className="h-10 w-10" />
        </button>
      </div>
    </header>
  );
};

export default Header;
