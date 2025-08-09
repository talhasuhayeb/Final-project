import React from "react"; // Import React for JSX

// Sidebar renders the left sliding navigation for dashboard sections
export default function Sidebar({
  sidebarOpen,
  activeSection,
  setActiveSection,
  onEnter,
  onLeave,
}) {
  // Compute slide-in class based on open state
  const slideClass = sidebarOpen ? "translate-x-0" : "-translate-x-full"; // Toggle X translation

  return (
    <div
      className={`fixed top-1/2 left-0 h-80 w-44 bg-white/80 backdrop-blur-lg shadow-lg rounded-r-2xl border border-[#99B19C]/40 p-3 space-y-3 z-40 transition-transform duration-300 transform -translate-y-1/2 ${slideClass}`} // Container styles and motion
      onMouseEnter={onEnter} // Keep open on hover
      onMouseLeave={onLeave} // Hide on leave
    >
      {/* Detection button */}
      <button
        onClick={() => setActiveSection("main")} // Switch to detection section
        className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
          activeSection === "main" ? "bg-[#99B19C]/20" : ""
        }`} // Highlight when active
      >
        Detection
      </button>

      {/* Profile button */}
      <button
        onClick={() => setActiveSection("profile")} // Switch to profile section
        className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
          activeSection === "profile" ? "bg-[#99B19C]/20" : ""
        }`} // Highlight when active
      >
        Profile
      </button>

      {/* Methodology button */}
      <button
        onClick={() => setActiveSection("methodology")} // Switch to methodology section
        className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
          activeSection === "methodology" ? "bg-[#99B19C]/20" : ""
        }`}
      >
        Methodology
      </button>

      {/* Blood Article button */}
      <button
        onClick={() => setActiveSection("bloodArticle")} // Switch to blood articles section
        className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
          activeSection === "bloodArticle" ? "bg-[#99B19C]/20" : ""
        }`}
      >
        Blood Article
      </button>

      {/* History button */}
      <button
        onClick={() => setActiveSection("history")} // Switch to history section
        className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 transition-all duration-200 hover:bg-[#99B19C]/10 ${
          activeSection === "history" ? "bg-[#99B19C]/20" : ""
        }`}
      >
        History
      </button>
    </div>
  );
}
