import React from "react"; // Import React to define the component

// DashboardHeader renders the top navigation bar with logo, greeting, and actions
export default function DashboardHeader({
  logo,
  loggedInUser,
  onHome,
  onLogout,
}) {
  // Return the JSX for the header/navigation bar
  return (
    <header className="sticky top-0 z-50">
      {" "}
      {/* Keep header sticky and above other content */}
      <nav className="bg-white/80 backdrop-blur-md text-[#6D2932] shadow-lg border-b border-[#D7D1C9]/60">
        {" "}
        {/* Styled nav bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Center content with max width */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:h-20 py-4 gap-4">
            {" "}
            {/* Layout rows/columns */}
            <div className="flex items-center space-x-3 group">
              {" "}
              {/* Logo and brand container */}
              <div className="relative">
                {" "}
                {/* Positioning for hover overlay */}
                <img
                  src={logo} // Show passed logo image
                  alt="BloodDetect logo" // Accessible alt text
                  className="h-10 w-10 object-cover rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" // Logo styles
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6D2932] to-[#99B19C] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>{" "}
                {/* Subtle hover glow */}
              </div>
              <div className="flex flex-col">
                {" "}
                {/* Brand text container */}
                <span className="font-bold text-lg text-[#6D2932] tracking-tight group-hover:text-[#99B19C] transition-colors duration-300">
                  {" "}
                  {/* Brand name */}
                  Bindu
                </span>
                <span className="text-xs text-[#99B19C] opacity-70 font-medium">
                  {" "}
                  {/* Tagline */}
                  AI-Powered Blood Detection
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {" "}
              {/* Right-side actions */}
              <span className="font-semibold text-sm sm:text-base text-[#99B19C]">
                {" "}
                {/* Greeting */}
                Welcome, {loggedInUser}
              </span>
              <button
                onClick={onHome} // Navigate home handler
                className="px-4 py-1.5 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#99B19C] hover:border-[#6D2932] focus:outline-none focus:ring-2 focus:ring-[#6D2932]/50 text-xs sm:text-sm" // Button styles
              >
                Home {/* Home label */}
              </button>
              <button
                onClick={onLogout} // Logout handler
                className="px-4 py-1.5 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm" // Button styles
              >
                Logout {/* Logout label */}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
