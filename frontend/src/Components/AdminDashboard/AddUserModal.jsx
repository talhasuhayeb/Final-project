import React from "react"; // Import React for JSX

// AddUserModal renders the modal for adding a new user
export default function AddUserModal({
  modalOpen,
  setModalOpen,
  newUser,
  setNewUser,
  errors,
  handleAddUser,
}) {
  if (!modalOpen) return null; // Only render if open
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
      {" "}
      {/* Modal backdrop */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {" "}
        {/* Modal card */}
        <div className="p-5 border-b border-[#D7D1C9]/60">
          {" "}
          {/* Header */}
          <div className="flex justify-between items-center">
            {" "}
            {/* Title + close */}
            <h3 className="text-lg font-bold text-[#6D2932]">Add New User</h3>
            <button
              onClick={() => setModalOpen(false)} // Close modal
              className="p-1 rounded-full hover:bg-[#D7D1C9]/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-5">
          {" "}
          {/* Form body */}
          <form onSubmit={handleAddUser}>
            {" "}
            {/* Form */}
            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            {/* Gender */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Gender
              </label>
              <select
                value={newUser.gender}
                onChange={(e) =>
                  setNewUser({ ...newUser, gender: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Phone */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Phone
              </label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                placeholder="11 digits"
                pattern="[0-9]{11}"
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            {/* Date of Birth */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Date of Birth
              </label>
              <input
                type="date"
                value={newUser.dateOfBirth}
                onChange={(e) =>
                  setNewUser({ ...newUser, dateOfBirth: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
              />
            </div>
            {/* Role */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-[#6D2932]">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#D7D1C9] bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99B19C]"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              {" "}
              {/* Buttons */}
              <button
                type="button"
                onClick={() => setModalOpen(false)} // Cancel
                className="px-4 py-2 border border-[#D7D1C9] rounded-lg text-[#6D2932] bg-white/60 hover:bg-[#D7D1C9]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6D2932] text-white rounded-lg hover:bg-[#99B19C] transition-colors shadow-md"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
