import React from "react"; // Import React for JSX

// DetectionRecordsTable lists all detection records with admin actions
export default function DetectionRecordsTable({
  detectionRecords,
  formatDate,
  handleViewDetection,
  handleDownloadReport,
  handleDeleteDetectionRecord,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
      {" "}
      {/* Table container */}
      <table className="min-w-full text-xs sm:text-sm">
        {" "}
        {/* Table */}
        <thead className="bg-[#C7B7A3] text-[#6D2932]">
          {" "}
          {/* Header */}
          <tr>
            <th className="px-4 py-3 text-center font-semibold">Date & Time</th>
            <th className="px-4 py-3 text-center font-semibold">Analysis ID</th>
            <th className="px-4 py-3 text-center font-semibold">User</th>
            <th className="px-4 py-3 text-center font-semibold">Blood Group</th>
            <th className="px-4 py-3 text-center font-semibold">Confidence</th>
            <th className="px-4 py-3 text-center font-semibold">
              Processing Time
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Image Quality
            </th>
            <th className="px-4 py-3 text-center font-semibold">Fingerprint</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {/* Body */}
          {detectionRecords && detectionRecords.length > 0 ? (
            detectionRecords.map((record) => (
              <tr
                key={record.analysis_id || record._id}
                className="border-b border-[#D7D1C9]/60 hover:bg-[#D7D1C9]/30 transition-colors"
              >
                {" "}
                {/* Row */}
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Date & Time */}
                  {formatDate(record.timestamp)}{" "}
                  {new Date(record.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Analysis ID */}
                  {record.analysis_id ||
                    (record._id
                      ? record._id.toString().substring(0, 8)
                      : "N/A")}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932] font-medium">
                  {/* User */}
                  {record.userName}
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Blood Group */}
                  <span className="bg-[#6D2932] text-[#FAF5EF] px-2 py-1 rounded-full font-bold text-xs sm:text-sm">
                    {record.bloodGroup}
                  </span>
                </td>
                <td className="px-4 py-2 text-center text-green-600 font-medium">
                  {/* Confidence */}
                  {record.confidence.toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Processing Time */}
                  {record.processingTime.toFixed(2)}ms
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Image Quality */}
                  {record.imageQuality.toFixed(0)}%
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Fingerprint */}
                  <div className="flex justify-center">
                    {" "}
                    {/* Center image */}
                    <img
                      src={`http://localhost:8080/uploads/${record.filename}`}
                      alt="Fingerprint"
                      className="w-12 h-12 object-cover rounded-xl border border-[#99B19C]/40 shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://static.vecteezy.com/system/resources/previews/000/546/269/original/fingerprint-icon-vector-illustration.jpg";
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Actions */}
                  <div className="flex justify-center space-x-2">
                    {" "}
                    {/* Button group */}
                    <button
                      onClick={() => handleViewDetection(record)} // View modal
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-blue-500 hover:border-blue-600"
                      title="View full report"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(record)} // Download PDF
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-green-500 hover:border-green-600"
                      title="Download PDF report"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteDetectionRecord(
                          record._id || record.analysis_id,
                          record.timestamp
                        )
                      } // Delete record
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-red-500 hover:border-red-600"
                      title="Delete detection record"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-[#6D2932]">
                {/* Empty state */}
                No detection records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
