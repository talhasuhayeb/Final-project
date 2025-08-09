import React from "react"; // Import React for JSX
import logo from "../../assets/logo.png"; // Logo for modal header

// DetectionRecordModal renders the modal for viewing a detection record
export default function DetectionRecordModal({
  recordModalIsOpen,
  selectedDetection,
  setRecordModalIsOpen,
  setSelectedDetection,
  handleDownloadReport,
  formatDate,
}) {
  if (!recordModalIsOpen || !selectedDetection) return null; // Only render if open and record selected
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ alignItems: "flex-start", paddingTop: "1vh" }}
    >
      {" "}
      {/* Modal backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setRecordModalIsOpen(false);
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
        {/* Modal card */}
        <button
          onClick={() => {
            setRecordModalIsOpen(false);
            setSelectedDetection(null);
          }}
          className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C] w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0EBE3]"
          aria-label="Close"
        >
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
            </div>
            <div className="flex justify-between items-start text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Profile ID:
              </span>
              <span className="text-[#99B19C] font-medium text-xs break-words max-w-[calc(100%-80px)]">
                {selectedDetection.userId
                  ? selectedDetection.userId.substring(0, 8)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Full Name:
              </span>
              <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                {selectedDetection.userName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Gender:
              </span>
              <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                {selectedDetection.userGender || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Email:
              </span>
              <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                {selectedDetection.userEmail || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Date of Birth:
              </span>
              <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                {selectedDetection.userDateOfBirth
                  ? formatDate(selectedDetection.userDateOfBirth)
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
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[80px]">
                Analysis ID:
              </span>
              <span className="text-[#99B19C] font-medium text-sm break-words max-w-[calc(100%-100px)]">
                {selectedDetection.analysis_id ||
                  (selectedDetection._id
                    ? selectedDetection._id.toString().substring(0, 8)
                    : "N/A")}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Date:
              </span>
              <span className="text-[#99B19C] font-medium break-words max-w-[calc(100%-80px)]">
                {formatDate(selectedDetection.timestamp)}
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
            {" "}
            {/* Results card */}
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
                {selectedDetection.confidence
                  ? selectedDetection.confidence.toFixed(2)
                  : "0"}
                %
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Image Quality:
              </span>
              <span className="font-bold text-purple-600 text-xs break-words max-w-[calc(100%-80px)]">
                {selectedDetection.imageQuality
                  ? selectedDetection.imageQuality.toFixed(0)
                  : "0"}
                /100
              </span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-dotted border-[#D7D1C9]">
              <span className="font-bold text-[#6D2932] min-w-[70px]">
                Processing:
              </span>
              <span className="font-bold text-blue-600 text-xs break-words max-w-[calc(100%-80px)]">
                {selectedDetection.processingTime
                  ? selectedDetection.processingTime.toFixed(2)
                  : "0"}
                ms
              </span>
            </div>
          </div>
        </div>
        {/* Report Information */}
        <div className="border border-[#D7D1C9] rounded-md p-3 bg-[#e9ecef] mb-3">
          {" "}
          {/* Info card */}
          <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-1">
            ℹ️ Report Information
          </div>
          <div className="text-xs">
            <p className="mb-1">
              <strong className="text-[#6D2932]">Generated:</strong>{" "}
              <span className="text-[#495057] font-medium break-words">
                {formatDate(new Date())},{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>{" "}
              | <strong className="text-[#6D2932]">System:</strong>{" "}
              <span className="text-[#495057] font-medium break-words">
                Bindu AI v1.0.0
              </span>
            </p>
            <p className="mb-0.5">
              <strong className="text-[#6D2932]">Accuracy:</strong>{" "}
              <span className="text-green-600 font-medium break-words">
                94.88%
              </span>{" "}
              | <strong className="text-[#6D2932]">Note:</strong>{" "}
              <span className="text-[#495057] font-medium break-words">
                AI-generated results for informational purposes only.
              </span>
            </p>
          </div>
        </div>
        {/* Image Section */}
        <div className="border border-[#D7D1C9] rounded-md p-3 mb-3 text-center">
          {" "}
          {/* Image card */}
          <div className="text-xs font-bold text-[#6D2932] border-b border-[#99B19C] pb-1 mb-3">
            🔎 Fingerprint Image
          </div>
          <div className="flex justify-center">
            {selectedDetection.filename ? (
              <img
                src={`http://localhost:8080/uploads/${selectedDetection.filename}`}
                alt="Fingerprint"
                className="h-48 object-contain rounded-xl border border-[#99B19C]/40 shadow"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class='flex items-center justify-center h-48 w-64 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]'><div class='text-center'><svg xmlns='http://www.w3.org/2000/svg' class='h-12 w-12 mx-auto mb-2 text-[#99B19C]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/></svg><p class='text-sm font-medium italic'>No fingerprint image available</p></div></div>`;
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-48 w-64 border-2 border-dashed border-[#D7D1C9] rounded-xl bg-[#FAF5EF] text-[#6D2932]">
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
        {/* Footer */}
        <div className="text-center border-t border-[#D7D1C9] pt-1 text-[10px] text-gray-600 mt-1">
          {" "}
          {/* Footer */}
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
          {" "}
          {/* Button wrapper */}
          <button
            onClick={() => handleDownloadReport(selectedDetection)}
            className="px-3 py-1 rounded-full bg-[#6D2932] text-[#FAF5EF] font-medium transition-all duration-300 border border-[#6D2932] hover:scale-105 hover:shadow-lg text-xs"
          >
            📝 Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
