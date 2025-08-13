import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
// Import new subcomponents
import AdminHeader from "../Components/AdminDashboard/AdminHeader";
import AdminTabs from "../Components/AdminDashboard/AdminTabs";
import UsersTable from "../Components/AdminDashboard/UsersTable";
import DetectionRecordsTable from "../Components/AdminDashboard/DetectionRecordsTable";
import DetectionFilters from "../Components/AdminDashboard/DetectionFilters";
import AddUserModal from "../Components/AdminDashboard/AddUserModal";
import DetectionRecordModal from "../Components/AdminDashboard/DetectionRecordModal";

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
    search: "",
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
  const [recordModalIsOpen, setRecordModalIsOpen] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
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

  // Cleanup debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

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
      // Set loading state if there's a search term
      if (filters.search) {
        setIsSearching(true);
      }

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append("userId", filters.userId);
      if (filters.bloodGroup)
        queryParams.append("bloodGroup", filters.bloodGroup);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.search) queryParams.append("search", filters.search);

      const url = `http://localhost:8080/admin/detection-records?${queryParams.toString()}`;

      console.log("Fetching detection records with URL:", url);
      console.log("Applied filters:", filters);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      console.log("Detection records response:", data);

      if (data.success) {
        setDetectionRecords(data.records || []);
      } else {
        toast.error(data.message || "Failed to fetch detection records");
      }
    } catch (err) {
      toast.error("Failed to fetch detection records");
    } finally {
      setIsSearching(false);
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

    // Update state first
    const updatedFilters = { ...recordFilters, [name]: value };
    setRecordFilters(updatedFilters);

    // If it's a search input, implement debounced search
    if (name === "search") {
      // Clear previous timer
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }

      // Set new timer for debounced search
      const newTimer = setTimeout(() => {
        const token = localStorage.getItem("token");
        fetchDetectionRecords(token, updatedFilters);
      }, 500); // 500ms delay

      setSearchDebounceTimer(newTimer);
    }
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
      search: "",
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

  const handleDeleteDetectionRecord = async (recordId, timestamp) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this detection record from ${formatDate(
          timestamp
        )}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/admin/detection-records/${recordId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Detection record deleted successfully", {
          position: "top-center",
        });
        // Refresh the detection records list
        fetchDetectionRecords(token, recordFilters);
      } else {
        toast.error(result.message || "Failed to delete detection record", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Error deleting detection record", {
        position: "top-center",
      });
    }
  };

  const handleViewDetection = (detection) => {
    console.log("Selected detection details:", detection);
    setSelectedDetection(detection);
    setRecordModalIsOpen(true);
  };

  const handleDownloadReport = async (detection) => {
    generateClientSideReport(detection);
  };

  const generateClientSideReport = (detection) => {
    // Create HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Blood Group Detection Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.4;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #6D2932;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #6D2932;
            margin-bottom: 5px;
          }
          .subtitle {
            color: #99B19C;
            font-size: 13px;
            margin-bottom: 3px;
          }
          .report-title {
            font-size: 18px;
            color: #6D2932;
            font-weight: bold;
            margin: 8px 0;
          }
          .content-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
          }
          .section {
            padding: 12px;
            border: 1px solid #D7D1C9;
            border-radius: 6px;
            background-color: #FAF5EF;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #6D2932;
            margin-bottom: 8px;
            border-bottom: 1px solid #99B19C;
            padding-bottom: 3px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px dotted #D7D1C9;
            margin-bottom: 3px;
          }
          .info-label {
            font-weight: bold;
            color: #6D2932;
            font-size: 13px;
          }
          .info-value {
            color: #99B19C;
            font-weight: 500;
            font-size: 13px;
          }
          .blood-group {
            color: #800000;
            font-weight: bold;
            font-size: 22px;
          }
          .confidence {
            color: #006400;
            font-weight: bold;
          }
          .processing-time {
            color: #000080;
          }
          .image-quality {
            color: #4B0082;
          }
          .footnote {
            font-size: 11px;
            color: #666;
            text-align: center;
            margin-top: 10px;
            padding-top: 5px;
            border-top: 1px solid #D7D1C9;
          }
          .report-info {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            margin-bottom: 12px;
          }
          .report-info p {
            margin: 3px 0;
          }
          .image-section {
            text-align: center;
            padding: 12px;
            border: 1px solid #D7D1C9;
            border-radius: 6px;
            margin-bottom: 15px;
          }
          .fingerprint-image {
            max-height: 200px;
            max-width: 100%;
            object-fit: contain;
            border-radius: 6px;
            border: 1px solid #99B19C;
            margin: 10px auto;
            display: block;
          }
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="${logo}" alt="Bindu Logo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; vertical-align: middle; margin-right: 0; display: inline-block;" />
            <span style="vertical-align: middle;">Bindu</span>
          </div>
          <div class="subtitle">AI-Powered Blood Group Detection System</div>
          <div class="report-title">Blood Group Detection Report</div>
        </div>
        
        <div class="content-wrapper">
          <div class="section">
            <div class="section-title">👤 User Information</div>
            <div class="info-item">
              <span class="info-label">Profile ID:</span>
              <span class="info-value">${
                detection.userId ? detection.userId.substring(0, 8) : "N/A"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Full Name:</span>
              <span class="info-value">${detection.userName || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              <span class="info-value">${detection.userGender || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${detection.userEmail || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">${
                detection.userDateOfBirth
                  ? new Date(detection.userDateOfBirth).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "N/A"
              }</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📋 Analysis Details</div>
            <div class="info-item">
              <span class="info-label">Analysis ID:</span>
              <span class="info-value">${
                detection._id
                  ? detection._id.substring(0, 8)
                  : detection.analysis_id
                  ? detection.analysis_id.substring(0, 8)
                  : "N/A"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date(
                detection.timestamp
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Time:</span>
              <span class="info-value">${new Date(
                detection.timestamp
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🩸 Detection Results</div>
            <div class="info-item">
              <span class="info-label">Blood Group:</span>
              <span class="blood-group">${detection.bloodGroup}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Confidence:</span>
              <span class="confidence">${detection.confidence.toFixed(
                2
              )}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Image Quality:</span>
              <span class="image-quality">${detection.imageQuality.toFixed(
                0
              )}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Processing:</span>
              <span class="processing-time">${detection.processingTime.toFixed(
                2
              )}ms</span>
            </div>
          </div>
        </div>
        
        <div class="image-section">
          <div class="section-title">🔎 Fingerprint Image</div>
          ${
            detection.filename
              ? `<img 
            src="http://localhost:8080/uploads/${detection.filename}" 
            alt="Fingerprint" 
            class="fingerprint-image"
            onerror="this.onerror=null; this.style.display='none'; this.parentElement.querySelector('.no-image-message').style.display='block';"
          />
          <div class="no-image-message" style="display: none; text-align: center; padding: 40px; color: #6D2932; font-style: italic; border: 2px dashed #D7D1C9; border-radius: 6px; background-color: #FAF5EF;">
            No fingerprint image available
          </div>`
              : `<div class="no-image-message" style="text-align: center; padding: 40px; color: #6D2932; font-style: italic; border: 2px dashed #D7D1C9; border-radius: 6px; background-color: #FAF5EF;">
            No fingerprint image available
          </div>`
          }
        </div>
        
        <div class="section-title">ℹ️ Report Information</div>
        <div class="report-info">
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          )} at 
            ${new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          <p><strong>System:</strong> Bindu AI v1.0.0 | <strong>Accuracy:</strong> 94.88%</p>
          <p><strong>Note:</strong> AI-generated results for informational purposes only.</p>
        </div>
        
        <div class="footnote">
          <p><strong>Disclaimer:</strong> This report is generated by an AI system for informational purposes only. Consult medical professionals for clinical decisions.</p>
          <p>&copy; ${new Date().getFullYear()} Bindu - AI-Powered Blood Group Detection System</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe with the report content and trigger print dialog
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();

    iframe.onload = function () {
      setTimeout(function () {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 500);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40 flex flex-col p-0">
      {/* Admin Navbar replaced with AdminHeader */}
      <AdminHeader
        title="Admin Panel"
        subtitle="User Management"
        adminName={adminName}
        onHome={() => navigate("/")}
        onLogout={handleLogout}
        logo={logo}
      />
      <main className="flex-grow w-full max-w-5xl mx-auto py-8 px-2 sm:px-6">
        {/* Tabs replaced with AdminTabs */}
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
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
            {/* UsersTable subcomponent */}
            <UsersTable
              users={users}
              formatDate={formatDate}
              handleToggleBlockUser={handleToggleBlockUser}
              handleChangeRole={handleChangeRole}
              handleDeleteUser={handleDeleteUser}
            />
          </section>
        )}
        {/* Detection Records Section */}
        {activeTab === "detection" && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#6D2932] tracking-tight">
                Blood Group Detection Records
              </h2>
              {recordFilters.search && (
                <div className="text-xs text-[#99B19C] bg-[#FAF5EF] px-3 py-1 rounded-full border border-[#D7D1C9]">
                  Search: "{recordFilters.search}" • {detectionRecords.length}{" "}
                  result{detectionRecords.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            {/* Filters subcomponent */}
            <DetectionFilters
              users={users}
              recordFilters={recordFilters}
              handleFilterChange={handleFilterChange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              isSearching={isSearching}
            />
            {/* DetectionRecordsTable subcomponent */}
            <DetectionRecordsTable
              detectionRecords={detectionRecords}
              formatDate={formatDate}
              handleViewDetection={handleViewDetection}
              handleDownloadReport={handleDownloadReport}
              handleDeleteDetectionRecord={handleDeleteDetectionRecord}
            />
          </section>
        )}
        <ToastContainer />
        {/* Detection Record View Modal subcomponent */}
        <DetectionRecordModal
          recordModalIsOpen={recordModalIsOpen}
          selectedDetection={selectedDetection}
          setRecordModalIsOpen={setRecordModalIsOpen}
          setSelectedDetection={setSelectedDetection}
          handleDownloadReport={handleDownloadReport}
          formatDate={formatDate}
        />
        {/* Add User Modal subcomponent */}
        <AddUserModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          errors={errors}
          handleAddUser={handleAddUser}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
