import React from "react"; // Import React for JSX

// DetectionFilters renders the filter/search controls for detection records
export default function DetectionFilters({
  users,
  recordFilters,
  handleFilterChange,
  applyFilters,
  resetFilters,
  isSearching,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md mb-6 border border-[#99B19C]/40">
      {" "}
      {/* Filters card */}
      <h3 className="text-sm font-semibold mb-3 text-[#6D2932]">
        Filter Records
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {" "}
        {/* Grid for filters */}
        <div>
          <label className="block text-xs font-medium text-[#6D2932] mb-1">
            User
          </label>
          <select
            name="userId"
            value={recordFilters.userId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-[#D7D1C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6D2932] mb-1">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={recordFilters.bloodGroup}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-[#D7D1C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
          >
            <option value="">All Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6D2932] mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={recordFilters.startDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-[#D7D1C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6D2932] mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={recordFilters.endDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-[#D7D1C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
          />
        </div>
      </div>
      {/* Search bar and buttons in one line */}
      <div className="flex items-center mt-4 space-x-3">
        {" "}
        {/* Row for search and buttons */}
        <div className="relative flex items-center flex-grow mr-2">
          {" "}
          {/* Search input */}
          <input
            type="text"
            name="search"
            value={recordFilters.search}
            onChange={handleFilterChange}
            placeholder="Search by name, blood group, analysis ID..."
            className="px-3 py-1.5 pr-8 text-xs border border-[#D7D1C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C] placeholder-gray-400 w-full"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="animate-spin h-3 w-3 border-2 border-[#99B19C] border-t-transparent rounded-full"></div>
            ) : recordFilters.search ? (
              <button
                onClick={resetFilters}
                className="text-gray-400 hover:text-[#6D2932] transition-colors"
                title="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-1.5 border border-[#D7D1C9] rounded-lg text-[#6D2932] hover:bg-[#D7D1C9]/30 transition-colors text-xs"
        >
          Reset Filters
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-1.5 bg-[#6D2932] text-white rounded-lg hover:bg-[#99B19C] transition-colors text-xs"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
