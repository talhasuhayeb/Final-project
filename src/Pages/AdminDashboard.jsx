import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Admin Logged Out Successfully", { position: "top-center" });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
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
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#6D2932] text-center tracking-tight">
            All Users
          </h2>
          <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-[#99B19C]/40">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-[#99B19C] text-[#6D2932]">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">Name</th>
                  <th className="px-4 py-3 text-center font-semibold">Email</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">Phone</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Fingerprint
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Blood Type
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
                      className="border-b border-[#D7D1C9]/60 hover:bg-[#D7D1C9]/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-center text-[#6D2932] font-medium">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 text-center text-[#6D2932]">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 text-center text-[#6D2932]">
                        {user.gender}
                      </td>
                      <td className="px-4 py-2 text-center text-[#6D2932]">
                        {user.phone}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.fingerprintImage ? (
                          <div className="flex justify-center">
                            <img
                              src={`http://localhost:8080/uploads/${user.fingerprintImage}`}
                              alt="Fingerprint"
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl border border-[#99B19C]/40 shadow"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.bloodType ? (
                          <span className="bg-[#6D2932] text-[#FAF5EF] px-2 py-1 rounded-full font-bold text-xs sm:text-sm">
                            {user.bloodType}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Not detected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center">
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
                    <td colSpan="7" className="text-center py-4 text-[#6D2932]">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <ToastContainer />
      </main>
    </div>
  );
};

export default AdminDashboard;
