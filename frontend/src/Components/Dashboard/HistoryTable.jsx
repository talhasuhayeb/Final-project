import React from "react";
import { createPortal } from "react-dom";

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
  const [imageError, setImageError] = React.useState(false);

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
            <thead className="bg-[#C7B7A3] text-[#6D2932]">
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
      {createPortal(
        modalIsOpen && selectedDetection ? (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center px-2"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >
            {/* Modal content */}
            <div
              className="
                bg-white rounded-2xl shadow-2xl p-2 sm:p-4 max-w-2xl w-full
                relative z-10 animate-fade-in m-2
                flex flex-col
                max-h-[95vh] overflow-y-auto
              "
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#333",
                lineHeight: 1.2,
              }}
            >
              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setSelectedDetection(null);
                  setImageError(false);
                }}
                className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C] w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0EBE3]"
                aria-label="Close"
              >
                &times;
              </button>
              {/* Report Header */}
              <div className="text-center border-b-2 border-[#6D2932] pb-2 mb-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-xl font-bold text-[#6D2932] mb-1">
                  <img
                    src={logo}
                    alt="Bindu Logo"
                    className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover rounded-lg"
                  />
                  <span>Bindu</span>
                </div>
                <div className="text-[#99B19C] text-xs">
                  AI-Powered Blood Group Detection System
                </div>
                <div className="text-base font-bold text-[#6D2932] mt-1">
                  Blood Group Detection Report
                </div>
              </div>
              {/* Content Grid - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {/* User Information Section */}
                <div className="border border-[#D7D1C9] rounded-lg p-3 bg-[#FAF5EF]">
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    👤 User Information
                  </div>
                  <div className="flex justify-between items-start text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Profile ID:
                    </span>
                    <span className="text-[#99B19C] font-medium text-xs break-words max-w-[calc(100%-80px)]">
                      {userProfile &&
                      (userProfile.profile_id || userProfile._id)
                        ? userProfile.profile_id ||
                          `${userProfile._id.toString().substring(0, 8)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Full Name:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {userProfile.name || loggedInUser || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Gender:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {userProfile.gender || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Email:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {userProfile.email || userEmail || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Date of Birth:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
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
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    📋 Analysis Details
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[80px]">
                      Analysis ID:
                    </span>
                    <span className="text-[#99B19C] font-medium text-sm break-words max-w-[calc(100%-100px)]">
                      {selectedDetection &&
                      (selectedDetection.analysis_id || selectedDetection._id)
                        ? selectedDetection.analysis_id ||
                          `${selectedDetection._id.toString().substring(0, 8)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Date:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {new Date(selectedDetection.timestamp).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Time:
                    </span>
                    <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                      {new Date(selectedDetection.timestamp).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                </div>
                {/* Detection Results Section */}
                <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#FAF5EF]">
                  <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                    🩸 Detection Results
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[80px]">
                      Blood Type:
                    </span>
                    <span className="font-bold text-[#800000] text-base break-words max-w-[calc(100%-100px)]">
                      {selectedDetection.bloodGroup}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Confidence:
                    </span>
                    <span className="font-bold text-green-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {selectedDetection.confidence || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Image Quality:
                    </span>
                    <span className="font-bold text-purple-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {selectedDetection.imageQuality || 0}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
                    <span className="font-bold text-[#6D2932] min-w-[70px]">
                      Processing:
                    </span>
                    <span className="font-bold text-blue-600 text-xs break-words max-w-[calc(100%-80px)]">
                      {selectedDetection.processingTime || 0}ms
                    </span>
                  </div>
                </div>
              </div>
              {/* Image Section */}
              <div className="border border-[#D7D1C9] rounded-md p-3 mb-3 text-center">
                <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-3">
                  🔎 Fingerprint Image
                </div>
                <div className="flex justify-center">
                  {selectedDetection.filename && !imageError ? (
                    <img
                      src={`http://localhost:8080/uploads/${selectedDetection.filename}`}
                      alt="Fingerprint"
                      className="h-40 sm:h-48 object-contain rounded-xl border border-[#99B19C]/40 shadow max-w-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 sm:h-48 w-48 sm:w-64 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto mb-2 text-[#99B19C]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium italic">
                          No fingerprint image available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Report Information */}
              <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#e9ecef] mb-3">
                <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
                  ℹ️ Report Information
                </div>
                <div className="text-xs">
                  <p className="mb-1">
                    <strong className="text-[#6D2932]">Generated:</strong>
                    <span className="text-[#495057] font-medium break-words">
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
                    <strong className="text-[#6D2932]">System:</strong>
                    <span className="text-[#495057] font-medium break-words">
                      Bindu AI v1.0.0
                    </span>
                  </p>
                  <p className="mb-0.5">
                    <strong className="text-[#6D2932]">Accuracy:</strong>
                    <span className="text-green-600 font-medium break-words">
                      94.88%
                    </span>
                    {" | "}
                    <strong className="text-[#6D2932]">Note:</strong>
                    <span className="text-[#495057] font-medium break-words">
                      AI-generated results for informational purposes only.
                    </span>
                  </p>
                </div>
              </div>
              {/* Footer */}
              <div className="text-center border-t border-[#D7D1C9] pt-1 text-[10px] text-gray-600 mt-1">
                <p>
                  <strong>Disclaimer:</strong> For informational purposes only.
                  Consult medical professionals for clinical decisions.
                </p>
                <p>
                  © {new Date().getFullYear()} Bindu - AI-Powered Blood Group
                  Detection System
                </p>
              </div>
              {/* Download Button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleDownloadReport(selectedDetection)}
                  className="px-3 py-1 rounded-full bg-[#6D2932] text-[#FAF5EF] font-medium transition-all duration-300 border border-[#6D2932] hover:scale-105 hover:shadow-lg text-xs"
                >
                  📝 Download PDF Report
                </button>
              </div>
            </div>
          </div>
        ) : null,
        document.getElementById("modal-root")
      )}
    </div>
  );
}
