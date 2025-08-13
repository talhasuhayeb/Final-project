import React from "react";
import { motion } from "framer-motion";

const logoVariants = {
  rest: { scale: 1, boxShadow: "0 0 0px #E8D8C4" },
  hover: {
    scale: 1.18,
    boxShadow: "0 0 40px #E8D8C4",
    transition: { type: "spring", stiffness: 300 },
  },
};

// DashboardHeader renders the top navigation bar with logo, greeting, and actions
export default function DashboardHeader({
  logo,
  loggedInUser,
  onHome,
  onLogout,
}) {
  // Return the JSX for the header/navigation bar
  return (
    <header
      className="mx-auto z-50 my-8 sticky top-0"
      style={{
        maxWidth: "1100px",
        width: "100%",
        borderRadius: "2rem",
        boxShadow:
          "0 8px 32px 0 rgba(199,183,163,0.12), 0 1.5px 8px 0 rgba(232,216,196,0.08)",
        background: "rgba(86,28,36,0.92)", // #561C24 glassy
        backdropFilter: "blur(22px)",
        padding: "0.5rem 0",
      }}
    >
      <nav>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:h-20 py-4 gap-4 px-8">
          <div className="flex items-center space-x-4 group">
            <motion.img
              src={logo}
              alt="BloodDetect logo"
              className="h-14 w-14 object-cover rounded-full shadow-lg cursor-pointer border-4 border-white bg-white"
              variants={logoVariants}
              initial="rest"
              whileHover="hover"
              style={{
                background: "#fff",
              }}
            />
            <div className="flex flex-col">
              <span
                className="font-extrabold text-2xl tracking-tight select-none"
                style={{
                  color: "#E8D8C4",
                  letterSpacing: "0.04em",
                }}
              >
                Bindu
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "#C7B7A3", opacity: 0.7 }}
              >
                AI-Powered Blood Detection
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-sm sm:text-base text-[#C7B7A3]">
              Welcome, {loggedInUser}
            </span>
            <button
              onClick={onHome}
              className="px-5 py-2 rounded-xl font-semibold text-[#C7B7A3] bg-[#E8D8C4]/10 border border-[#C7B7A3] transition shadow cursor-pointer hover:scale-105"
              type="button"
              style={{
                backdropFilter: "blur(8px)",
                border: "1.5px solid #C7B7A3",
              }}
            >
              Home
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2 rounded-xl font-semibold text-[#561C24] bg-gradient-to-r from-[#C7B7A3] to-[#E8D8C4] transition shadow cursor-pointer hover:scale-105"
              type="button"
              style={{
                border: "1.5px solid #C7B7A3",
                boxShadow: "0 2px 12px #C7B7A322",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
