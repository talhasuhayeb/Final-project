import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#FAF5EF] shadow-sm border-b border-[#D7D1C9]/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src={Logo}
                  alt="BloodDetect logo"
                  className="h-10 w-10 object-cover rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6D2932] to-[#99B19C] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#6D2932] tracking-tight group-hover:text-[#99B19C] transition-colors duration-300">
                  Bindu
                </span>
                <span className="text-xs text-[#99B19C] opacity-70 font-medium">
                  AI-Powered Detection
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="relative px-3 py-1.5 text-sm text-[#99B19C] font-medium transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-[#6D2932] transition-colors duration-300">
                Home
              </span>
              <div className="absolute inset-0 bg-[#D7D1C9] rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
            </Link>
            <Link
              to="#about"
              className="relative px-3 py-1.5 text-sm text-[#99B19C] font-medium transition-all duration-300 group"
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span className="relative z-10 group-hover:text-[#6D2932] transition-colors duration-300">
                About
              </span>
              <div className="absolute inset-0 bg-[#D7D1C9] rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
            </Link>
            <Link
              to="#"
              className="relative px-3 py-1.5 text-sm text-[#99B19C] font-medium transition-all duration-300 group"
            >
              <span className="relative z-10 group-hover:text-[#6D2932] transition-colors duration-300">
                Blood Bank
              </span>
              <div className="absolute inset-0 bg-[#D7D1C9] rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
            </Link>
          </div>

          {/* Register / Login Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/register"
              className="px-4 py-2 text-sm text-[#6D2932] font-medium border border-[#6D2932]/20 rounded-full hover:bg-[#6D2932]/5 hover:border-[#6D2932] transition-all duration-300 transform hover:scale-105"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm bg-gradient-to-r from-[#6D2932] to-[#6D2932]/90 text-[#FAF5EF] font-medium rounded-full hover:from-[#99B19C] hover:to-[#99B19C]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-[#99B19C] hover:text-[#6D2932] hover:bg-[#D7D1C9]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6D2932]/20 focus:ring-opacity-50"
            >
              <svg
                className="h-5 w-5"
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
        <div className="md:hidden bg-[#FAF5EF]/95 border-t border-[#D7D1C9]/30 px-4 pt-4 pb-6 backdrop-blur-sm">
          <div className="space-y-3">
            <Link
              to="/"
              className="block px-4 py-3 text-[#99B19C] font-medium rounded-lg hover:bg-[#D7D1C9] hover:text-[#6D2932] transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="#about"
              className="block px-4 py-3 text-[#99B19C] font-medium rounded-lg hover:bg-[#D7D1C9] hover:text-[#6D2932] transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              About
            </Link>
            <Link
              to="#"
              className="block px-4 py-3 text-[#99B19C] font-medium rounded-lg hover:bg-[#D7D1C9] hover:text-[#6D2932] transition-all duration-300"
            >
              Blood Bank
            </Link>
            <div className="pt-4 border-t border-[#D7D1C9] space-y-3">
              <Link
                to="/register"
                className="block w-full px-4 py-3 text-center text-[#6D2932] font-medium border border-[#6D2932]/20 rounded-lg hover:bg-[#6D2932]/5 transition-all duration-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-[#6D2932] to-[#6D2932]/90 text-[#FAF5EF] font-medium rounded-lg hover:from-[#99B19C] hover:to-[#99B19C]/90 transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
