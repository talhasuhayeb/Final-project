import React from "react"; // Import React for JSX
import { ToastContainer } from "react-toastify"; // Import Toast container (parent already provides toasts)
import { motion } from "framer-motion";

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
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 70 },
    }),
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg flex flex-col items-center gap-8">
      <motion.h2
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="text-2xl font-bold text-[#6D2932]"
      >
        Upload Fingerprint
      </motion.h2>
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full"
      >
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="file-input file-input-bordered w-full border border-[#99B19C] rounded-lg bg-white/70 text-[#6D2932] focus:border-[#6D2932] focus:outline-none"
        />
        {selectedImage && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full h-40 rounded-xl shadow object-contain border border-[#99B19C]/40"
            />
            <button
              onClick={onRemoveImage}
              className="px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300 shadow border-2 border-red-500 hover:border-red-600 text-xs"
            >
              Remove Image
            </button>
          </div>
        )}
      </motion.div>
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex flex-col gap-2 w-full"
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sendEmailChecked}
            onChange={(e) => setSendEmailChecked(e.target.checked)}
            className="w-4 h-4 text-[#6D2932] border-2 border-[#99B19C] rounded"
          />
          <span className="text-[#6D2932] font-medium text-sm">
            📧 Email:{" "}
            <span className="font-semibold">{userEmail || "N/A"}</span>
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sendSMSChecked}
            onChange={(e) => setSendSMSChecked(e.target.checked)}
            className="w-4 h-4 text-[#6D2932] border-2 border-[#99B19C] rounded"
          />
          <span className="text-[#6D2932] font-medium text-sm">
            📱 SMS:{" "}
            <span className="font-semibold">{phoneNumber || "N/A"}</span>
          </span>
        </label>
      </motion.div>
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex gap-4 w-full"
      >
        <button
          onClick={onUpload}
          disabled={!selectedImageFile || isUploaded}
          className={`flex-1 px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none text-sm ${
            !selectedImageFile || isUploaded
              ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-[#C7B7A3] text-[#6D2932] border-[#C7B7A3] hover:bg-[#6D2932] hover:text-[#FAF5EF] hover:border-[#6D2932]"
          }`}
        >
          {isUploaded ? "Uploaded ✓" : "Upload"}
        </button>
        <button
          onClick={onDetect}
          disabled={!isUploaded}
          className={`flex-1 px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none text-sm ${
            !isUploaded
              ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-[#C7B7A3] text-[#6D2932] border-[#C7B7A3] hover:bg-[#6D2932] hover:text-[#FAF5EF] hover:border-[#6D2932]"
          }`}
        >
          Detect
        </button>
      </motion.div>
      {predictionResults && (
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="w-full"
        >
          <h3 className="text-lg font-bold mb-4 text-center text-[#6D2932]">
            Detection Results
          </h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-4 py-2 shadow-sm">
              <span className="flex items-center gap-2 text-[#6D2932] font-medium">
                🩸 Blood Group
              </span>
              <span className="bg-[#6D2932] text-[#FAF5EF] px-3 py-1 rounded-full font-bold">
                {predictionResults.bloodGroup}
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-4 py-2 shadow-sm">
              <span className="flex items-center gap-2 text-[#6D2932] font-medium">
                📈 Confidence
              </span>
              <span className="font-semibold text-green-600">
                {predictionResults.confidence}%
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-4 py-2 shadow-sm">
              <span className="flex items-center gap-2 text-[#6D2932] font-medium">
                ⏱️ Processing
              </span>
              <span className="font-semibold text-blue-600">
                {predictionResults.processingTime} ms
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-4 py-2 shadow-sm">
              <span className="flex items-center gap-2 text-[#6D2932] font-medium">
                🖼️ Quality
              </span>
              <span className="font-semibold text-purple-600">
                {predictionResults.imageQuality}/100
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-4 py-2 shadow-sm">
              <span className="flex items-center gap-2 text-[#6D2932] font-medium">
                🕒 Timestamp
              </span>
              <span className="font-semibold text-[#99B19C]">
                {predictionResults.timestamp
                  ? new Date(predictionResults.timestamp).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      <ToastContainer />
    </div>
  );
}
