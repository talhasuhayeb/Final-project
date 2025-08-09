import React from "react"; // Import React for JSX

// HistoryTable renders detection history with actions and a detail modal region
export default function HistoryTable({
  detectionHistory, // Array of detection records
  logo, // Logo image for modal header
  userProfile, // User profile for modal info
  userEmail, // Email fallback
  loggedInUser, // Name fallback
  selectedDetection, // Currently selected detection for modal
  modalIsOpen, // Modal open flag
  setModalIsOpen, // Setter for modal
  setSelectedDetection, // Setter for selected detection
  handleViewDetection, // View handler (sets selectedDetection + opens modal)
  handleDownloadReport, // Download handler (pdf/html)
}) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
      {" "}
      {/* Wrapper card */}
      <h2 className="text-2xl font-extrabold mb-6 text-center text-[#6D2932] tracking-tight">
        {" "}
        {/* Title */}
        Detection History
      </h2>
      {detectionHistory.length > 0 ? ( // If we have history
        <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
          {" "}
          {/* Table wrapper */}
          <table className="min-w-full text-xs sm:text-sm">
            {" "}
            {/* Table */}
            <thead className="bg-[#99B19C] text-[#6D2932]">
              {" "}
              {/* Header */}
              <tr>
                <th className="px-4 py-3 text-center font-semibold">
                  Date & Time
                </th>{" "}
                {/* Column */}
                <th className="px-4 py-3 text-center font-semibold">
                  Blood Group
                </th>{" "}
                {/* Column */}
                <th className="px-4 py-3 text-center font-semibold">
                  Confidence
                </th>{" "}
                {/* Column */}
                <th className="px-4 py-3 text-center font-semibold">
                  Fingerprint
                </th>{" "}
                {/* Column */}
                <th className="px-4 py-3 text-center font-semibold">
                  Actions
                </th>{" "}
                {/* Column */}
              </tr>
            </thead>
            <tbody>
              {" "}
              {/* Body */}
              {detectionHistory.map((detection, index) => {
                // Iterate rows
                // Ensure timestamp is a valid date string
                let displayDate; // Human-readable date
                try {
                  displayDate = new Date(detection.timestamp).toLocaleString(); // Format date
                } catch (e) {
                  console.error("Invalid date:", detection.timestamp); // Log invalid
                  displayDate = "Invalid Date"; // Fallback
                }

                return (
                  <tr
                    key={index}
                    className="border-b border-[#D7D1C9] hover:bg-[#FAF5EF]"
                  >
                    {" "}
                    {/* Row */}
                    <td className="px-4 py-2 text-center">
                      {displayDate}
                    </td>{" "}
                    {/* Date cell */}
                    <td className="px-4 py-2 text-center">
                      {" "}
                      {/* Blood group cell */}
                      <span className="bg-[#6D2932] text-[#FAF5EF] px-3 py-1 rounded-full font-bold">
                        {" "}
                        {/* Pill */}
                        {detection.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">
                      {" "}
                      {/* Confidence */}
                      {detection.confidence || 0}%
                    </td>
                    <td className="px-4 py-2 text-center">
                      {" "}
                      {/* Image cell */}
                      <div className="flex justify-center">
                        {" "}
                        {/* Center image */}
                        {detection.filename ? ( // If we have a filename
                          <img
                            src={`http://localhost:8080/uploads/${detection.filename}`} // Static served image
                            alt="Fingerprint" // Alt text
                            className="w-12 h-12 object-cover rounded-xl border border-[#99B19C]/40 shadow" // Thumb style
                            onError={(e) => {
                              // Fallback on error
                              console.log(
                                "Fingerprint image failed to load:",
                                e.target.src
                              ); // Log
                              e.target.onerror = null; // Prevent loop
                              e.target.src =
                                "https://static.vecteezy.com/system/resources/previews/000/546/269/original/fingerprint-icon-vector-illustration.jpg"; // Fallback image
                            }}
                          />
                        ) : (
                          // No image case
                          <div className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]">
                            {" "}
                            {/* Placeholder */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-[#99B19C]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {" "}
                              {/* Icon */}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />{" "}
                              {/* Path */}
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {" "}
                      {/* Actions */}
                      <div className="flex justify-center gap-2">
                        {" "}
                        {/* Button group */}
                        <button
                          onClick={() => handleViewDetection(detection)} // Open modal with details
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-blue-500 hover:border-blue-600" // View button
                          title="View full report" // Tooltip
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            {" "}
                            {/* Eye icon */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />{" "}
                            {/* Pupil */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />{" "}
                            {/* Eye outline */}
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownloadReport(detection)} // Trigger download
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-green-500 hover:border-green-600" // Download button
                          title="Download PDF report" // Tooltip
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            {" "}
                            {/* Download icon */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />{" "}
                            {/* Arrow + page */}
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // No history case
        <div className="text-center py-10 text-[#6D2932]">
          {" "}
          {/* Empty state */}
          <p className="text-lg font-medium">
            No detection history found.
          </p>{" "}
          {/* Message */}
          <p className="text-sm mt-2">
            Upload and analyze fingerprints to see your detection history here.
          </p>{" "}
          {/* Hint */}
        </div>
      )}
      {/* Modal for viewing detection details */}
      {modalIsOpen &&
        selectedDetection && ( // Render modal when open and selection present
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ alignItems: "flex-start", paddingTop: "1vh" }}
          >
            {" "}
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setModalIsOpen(false);
                setSelectedDetection(null);
              }}
            ></div>{" "}
            {/* Click outside to close */}
            <div
              className="bg-white rounded-2xl shadow-2xl p-4 max-w-2xl w-full relative z-10 animate-fade-in m-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#333",
                lineHeight: 1.2,
                maxHeight: "95vh",
                overflow: "auto",
              }}
            >
              {" "}
              {/* Modal body */}
              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setSelectedDetection(null);
                }}
                className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C] w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0EBE3]"
                aria-label="Close"
              >
                {" "}
                {/* X button */}
                &times;
              </button>
              {/* Report Header */}
              <div className="text-center border-b-2 border-[#6D2932] pb-2 mb-2">
                {" "}
                {/* Header */}
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-[#6D2932] mb-1">
                  {" "}
                  {/* Logo + title */}
                  <img
                    src={logo}
                    alt="Bindu Logo"
                    className="w-[50px] h-[50px] object-cover rounded-lg"
                  />{" "}
                  {/* Logo */}
                  <span>Bindu</span> {/* Brand name */}
                </div>
                <div className="text-[#99B19C] text-xs">
                  AI-Powered Blood Group Detection System
                </div>{" "}
                {/* Tagline */}
                <div className="text-base font-bold text-[#6D2932] mt-1">
                  Blood Group Detection Report
                </div>{" "}
                {/* Report title */}
              </div>
              {/* Content Grid - 3 columns like the PDF */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {" "}
                {/* Grid */}
                {/* User Information Section */}
                <div className="border border-[#D7D1C9] rounded-lg p-3 bg-[#FAF5EF]">
                  {" "}
                  {/* User info card */}
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    👤 User Information
                  </div>{" "}
                  {/* Title */}
                  <div className="flex justify-between items-start text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Profile ID:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium text-xs break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {userProfile &&
                      (userProfile.profile_id || userProfile._id)
                        ? userProfile.profile_id ||
                          `${userProfile._id.toString().substring(0, 8)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Full Name:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {userProfile.name || loggedInUser || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Gender:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {userProfile.gender || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Email:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {userProfile.email || userEmail || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Date of Birth:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {userProfile.dateOfBirth
                        ? new Date(userProfile.dateOfBirth).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "2-digit" }
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
                {/* Analysis Details Section */}
                <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#FAF5EF]">
                  {" "}
                  {/* Analysis card */}
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    📋 Analysis Details
                  </div>{" "}
                  {/* Title */}
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[80px]">
                      Analysis ID:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium text-sm break-words max-w-[calc(100%-100px)]">
                      {" "}
                      {/* Value */}
                      {selectedDetection &&
                      (selectedDetection.analysis_id || selectedDetection._id)
                        ? selectedDetection.analysis_id ||
                          `${selectedDetection._id.toString().substring(0, 8)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Date:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {new Date(selectedDetection.timestamp).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Time:
                    </span>{" "}
                    {/* Label */}
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {new Date(selectedDetection.timestamp).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                </div>
                {/* Detection Results Section */}
                <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#FAF5EF]">
                  {" "}
                  {/* Results card */}
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    🩸 Detection Results
                  </div>{" "}
                  {/* Title */}
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[80px]">
                      Blood Type:
                    </span>{" "}
                    {/* Label */}
                    <span className="font-bold text-[#800000] text-base break-words max-w-[calc(100%-100px)]">
                      {" "}
                      {/* Value */}
                      {selectedDetection.bloodGroup}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Confidence:
                    </span>{" "}
                    {/* Label */}
                    <span className="font-bold text-green-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {selectedDetection.confidence || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Image Quality:
                    </span>{" "}
                    {/* Label */}
                    <span className="font-bold text-purple-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {selectedDetection.imageQuality || 0}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    {" "}
                    {/* Row */}
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Processing:
                    </span>{" "}
                    {/* Label */}
                    <span className="font-bold text-blue-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {" "}
                      {/* Value */}
                      {selectedDetection.processingTime || 0}ms
                    </span>
                  </div>
                </div>
              </div>
              {/* Image Section */}
              <div className="border border-[#D7D1C9] rounded-md p-3 mb-3 text-center">
                {" "}
                {/* Image card */}
                <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-3">
                  🔎 Fingerprint Image
                </div>{" "}
                {/* Title */}
                <div className="flex justify-center">
                  {" "}
                  {/* Center content */}
                  {selectedDetection.filename ? ( // Image exists
                    <img
                      src={`http://localhost:8080/uploads/${selectedDetection.filename}`} // Image URL
                      alt="Fingerprint" // Alt text
                      className="h-48 object-contain rounded-xl border border-[#99B19C]/40 shadow" // Styling
                      onError={(e) => {
                        // Error fallback
                        console.log(
                          "Fingerprint image failed to load:",
                          e.target.src
                        ); // Log
                        e.target.style.display = "none"; // Hide broken image
                        e.target.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-48 w-64 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]">
                          <div class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-[#99B19C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-sm font-medium italic">No fingerprint image available</p>
                          </div>
                        </div>
                      `; // Replace with placeholder block
                      }}
                    />
                  ) : (
                    // No image
                    <div className="flex items-center justify-center h-48 w-64 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]">
                      {" "}
                      {/* Placeholder */}
                      <div className="text-center">
                        {" "}
                        {/* Centered content */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto mb-2 text-[#99B19C]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {" "}
                          {/* Icon */}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />{" "}
                          {/* Path */}
                        </svg>
                        <p className="text-sm font-medium italic">
                          No fingerprint image available
                        </p>{" "}
                        {/* Label */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Report Information */}
              <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#e9ecef] mb-3">
                {" "}
                {/* Info card */}
                <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                  ℹ️ Report Information
                </div>{" "}
                {/* Title */}
                <div className="text-xs">
                  {" "}
                  {/* Text */}
                  <p className="mb-1">
                    {" "}
                    {/* Line */}
                    <strong className="text-[#6D2932]">Generated:</strong>{" "}
                    {/* Label */}
                    <span className="text-[#495057] font-medium break-words">
                      {" "}
                      {/* Value */}
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }) +
                        ", " +
                        new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                    {" | "}
                    <strong className="text-[#6D2932]">System:</strong>{" "}
                    {/* Label */}
                    <span className="text-[#495057] font-medium break-words">
                      {" "}
                      {/* Value */}
                      Bindu AI v1.0.0
                    </span>
                  </p>
                  <p className="mb-0.5">
                    {" "}
                    {/* Line */}
                    <strong className="text-[#6D2932]">Accuracy:</strong>{" "}
                    {/* Label */}
                    <span className="text-green-600 font-medium break-words">
                      {" "}
                      {/* Value */}
                      94.88%
                    </span>{" "}
                    | <strong className="text-[#6D2932]">Note:</strong>{" "}
                    {/* Separator + Label */}
                    <span className="text-[#495057] font-medium break-words">
                      {" "}
                      {/* Value */}
                      AI-generated results for informational purposes only.
                    </span>
                  </p>
                </div>
              </div>
              {/* Footer */}
              <div className="text-center border-t border-[#D7D1C9] pt-1 text-[10px] text-gray-600 mt-1">
                {" "}
                {/* Footer */}
                <p>
                  <strong>Disclaimer:</strong> For informational purposes only.
                  Consult medical professionals for clinical decisions.
                </p>{" "}
                {/* Disclaimer */}
                <p>
                  © {new Date().getFullYear()} Bindu - AI-Powered Blood Group
                  Detection System
                </p>{" "}
                {/* Copyright */}
              </div>
              {/* Download Button */}
              <div className="flex justify-center mt-2">
                {" "}
                {/* Button wrapper */}
                <button
                  onClick={() => handleDownloadReport(selectedDetection)}
                  className="px-3 py-1 rounded-full bg-[#6D2932] text-[#FAF5EF] font-medium transition-all duration-300 border border-[#6D2932] hover:scale-105 hover:shadow-lg text-xs"
                >
                  {" "}
                  {/* Button */}
                  📝 Download PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
