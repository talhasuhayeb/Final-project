import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Note: You need to install date-fns using: npm install date-fns
// For date formatting

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "detection"
  const [detectionRecords, setDetectionRecords] = useState([]);
  const [recordFilters, setRecordFilters] = useState({
    userId: "",
    bloodGroup: "",
    startDate: "",
    endDate: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    gender: "Male",
    phone: "",
    dateOfBirth: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    setAdminName(loggedInUser || "Admin");
    fetchUsers(token);
    fetchDetectionRecords(token);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await fetch("http://localhost:8080/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchDetectionRecords = async (token, filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append("userId", filters.userId);
      if (filters.bloodGroup)
        queryParams.append("bloodGroup", filters.bloodGroup);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const url = `http://localhost:8080/admin/detection-records?${queryParams.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setDetectionRecords(data.records || []);
      } else {
        toast.error(data.message || "Failed to fetch detection records");
      }
    } catch (err) {
      toast.error("Failed to fetch detection records");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Admin Logged Out Successfully", { position: "top-center" });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const options = { year: "numeric", month: "short", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleToggleBlockUser = async (userId, userName, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";

    if (
      !window.confirm(`Are you sure you want to ${action} user "${userName}"?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}/block`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(`User "${userName}" ${action}ed successfully`, {
          position: "top-center",
        });
        // Refresh the users list
        fetchUsers(token);
      } else {
        toast.error(result.message || `Failed to ${action} user`, {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error(`Error ${action}ing user`, { position: "top-center" });
    }
  };

  const handleChangeRole = async (userId, userName, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change "${userName}"'s role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Changed "${userName}"'s role to ${newRole} successfully`,
          {
            position: "top-center",
          }
        );
        // Refresh the users list
        fetchUsers(token);
      } else {
        toast.error(result.message || "Failed to change user role", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error changing user role", { position: "top-center" });
    }
  };

  const validateForm = () => {
    const formErrors = {};

    if (!newUser.name.trim()) formErrors.name = "Name is required";
    if (!newUser.email.trim()) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newUser.email))
      formErrors.email = "Email is invalid";

    if (!newUser.password.trim()) formErrors.password = "Password is required";
    else if (newUser.password.length < 4)
      formErrors.password = "Password must be at least 4 characters";

    if (!newUser.phone.trim()) formErrors.phone = "Phone is required";
    else if (!/^[0-9]{11}$/.test(newUser.phone))
      formErrors.phone = "Phone must be 11 digits";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User added successfully", { position: "top-center" });
        setModalOpen(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          gender: "Male",
          phone: "",
          dateOfBirth: "",
          role: "user",
        });
        fetchUsers(token);
      } else {
        toast.error(result.message || "Failed to add user", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error adding user", { position: "top-center" });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setRecordFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const token = localStorage.getItem("token");
    fetchDetectionRecords(token, recordFilters);
  };

  const resetFilters = () => {
    setRecordFilters({
      userId: "",
      bloodGroup: "",
      startDate: "",
      endDate: "",
    });
    const token = localStorage.getItem("token");
    fetchDetectionRecords(token, {});
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(`User "${userName}" deleted successfully`, {
          position: "top-center",
        });
        // Refresh the users list
        fetchUsers(token);
      } else {
        toast.error(result.message || "Failed to delete user", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error deleting user", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40 flex flex-col p-0">
      {/* Admin Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#D7D1C9]/60 shadow-lg px-4 sm:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <span className="font-bold text-xl sm:text-2xl text-[#6D2932] tracking-tight group-hover:text-[#99B19C] transition-colors duration-300">
              Admin Panel
            </span>
            <span className="text-xs text-[#99B19C] opacity-70 font-medium hidden sm:inline-block">
              User Management
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-xs sm:text-sm text-[#99B19C]">
              Welcome, {adminName}
            </span>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-1.5 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#99B19C] hover:border-[#6D2932] focus:outline-none focus:ring-2 focus:ring-[#6D2932]/50 text-xs sm:text-sm"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-5xl mx-auto py-8 px-2 sm:px-6">
        {/* Tabs */}
        <div className="flex border-b border-[#D7D1C9] mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-all duration-300 ${
              activeTab === "users"
                ? "border-b-2 border-[#6D2932] text-[#6D2932] font-bold"
                : "text-gray-500 hover:text-[#6D2932]"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("detection")}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-all duration-300 ${
              activeTab === "detection"
                ? "border-b-2 border-[#6D2932] text-[#6D2932] font-bold"
                : "text-gray-500 hover:text-[#6D2932]"
            }`}
          >
            Blood Group Detection Records
          </button>
        </div>

        {/* Users Section */}
        {activeTab === "users" && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#6D2932] tracking-tight">
                All Users
              </h2>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add User
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-[#99B19C] text-[#6D2932]">
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">DOB</th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Profile Picture
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className={`border-b border-[#D7D1C9]/60 hover:bg-[#D7D1C9]/30 transition-colors ${
                          user.isBlocked ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-4 py-2 text-center text-[#6D2932] font-medium">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {user.gender || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {user.phone}
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {formatDate(user.dateOfBirth)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {user.profilePicture ? (
                            <div className="flex justify-center">
                              <img
                                src={`http://localhost:8080${user.profilePicture}`}
                                alt="Profile"
                                className="w-12 h-12 rounded-xl object-cover border border-[#99B19C]/40 shadow"
                                onError={(e) => {
                                  console.log(
                                    "Image failed to load:",
                                    e.target.src
                                  );
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(user.name) +
                                    "&background=99B19C&color=FAF5EF&size=100";
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <select
                            value={user.role || "user"}
                            onChange={(e) =>
                              handleChangeRole(
                                user._id,
                                user.name,
                                e.target.value
                              )
                            }
                            className="px-2 py-1 rounded-md border border-[#99B19C]/40 text-xs sm:text-sm bg-white/80"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
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
                          <div className="flex justify-center space-x-1">
                            <button
                              onClick={() =>
                                handleToggleBlockUser(
                                  user._id,
                                  user.name,
                                  user.isBlocked
                                )
                              }
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
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 15v2m0 0v2m0-2h2m-2 0H9m3 0a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(user._id, user.name)
                              }
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
                      <td
                        colSpan="11"
                        className="text-center py-4 text-[#6D2932]"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Detection Records Section */}
        {activeTab === "detection" && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#6D2932] tracking-tight">
                Blood Group Detection Records
              </h2>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md mb-6 border border-[#99B19C]/40">
              <h3 className="text-sm font-semibold mb-3 text-[#6D2932]">
                Filter Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="flex justify-end space-x-3 mt-4">
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

            {/* Records Table */}
            <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-[#99B19C] text-[#6D2932]">
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      User
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Blood Group
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Processing Time
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Image Quality
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Fingerprint
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detectionRecords && detectionRecords.length > 0 ? (
                    detectionRecords.map((record) => (
                      <tr
                        key={record.analysis_id || record._id}
                        className="border-b border-[#D7D1C9]/60 hover:bg-[#D7D1C9]/30 transition-colors"
                      >
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {formatDate(record.timestamp)}{" "}
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932] font-medium">
                          {record.userName}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="bg-[#6D2932] text-[#FAF5EF] px-2 py-1 rounded-full font-bold text-xs sm:text-sm">
                            {record.bloodGroup}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-green-600 font-medium">
                          {record.confidence.toFixed(2)}%
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {record.processingTime.toFixed(2)}ms
                        </td>
                        <td className="px-4 py-2 text-center text-[#6D2932]">
                          {record.imageQuality.toFixed(0)}%
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center">
                            <img
                              src={`http://localhost:8080/uploads/${record.filename}`}
                              alt="Fingerprint"
                              className="w-12 h-12 object-cover rounded-xl border border-[#99B19C]/40 shadow"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-[#6D2932]"
                      >
                        No detection records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        <ToastContainer />

        {/* Add User Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-[#D7D1C9]/60">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#6D2932]">
                    Add New User
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
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
                <form onSubmit={handleAddUser}>
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
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
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
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
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
