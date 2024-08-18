import React from 'react';
import { Link } from 'react-router-dom';

const Landingpage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">VideoTube</div>
          <div>
            <Link to="/login" className="text-white px-4 py-2 hover:underline">Login</Link>
            <Link to="/register" className="text-white px-4 py-2 hover:underline">Register</Link>
          </div>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center bg-slate-700 text-white">
        <h1 className="text-4xl font-bold">Welcome to VideoTube</h1>
      </div>
    </div>
  );
};

export default Landingpage;
