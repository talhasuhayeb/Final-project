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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Admin Navbar */}
      <nav className="bg-[#2c2c2c] rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#B79455]">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Welcome, {adminName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#8A0302] hover:bg-[#6e0202] text-white rounded-lg font-medium transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#2c2c2c] rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Gender</th>
                <th className="px-4 py-2 text-center">Phone</th>
                <th className="px-4 py-2 text-center">Fingerprint</th>
                <th className="px-4 py-2 text-center">Blood Type</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2 text-center">{user.name}</td>
                    <td className="px-4 py-2 text-center">{user.email}</td>
                    <td className="px-4 py-2 text-center">{user.gender}</td>
                    <td className="px-4 py-2 text-center">{user.phone}</td>
                    <td className="px-4 py-2 text-center">
                      {user.fingerprintImage ? (
                        <div className="flex justify-center">
                          <img
                            src={`http://localhost:8080/uploads/${user.fingerprintImage}`}
                            alt="Fingerprint"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {user.bloodType ? (
                        <span className="bg-[#8A0302] text-[#B79455] px-2 py-1 rounded">
                          {user.bloodType}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not detected</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm font-medium transition duration-300 flex items-center justify-center"
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
                  <td colSpan="7" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
