import React from "react"; // Import React for JSX
import { ToastContainer } from "react-toastify"; // Toast container for notifications

// ProfilePanel renders the user's profile view/edit form
export default function ProfilePanel({
  userProfile,
  isEditingProfile,
  setIsEditingProfile,
  handleProfileImageChange,
  handleProfileInputChange,
  handleSaveProfile,
  handleCancelEdit,
  handleRemoveProfilePicture,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
      {" "}
      {/* Card container */}
      <div className="flex justify-between items-center mb-6">
        {" "}
        {/* Header row */}
        <h2 className="text-2xl font-extrabold text-[#6D2932] tracking-tight">
          {" "}
          {/* Title */}
          User Profile
        </h2>
        {!isEditingProfile ? ( // Show edit button when not editing
          <button
            onClick={() => setIsEditingProfile(true)} // Enter edit mode
            className="px-4 py-2 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#6D2932] hover:text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#99B19C] hover:border-[#6D2932] text-xs sm:text-sm" // Button style
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            {" "}
            {/* Action buttons when editing */}
            <button
              onClick={handleSaveProfile} // Save edits handler
              className="px-4 py-2 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] hover:text-[#6D2932] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] text-xs sm:text-sm" // Save button style
            >
              💾 Save
            </button>
            <button
              onClick={handleCancelEdit} // Cancel edits
              className="px-4 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-bold transition-all duration-300 border-2 border-gray-400 hover:border-gray-500 text-xs sm:text-sm" // Cancel button style
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Grid layout for avatar and fields */}
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          {" "}
          {/* Left column */}
          <div className="flex flex-col items-center space-y-4">
            {" "}
            {/* Avatar container */}
            <div className="relative">
              {" "}
              {/* For action buttons over avatar */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#99B19C] shadow-lg bg-gradient-to-br from-[#FAF5EF] to-[#D7D1C9]">
                {" "}
                {/* Avatar frame */}
                {userProfile.profilePicture ? ( // If profile picture exists
                  <img
                    src={userProfile.profilePicture} // Show current profile pic
                    alt="Profile" // Alt text
                    className="w-full h-full object-cover" // Image styles
                  />
                ) : (
                  // Otherwise a placeholder
                  <div className="w-full h-full flex items-center justify-center text-[#6D2932] text-6xl font-bold">
                    {" "}
                    {/* Placeholder */}
                    {userProfile.name
                      ? userProfile.name.charAt(0).toUpperCase()
                      : "👤"}{" "}
                    {/* Initial or icon */}
                  </div>
                )}
              </div>
              {isEditingProfile && ( // Action buttons only when editing
                <>
                  <button
                    onClick={() =>
                      document.getElementById("profileImageInput").click()
                    } // Trigger hidden file input
                    className="absolute bottom-2 right-2 bg-[#6D2932] hover:bg-[#99B19C] text-white rounded-full p-2 shadow-lg transition-all duration-300" // Camera button style
                  >
                    📷 {/* Camera icon */}
                  </button>
                  {userProfile.profilePicture && ( // Show delete only if there is a picture
                    <button
                      onClick={handleRemoveProfilePicture} // Remove handler
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300" // Trash button style
                      title="Remove profile picture" // Tooltip
                    >
                      🗑️ {/* Trash icon */}
                    </button>
                  )}
                </>
              )}
            </div>
            {isEditingProfile && ( // Hidden input for image upload
              <input
                type="file" // File input
                id="profileImageInput" // Target for the camera button
                accept="image/*" // Image files only
                onChange={handleProfileImageChange} // Update local preview file
                className="hidden" // Hide from layout
              />
            )}
            <div className="text-center">
              {" "}
              {/* Name + email under avatar */}
              <h3 className="text-xl font-bold text-[#6D2932]">
                {" "}
                {/* Name */}
                {userProfile.name || "User Name"}
              </h3>
              <p className="text-[#99B19C] text-sm">
                {" "}
                {/* Email */}
                {userProfile.email || "user@email.com"}
              </p>
            </div>
          </div>
        </div>
        {/* Profile Information Section */}
        <div className="lg:col-span-2">
          {" "}
          {/* Right column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {" "}
            {/* Fields grid */}
            {/* Name Field */}
            <div className="space-y-2">
              {" "}
              {/* Field wrapper */}
              <label className="block text-sm font-bold text-[#6D2932]">
                {" "}
                {/* Label */}
                👤 Full Name
              </label>
              {isEditingProfile ? ( // Editable input
                <input
                  type="text" // Text input
                  name="name" // Model key
                  value={userProfile.name} // Controlled value
                  onChange={handleProfileInputChange} // Update state
                  className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm" // Input styles
                  placeholder="Enter your full name" // Helper text
                />
              ) : (
                // Read-only display
                <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                  {" "}
                  {/* Read-only box */}
                  {userProfile.name || "Not specified"} {/* Fallback */}
                </div>
              )}
            </div>
            {/* Email Field */}
            <div className="space-y-2">
              {" "}
              {/* Field wrapper */}
              <label className="block text-sm font-bold text-[#6D2932]">
                {" "}
                {/* Label */}
                📧 Email Address
              </label>
              {isEditingProfile ? ( // Editable input
                <input
                  type="email" // Email input
                  name="email" // Model key
                  value={userProfile.email} // Controlled value
                  onChange={handleProfileInputChange} // Update state
                  className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm" // Styles
                  placeholder="Enter your email" // Placeholder
                />
              ) : (
                // Read-only
                <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                  {" "}
                  {/* Box */}
                  {userProfile.email || "Not specified"}
                </div>
              )}
            </div>
            {/* Phone Field */}
            <div className="space-y-2">
              {" "}
              {/* Wrapper */}
              <label className="block text-sm font-bold text-[#6D2932]">
                {" "}
                {/* Label */}
                📱 Phone Number
              </label>
              {isEditingProfile ? ( // Editable input
                <input
                  type="tel" // Phone input
                  name="phone" // Model key
                  value={userProfile.phone} // Controlled
                  onChange={handleProfileInputChange} // Update state
                  className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm" // Styles
                  placeholder="Enter your phone number" // Placeholder
                />
              ) : (
                // Read-only
                <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                  {" "}
                  {/* Box */}
                  {userProfile.phone || "Not specified"}
                </div>
              )}
            </div>
            {/* Gender Field */}
            <div className="space-y-2">
              {" "}
              {/* Wrapper */}
              <label className="block text-sm font-bold text-[#6D2932]">
                {" "}
                {/* Label */}
                ⚧️ Gender
              </label>
              {isEditingProfile ? ( // Editable select
                <select
                  name="gender" // Model key
                  value={userProfile.gender} // Controlled
                  onChange={handleProfileInputChange} // Update state
                  className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm" // Styles
                >
                  <option value="">Select Gender</option> {/* Empty option */}
                  <option value="Male">Male</option> {/* Male option */}
                  <option value="Female">Female</option> {/* Female option */}
                  <option value="Other">Other</option> {/* Other option */}
                </select>
              ) : (
                // Read-only
                <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                  {" "}
                  {/* Box */}
                  {userProfile.gender || "Not specified"}
                </div>
              )}
            </div>
            {/* Date of Birth Field */}
            <div className="space-y-2 md:col-span-2">
              {" "}
              {/* Full width on md+ */}
              <label className="block text-sm font-bold text-[#6D2932]">
                {" "}
                {/* Label */}
                🎂 Date of Birth
              </label>
              {isEditingProfile ? ( // Editable date input
                <input
                  type="date" // Date input control
                  name="dateOfBirth" // Model key
                  value={userProfile.dateOfBirth} // Controlled value
                  onChange={handleProfileInputChange} // Update state
                  className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm" // Styles
                />
              ) : (
                // Read-only
                <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                  {" "}
                  {/* Box */}
                  {userProfile.dateOfBirth
                    ? new Date(userProfile.dateOfBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      ) // Pretty date
                    : "Not specified"}{" "}
                  {/* Fallback */}
                </div>
              )}
            </div>
          </div>
          {/* Profile Stats/Info Cards (only in view mode) */}
          {!isEditingProfile && (
            <div className="mt-8">
              {" "}
              {/* Spacer */}
              <div className="bg-gradient-to-br from-[#6D2932] to-[#99B19C] p-4 rounded-xl text-white text-center max-w-xs mx-auto">
                {" "}
                {/* Highlight card */}
                <div className="text-2xl font-bold">🩸</div> {/* Icon */}
                <div className="text-sm font-medium">
                  {" "}
                  {/* Label */}
                  Last Detected Blood Type
                </div>
                <div className="text-lg font-bold">
                  {" "}
                  {/* Value */}
                  {userProfile.bloodType || "Not Detected"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
}
