import React from "react"; // Import React for JSX

// UsersTable lists all users with admin actions
export default function UsersTable({
  users,
  formatDate,
  handleToggleBlockUser,
  handleChangeRole,
  handleDeleteUser,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
      {" "}
      {/* Table container */}
      <table className="min-w-full text-xs sm:text-sm">
        {" "}
        {/* Table */}
        <thead className="bg-[#99B19C] text-[#6D2932]">
          {" "}
          {/* Header */}
          <tr>
            <th className="px-4 py-3 text-center font-semibold">Profile ID</th>
            <th className="px-4 py-3 text-center font-semibold">Name</th>
            <th className="px-4 py-3 text-center font-semibold">Email</th>
            <th className="px-4 py-3 text-center font-semibold">Gender</th>
            <th className="px-4 py-3 text-center font-semibold">Phone</th>
            <th className="px-4 py-3 text-center font-semibold">DOB</th>
            <th className="px-4 py-3 text-center font-semibold">
              Profile Picture
            </th>
            <th className="px-4 py-3 text-center font-semibold">Role</th>
            <th className="px-4 py-3 text-center font-semibold">Status</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {/* Body */}
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                className={`border-b border-[#D7D1C9]/60 hover:bg-[#D7D1C9]/30 transition-colors ${
                  user.isBlocked ? "bg-red-50" : ""
                }`}
              >
                {" "}
                {/* Row */}
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* ID */}
                  {user._id ? user._id.substring(0, 8) : "N/A"}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932] font-medium">
                  {/* Name */}
                  {user.name}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Email */}
                  {user.email}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Gender */}
                  {user.gender || "N/A"}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* Phone */}
                  {user.phone}
                </td>
                <td className="px-4 py-2 text-center text-[#6D2932]">
                  {/* DOB */}
                  {formatDate(user.dateOfBirth)}
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Avatar */}
                  {user.profilePicture ? (
                    <div className="flex justify-center">
                      {" "}
                      {/* Center image */}
                      <img
                        src={`http://localhost:8080${user.profilePicture}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover border border-[#99B19C]/40 shadow"
                        onError={(e) => {
                          // Fallback to avatar service
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=99B19C&color=FAF5EF&size=100`;
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Role select */}
                  <select
                    value={user.role || "user"}
                    onChange={(e) =>
                      handleChangeRole(user._id, user.name, e.target.value)
                    }
                    className="px-2 py-1 rounded-md border border-[#99B19C]/40 text-xs sm:text-sm bg-white/80"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Status */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {/* Actions */}
                  <div className="flex justify-center space-x-1">
                    {" "}
                    {/* Buttons */}
                    <button
                      onClick={() =>
                        handleToggleBlockUser(
                          user._id,
                          user.name,
                          user.isBlocked
                        )
                      } // Block/Unblock
                      className={`p-2 rounded-full text-white text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow ${
                        user.isBlocked
                          ? "bg-green-500 hover:bg-green-600 border-2 border-green-500 hover:border-green-600"
                          : "bg-orange-500 hover:bg-orange-600 border-2 border-orange-500 hover:border-orange-600"
                      }`}
                      title={
                        user.isBlocked
                          ? `Unblock ${user.name}`
                          : `Block ${user.name}`
                      }
                    >
                      {user.isBlocked ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {" "}
                          {/* Unlock icon */}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {" "}
                          {/* Ban icon */}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                          />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)} // Delete user
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center shadow border-2 border-red-500 hover:border-red-600"
                      title={`Delete ${user.name}`}
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
                        {/* Trash icon */}
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
              <td colSpan="12" className="text-center py-4 text-[#6D2932]">
                {/* Empty state */}
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
