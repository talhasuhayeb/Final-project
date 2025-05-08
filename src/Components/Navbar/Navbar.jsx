import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#A41214] text-[#B79455] shadow-lg rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              {/* Blood drop logo image */}
              <img
                src="src/assets/logo.png"
                alt="BloodDetect logo"
                className=" h-20 w-20 object-cover"
              />
              <span className="font-bold text-xl select-none">
                Blood Detection System
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              className="px-3 py-1 rounded-md transition duration-300 font-medium hover:bg-[#B79455] hover:scale-105 hover:font-bold hover:text-red-800"
            >
              Home
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-md transition duration-300 font-medium hover:bg-[#B79455] hover:scale-105 hover:font-bold hover:text-red-800"
            >
              About
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-md transition duration-300 font-medium hover:bg-[#B79455] hover:scale-105 hover:font-bold hover:text-red-800"
            >
              Blood Bank
            </a>
          </div>
          {/* Register / Login Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#register"
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded hover:bg-red-100 transition duration-300"
            >
              Register
            </a>
            <a
              href="#login"
              className="px-4 py-2 border border-white rounded font-medium hover:bg-red-100 hover:font-bold hover:text-red-600 transition duration-300"
            >
              Login
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-label="Toggle menu"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white"
            >
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-red-700 px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="block px-3 py-2 rounded text-white hover:bg-red-500 transition duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded text-white hover:bg-red-500 transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded text-white hover:bg-red-500 transition duration-300"
          >
            Services
          </a>
          <a
            href="#register"
            className="block px-3 py-2 rounded text-red-600 bg-white font-semibold hover:bg-red-100 transition duration-300"
          >
            Register
          </a>
          <a
            href="#login"
            className="block px-3 py-2 rounded border border-white text-white hover:bg-red-100 hover:text-red-600 transition duration-300"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
