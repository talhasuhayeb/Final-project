import React from "react"; // Import React for JSX
import { ToastContainer } from "react-toastify"; // Import Toast container (parent already provides toasts)

// DetectionPanel renders image upload, toggles, action buttons and results
export default function DetectionPanel({
  selectedImage,
  selectedImageFile,
  sendEmailChecked,
  setSendEmailChecked,
  sendSMSChecked,
  setSendSMSChecked,
  userEmail,
  phoneNumber,
  isUploaded,
  predictionResults,
  onImageChange,
  onRemoveImage,
  onUpload,
  onDetect,
}) {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
      {" "}
      {/* Card container */}
      <h2 className="text-2xl font-extrabold mb-6 text-center text-[#6D2932] tracking-tight">
        {" "}
        {/* Title */}
        Upload Fingerprint
      </h2>
      <div className="flex flex-col items-center space-y-6 text-xs sm:text-sm">
        {" "}
        {/* Content stack */}
        <input
          type="file" // File input for image
          accept="image/*" // Only images allowed
          onChange={onImageChange} // Handle image selection
          className="file-input file-input-bordered w-full max-w-md border border-[#99B19C] rounded-lg bg-white/70 text-[#6D2932] focus:border-[#6D2932] focus:outline-none text-xs sm:text-sm" // Styled input
        />
        {selectedImage && (
          <div className="flex flex-col items-center space-y-2">
            {" "}
            {/* Preview wrapper */}
            <img
              src={selectedImage} // Preview image data URL
              alt="Preview" // Accessible alt text
              className="mt-4 max-w-full h-64 rounded-xl shadow object-contain border border-[#99B19C]/40" // Image styles
            />
            <button
              onClick={onRemoveImage} // Remove preview and file
              className="px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300 shadow border-2 border-red-500 hover:border-red-600 text-xs sm:text-sm" // Button style
            >
              Remove Image
            </button>
          </div>
        )}
        {/* Email and SMS Checkboxes */}
        <div className="flex flex-col items-center space-y-3 w-full">
          {" "}
          {/* Group toggles */}
          {/* Email Checkbox */}
          <div className="flex items-center justify-center space-x-3 w-full">
            {" "}
            {/* Email toggle */}
            <input
              type="checkbox" // Checkbox input
              id="sendEmailCheckbox" // Identifier for label
              checked={sendEmailChecked} // Controlled state
              onChange={(e) => setSendEmailChecked(e.target.checked)} // Update state
              className="w-4 h-4 text-[#6D2932] bg-white border-2 border-[#99B19C] rounded focus:ring-[#6D2932] focus:ring-2" // Styles
            />
            <label
              htmlFor="sendEmailCheckbox" // Link to input
              className="text-[#6D2932] font-medium text-xs sm:text-sm cursor-pointer select-none" // Label style
            >
              📧 Send prediction results to my email (
              {userEmail || "email not found"}) {/* Show email or fallback */}
            </label>
          </div>
          {/* SMS Checkbox */}
          <div className="flex items-center justify-center space-x-3 w-full">
            {" "}
            {/* SMS toggle */}
            <input
              type="checkbox" // Checkbox input
              id="sendSMSCheckbox" // Identifier for label
              checked={sendSMSChecked} // Controlled state
              onChange={(e) => setSendSMSChecked(e.target.checked)} // Update state
              className="w-4 h-4 text-[#6D2932] bg-white border-2 border-[#99B19C] rounded focus:ring-[#6D2932] focus:ring-2" // Styles
            />
            <label
              htmlFor="sendSMSCheckbox" // Link to input
              className="text-[#6D2932] font-medium text-xs sm:text-sm cursor-pointer select-none" // Label style
            >
              📱 Send prediction results to my phone (
              {phoneNumber || "phone not found"}) {/* Show phone or fallback */}
            </label>
          </div>
        </div>
        {/* Upload/Detect Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {" "}
          {/* Buttons container */}
          <button
            onClick={onUpload} // Upload the selected image (local state flag)
            disabled={!selectedImageFile || isUploaded} // Disable until file selected or already uploaded
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm ${
              !selectedImageFile || isUploaded
                ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-[#99B19C] text-[#6D2932] border-[#99B19C] hover:bg-[#6D2932] hover:text-[#FAF5EF] hover:border-[#6D2932]"
            }`} // Conditional styling
          >
            {isUploaded ? "Uploaded ✓" : "Upload"} {/* Dynamic label */}
          </button>
          <button
            onClick={onDetect} // Call detect handler
            disabled={!isUploaded} // Require upload flag first
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm ${
              !isUploaded
                ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-[#6D2932] text-[#FAF5EF] border-[#6D2932] hover:bg-[#99B19C] hover:text-[#6D2932] hover:border-[#99B19C]"
            }`} // Conditional styling
          >
            Detect {/* Detect label */}
          </button>
        </div>
        {/* Prediction Results Table */}
        {predictionResults && (
          <div className="w-full mt-8">
            {" "}
            {/* Results wrapper */}
            <h3 className="text-lg font-bold mb-4 text-center text-[#6D2932]">
              {" "}
              {/* Section title */}
              Detection Results
            </h3>
            <div className="overflow-x-auto">
              {" "}
              {/* Enable horizontal scroll on small screens */}
              <table className="min-w-full bg-white/90 border border-[#99B19C]/40 rounded-xl shadow text-xs sm:text-sm">
                {" "}
                {/* Results table */}
                <thead className="bg-[#99B19C] text-[#6D2932]">
                  {" "}
                  {/* Header row */}
                  <tr>
                    <th className="px-4 py-2 text-center font-semibold">
                      {" "}
                      {/* Column name */}
                      Metric
                    </th>
                    <th className="px-4 py-2 text-center font-semibold">
                      {" "}
                      {/* Column value */}
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {/* Body rows with metrics */}
                  <tr className="border-b border-[#D7D1C9]">
                    {" "}
                    {/* Blood group row */}
                    <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                      {" "}
                      {/* Metric label */}
                      Detected Blood Group
                    </td>
                    <td className="px-4 py-2 text-center">
                      {" "}
                      {/* Metric value */}
                      <span className="bg-[#6D2932] text-[#FAF5EF] px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                        {" "}
                        {/* Pill */}
                        {predictionResults.bloodGroup} {/* Blood group text */}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-[#D7D1C9]">
                    {" "}
                    {/* Confidence row */}
                    <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                      {" "}
                      {/* Label */}
                      Confidence Score
                    </td>
                    <td className="px-4 py-2 font-semibold text-green-600 text-center">
                      {" "}
                      {/* Value */}
                      {predictionResults.confidence}%{" "}
                      {/* Confidence percentage */}
                    </td>
                  </tr>
                  <tr className="border-b border-[#D7D1C9]">
                    {" "}
                    {/* Processing time row */}
                    <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                      {" "}
                      {/* Label */}
                      Processing Time
                    </td>
                    <td className="px-4 py-2 font-semibold text-blue-600 text-center">
                      {" "}
                      {/* Value */}
                      {predictionResults.processingTime} ms {/* Milliseconds */}
                    </td>
                  </tr>
                  <tr className="border-b border-[#D7D1C9]">
                    {" "}
                    {/* Image quality row */}
                    <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                      {" "}
                      {/* Label */}
                      Image Quality Score
                    </td>
                    <td className="px-4 py-2 font-semibold text-purple-600 text-center">
                      {" "}
                      {/* Value */}
                      {predictionResults.imageQuality}/100 {/* Quality score */}
                    </td>
                  </tr>
                  <tr>
                    {" "}
                    {/* Timestamp row */}
                    <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                      {" "}
                      {/* Label */}
                      Prediction Timestamp
                    </td>
                    <td className="px-4 py-2 font-semibold text-[#99B19C] text-center">
                      {" "}
                      {/* Value */}
                      {predictionResults.timestamp
                        ? new Date(predictionResults.timestamp).toLocaleString() // Format timestamp
                        : "N/A"}{" "}
                      {/* Fallback */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        <ToastContainer />{" "}
        {/* Mount toast container (safe to include multiple) */}
      </div>
    </div>
  );
}
