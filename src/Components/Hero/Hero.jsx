import React from "react";

const Hero = () => {
  return (
    <div
      className="hero min-h-screen object-contain"
      style={{
        backgroundImage: "url(src/assets/hero_pic3.png) ",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-3xl">
          <h1 className="mb-5 text-5xl font-bold">
            Transforming Diagnostics with AI-Based Blood Typing
          </h1>
          <p className="mb-5 font-medium text-lg">
            Automated Blood Group Identification at Your Fingertips
          </p>
          <button className="btn bg-[#8A0302] text-[#B79455] hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
