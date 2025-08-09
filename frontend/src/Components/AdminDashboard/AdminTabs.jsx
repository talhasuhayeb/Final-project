import React from "react"; // Import React for JSX

// AdminTabs renders the Users / Detection tabs
export default function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-[#D7D1C9] mb-6">
      {" "}
      {/* Tabs wrapper */}
      <button
        onClick={() => setActiveTab("users")} // Switch to users
        className={`px-4 py-2 font-medium text-sm sm:text-base transition-all duration-300 ${
          activeTab === "users"
            ? "border-b-2 border-[#6D2932] text-[#6D2932] font-bold"
            : "text-gray-500 hover:text-[#6D2932]"
        }`} // Active styles
      >
        User Management
      </button>
      <button
        onClick={() => setActiveTab("detection")} // Switch to detection
        className={`px-4 py-2 font-medium text-sm sm:text-base transition-all duration-300 ${
          activeTab === "detection"
            ? "border-b-2 border-[#6D2932] text-[#6D2932] font-bold"
            : "text-gray-500 hover:text-[#6D2932]"
        }`} // Active styles
      >
        Blood Group Detection Records
      </button>
    </div>
  );
}
