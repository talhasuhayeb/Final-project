import React from "react"; // Import React for JSX

// AdminHeader renders the top admin navbar with title and actions
export default function AdminHeader({
  title,
  subtitle,
  adminName,
  onHome,
  onLogout,
}) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#D7D1C9]/60 shadow-lg px-4 sm:px-8 py-4 sticky top-0 z-10">
      {" "}
      {/* Navbar container */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {" "}
        {/* Centered content */}
        <div className="flex items-center space-x-3 group">
          {" "}
          {/* Left: title + subtitle */}
          <span className="font-bold text-xl sm:text-2xl text-[#6D2932] tracking-tight group-hover:text-[#99B19C] transition-colors duration-300">
            {" "}
            {/* Title */}
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-[#99B19C] opacity-70 font-medium hidden sm:inline-block">
              {" "}
              {/* Subtitle */}
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {" "}
          {/* Right: actions */}
          <span className="font-semibold text-xs sm:text-sm text-[#99B19C]">
            {" "}
            {/* Greeting */}
            Welcome, {adminName}
          </span>
          <button
            onClick={onHome} // Go to home
            className="px-4 py-1.5 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#99B19C] hover:border-[#6D2932] focus:outline-none focus:ring-2 focus:ring-[#6D2932]/50 text-xs sm:text-sm" // Styles
          >
            Home
          </button>
          <button
            onClick={onLogout} // Logout
            className="px-4 py-1.5 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm" // Styles
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
