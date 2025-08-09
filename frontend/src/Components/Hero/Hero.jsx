import React from "react";
import { Link } from "react-router-dom";
import HeroBanner from "../../assets/hero_pic2.png";

const Hero = () => {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${HeroBanner})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF5EF]/90 via-[#D7D1C9]/80 to-[#6D2932]/70 mix-blend-multiply"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 w-full">
        <h1 className="mb-6 text-4xl md:text-6xl font-extrabold text-[#6D2932] drop-shadow-lg leading-tight">
          Transforming Diagnostics with <br />
          <span className="text-[#99B19C]">AI-Based Blood Typing</span>
        </h1>
        <p className="mb-8 font-medium text-base md:text-lg text-[#6D2932] bg-[#FAF5EF]/70 rounded-xl px-4 py-2 inline-block shadow-sm">
          Automated Blood Group Identification at Your Fingertips
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 rounded-full bg-[#6D2932] text-[#FAF5EF] font-semibold text-lg shadow-md hover:bg-[#99B19C] hover:text-[#6D2932] hover:scale-105 transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Hero;
