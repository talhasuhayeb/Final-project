import React, { useEffect, useState } from "react";
// import Modal from "react-modal"; // Removed due to Vite error. We'll use a custom modal below.
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import heroPic3 from "../../src/assets/distribution.png";
import modelAccuracy from "../../src/assets/modelAccuracy.png";
import confusionMatrix from "../../src/assets/confusionMatrix.png";

// Dummy trending articles data
const trendingArticles = [
  {
    id: 1,
    title: "Breakthrough in Blood Group Detection",
    image: heroPic3,
    summary:
      "Researchers have developed a new AI-powered method to detect blood groups from fingerprints, improving speed and accuracy.",
    content:
      "In a recent study, scientists introduced a novel approach using deep learning to analyze fingerprint images for blood group detection. This method leverages advanced neural networks, resulting in faster and more reliable results compared to traditional techniques. The technology is expected to revolutionize medical diagnostics and blood donation processes.",
  },
  {
    id: 2,
    title: "Why Blood Group Distribution Matters",
    image: modelAccuracy,
    summary:
      "Understanding blood group distribution helps hospitals manage supplies and respond to emergencies more effectively.",
    content:
      "Blood group distribution data is crucial for healthcare providers. It enables better planning for blood transfusions and emergency responses. By analyzing local and global trends, hospitals can ensure that rare blood types are available when needed, saving lives and improving patient outcomes.",
  },
  {
    id: 3,
    title: "Confusion Matrix Explained",
    image: confusionMatrix,
    summary:
      "Learn how confusion matrices help evaluate the accuracy and reliability of AI models in medical diagnostics.",
    content:
      "A confusion matrix is a tool used to assess the performance of classification models. In medical diagnostics, it shows how often predictions match actual results, highlighting strengths and weaknesses. Understanding confusion matrices helps researchers improve model accuracy and reliability for real-world applications.",
  },
];

// Modal.setAppElement("#root"); // Not needed for custom modal

export default function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(""); // Will be set from DB
  const [userEmail, setUserEmail] = useState(""); // Will be set from DB
  const [sendEmailChecked, setSendEmailChecked] = useState(false); // Email checkbox state
  const [sendSMSChecked, setSendSMSChecked] = useState(false); // SMS checkbox state
  const [activeSection, setActiveSection] = useState("main"); // sidebar navigation
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);

  // User Profile States
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: null,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setLoggedInUser(user);
    if (!user) {
      navigate("/login");
    } else {
      // Fetch user phone number from backend
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:8080/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.phone) setPhoneNumber(data.phone);
            if (data && data.email) setUserEmail(data.email);

            // Populate user profile
            setUserProfile({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              gender: data.gender || "",
              dateOfBirth: data.dateOfBirth
                ? data.dateOfBirth.split("T")[0]
                : "",
              profilePicture: data.profilePicture
                ? `http://localhost:8080${data.profilePicture}`
                : null,
            });

            // Fetch detection history
            return fetch("http://localhost:8080/auth/detection-history", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
          })
          .then((res) => {
            if (!res.ok) {
              console.error("Failed to fetch detection history:", res.status);
              return [];
            }
            return res.json();
          })
          .then((historyData) => {
            console.log("Detection history data:", historyData);
            if (Array.isArray(historyData)) {
              setDetectionHistory(historyData);
            } else {
              console.error("Detection history is not an array:", historyData);
              setDetectionHistory([]); // Set empty array as fallback
            }
          })
          .catch((err) =>
            console.error("Failed to fetch user data or detection history", err)
          );
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    toast.success("User Logged Out", { position: "top-center" });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // Save actual file for backend

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedImageFile) {
      toast.warn("Please select an image first", { position: "top-center" });
      return;
    }
    setIsUploaded(true);
    toast.success("Image uploaded successfully! You can now detect.", {
      position: "top-center",
    });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    setIsUploaded(false);
    setPredictionResults(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
    toast.info("Image removed", { position: "top-center" });
  };

  const handleDetect = async () => {
    if (!isUploaded || !selectedImageFile) {
      toast.warn("Please upload an image first", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImageFile);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const newPrediction = {
          bloodGroup: result.predicted_label,
          confidence: result.confidence_percentage,
          processingTime: result.processing_time,
          imageQuality: result.image_quality_score,
          timestamp: result.timestamp,
          filename: result.filename,
        };

        setPredictionResults(newPrediction);

        // Add to detection history in state
        setDetectionHistory((prevHistory) => [newPrediction, ...prevHistory]);

        // Save fingerprint data to user's record
        const token = localStorage.getItem("token");
        if (token && result.filename) {
          try {
            await fetch("http://localhost:8080/auth/update-fingerprint", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                filename: result.filename,
                bloodType: result.predicted_label,
                confidence: result.confidence_percentage,
                imageQuality: result.image_quality_score,
                processingTime: result.processing_time,
                timestamp: result.timestamp,
              }),
            });
          } catch (err) {
            console.error("Error saving fingerprint data:", err);
          }
        }

        // Send SMS to user if checkbox is checked
        if (sendSMSChecked && phoneNumber) {
          try {
            const smsRes = await fetch("http://localhost:8080/send-sms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phoneNumber,
                bloodGroup: result.predicted_label,
                confidence: result.confidence_percentage,
                timestamp: result.timestamp,
              }),
            });
            const smsData = await smsRes.json();
            if (smsRes.ok) {
              toast.success("Prediction sent to your phone!", {
                position: "top-center",
              });
            } else {
              toast.error(smsData.error || "Failed to send SMS", {
                position: "top-center",
              });
            }
          } catch (err) {
            console.error("Error sending SMS:", err);
            toast.error("Error sending SMS", { position: "top-center" });
          }
        } else if (sendSMSChecked && !phoneNumber) {
          toast.warn("Phone number not found. Please contact support.", {
            position: "top-center",
          });
        }

        // Send Email if checkbox is checked
        if (sendEmailChecked && userEmail) {
          try {
            const emailRes = await fetch(
              "http://localhost:8080/auth/send-prediction-email",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: userEmail,
                  name: loggedInUser,
                  bloodGroup: result.predicted_label,
                  confidence: result.confidence_percentage,
                  processingTime: result.processing_time,
                  imageQuality: result.image_quality_score,
                  timestamp: result.timestamp,
                }),
              }
            );
            const emailData = await emailRes.json();
            if (emailRes.ok) {
              toast.success("Prediction results sent to your email!", {
                position: "top-center",
              });
            } else {
              toast.error(emailData.message || "Failed to send email", {
                position: "top-center",
              });
            }
          } catch (err) {
            console.error("Error sending email:", err);
            toast.error("Error sending email", { position: "top-center" });
          }
        } else if (sendEmailChecked && !userEmail) {
          toast.warn("Email address not found. Please contact support.", {
            position: "top-center",
          });
        }
      } else {
        toast.error(result.error || "Prediction failed", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to the model server", {
        position: "top-center",
      });
    }
  };

  // Carousel logic
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % trendingArticles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const openModal = (article) => {
    setSelectedArticle(article);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedArticle(null);
    setSelectedDetection(null);
  };

  // Profile handling functions
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required", { position: "top-center" });
        return;
      }

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", userProfile.name);
      formData.append("email", userProfile.email);
      formData.append("phone", userProfile.phone);
      formData.append("gender", userProfile.gender);
      formData.append("dateOfBirth", userProfile.dateOfBirth);

      // Add profile picture file if selected
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const response = await fetch(
        "http://localhost:8080/auth/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header - let browser set it for FormData
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Update the main user states
        setLoggedInUser(userProfile.name);
        setUserEmail(userProfile.email);
        setPhoneNumber(userProfile.phone);

        // Update profile picture URL if it was updated
        if (result.user.profilePicture) {
          setUserProfile((prev) => ({
            ...prev,
            profilePicture: `http://localhost:8080${result.user.profilePicture}`,
          }));
        }

        setIsEditingProfile(false);
        setProfilePictureFile(null);
        toast.success("Profile updated successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(result.message || "Failed to update profile", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile", { position: "top-center" });
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required", { position: "top-center" });
        return;
      }

      const response = await fetch(
        "http://localhost:8080/auth/remove-profile-picture",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Update the profile picture to null in the UI
        setUserProfile((prev) => ({
          ...prev,
          profilePicture: null,
        }));
        setProfilePictureFile(null);

        toast.success("Profile picture removed successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(result.message || "Failed to remove profile picture", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Error removing profile picture:", err);
      toast.error("Error removing profile picture", { position: "top-center" });
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setUserProfile({
      name: loggedInUser,
      email: userEmail,
      phone: phoneNumber,
      gender: userProfile.gender,
      dateOfBirth: userProfile.dateOfBirth,
      profilePicture: userProfile.profilePicture,
    });
    setIsEditingProfile(false);
    setProfilePictureFile(null);
  };

  const handleViewDetection = (detection) => {
    setSelectedDetection(detection);
    setModalIsOpen(true);
  };

  const handleDownloadReport = async (detection) => {
    // Always use client-side PDF generation for consistent PDF output
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
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
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
            font-size: 14px;
          }
          .confidence {
            color: #28a745;
            font-weight: bold;
          }
          .quality {
            color: #6f42c1;
            font-weight: bold;
          }
          .time {
            color: #007bff;
            font-weight: bold;
          }
          .report-info {
            background-color: #e9ecef;
            padding: 8px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 12px;
          }
          .report-info p {
            margin: 2px 0;
          }
          .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #D7D1C9;
            padding-top: 8px;
          }
          .footer p {
            margin: 2px 0;
          }
          .results-highlight {
            text-align: center;
            background: linear-gradient(135deg, #6D2932, #99B19C);
            color: white;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
          }
          .results-highlight .blood-type {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .results-highlight .stats {
            display: flex;
            justify-content: space-around;
            font-size: 12px;
          }
          @media print {
            body { margin: 15px; font-size: 13px; }
            .no-print { display: none; }
            .header { margin-bottom: 10px; }
            .section { margin-bottom: 8px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="${logo}" alt="Bindu Logo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; vertical-align: middle;" />
            <span style="vertical-align: middle; margin-left: 0;">Bindu</span>
          </div>
          <div class="subtitle">AI-Powered Blood Group Detection System</div>
          <div class="report-title">Blood Group Detection Report</div>
        </div>

        <div class="content-wrapper">
          <div class="section">
            <div class="section-title">👤 User Information</div>
            <div class="info-item">
              <span class="info-label">Profile ID:</span>
              <span class="info-value">BINDU-${
                detection._id
                  ? detection._id.substring(0, 8).toUpperCase()
                  : "N/A"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Full Name:</span>
              <span class="info-value">${
                userProfile.name || loggedInUser || "N/A"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender:</span>
              <span class="info-value">${userProfile.gender || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${
                userProfile.email || userEmail || "N/A"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">${
                userProfile.dateOfBirth
                  ? new Date(userProfile.dateOfBirth).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
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
                second: "2-digit",
                timeZoneName: "short",
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">${detection._id || "N/A"}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🩸 Detection Results</div>
            <div class="info-item">
              <span class="info-label">Blood Type:</span>
              <span class="blood-group">${detection.bloodGroup}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Confidence:</span>
              <span class="confidence">${detection.confidence || 0}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Image Quality:</span>
              <span class="quality">${detection.imageQuality || 0}/100</span>
            </div>
            <div class="info-item">
              <span class="info-label">Processing:</span>
              <span class="time">${detection.processingTime || 0}ms</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">ℹ️ Report Information</div>
          <div class="report-info">
            <p><strong>Generated:</strong> ${new Date().toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
              }
            )}</p>
            <p><strong>System:</strong> Bindu AI v1.0.0 | <strong>Accuracy:</strong> 94.88%</p>
            <p><strong>Note:</strong> AI-generated results for informational purposes only.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Disclaimer:</strong> This report is generated by an AI system for informational purposes only. Consult medical professionals for clinical decisions.</p>
          <p>© ${new Date().getFullYear()} Bindu - AI-Powered Blood Group Detection System</p>
        </div>
      </body>
      </html>
    `;

    // Create a hidden iframe with the report content and trigger print dialog
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40">
      <header className="sticky top-0 z-50">
        <nav className="bg-white/80 backdrop-blur-md text-[#6D2932] shadow-lg border-b border-[#D7D1C9]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:h-20 py-4 gap-4">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src={logo}
                    alt="BloodDetect logo"
                    className="h-10 w-10 object-cover rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6D2932] to-[#99B19C] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-[#6D2932] tracking-tight group-hover:text-[#99B19C] transition-colors duration-300">
                    Bindu
                  </span>
                  <span className="text-xs text-[#99B19C] opacity-70 font-medium">
                    AI-Powered Detection
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-sm sm:text-base text-[#99B19C]">
                  Welcome, {loggedInUser}
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
          </div>
        </nav>
      </header>
      <main className="flex-grow py-8 px-4 flex flex-col">
        {/* Sidebar Trigger Icon */}
        <div
          className="fixed top-1/2 left-0 z-50 transform -translate-y-1/2 cursor-pointer w-6 h-6"
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <div className="bg-[#99B19C] hover:bg-[#6D2932] text-[#FAF5EF] p-0.5 w-6 h-6 rounded-r-lg shadow flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>
        {/* Sliding Sidebar */}
        <div
          className={`fixed top-1/2 left-0 h-80 w-44 bg-white/80 backdrop-blur-lg shadow-lg rounded-r-2xl border border-[#99B19C]/40 p-3 space-y-3 z-40 transition-transform duration-300 transform -translate-y-1/2 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <button
            onClick={() => setActiveSection("main")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "main" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Detection
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "profile" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("methodology")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "methodology" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Methodology
          </button>
          <button
            onClick={() => setActiveSection("bloodArticle")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "bloodArticle" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Blood Article
          </button>
          <button
            onClick={() => setActiveSection("history")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "history" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            History
          </button>
        </div>
        {/* ...existing code... */}

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-64">
          {activeSection === "main" && (
            <div className="w-full max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
              <h2 className="text-2xl font-extrabold mb-6 text-center text-[#6D2932] tracking-tight">
                Upload Fingerprint
              </h2>

              <div className="flex flex-col items-center space-y-6 text-xs sm:text-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full max-w-md border border-[#99B19C] rounded-lg bg-white/70 text-[#6D2932] focus:border-[#6D2932] focus:outline-none text-xs sm:text-sm"
                />

                {selectedImage && (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="mt-4 max-w-full h-64 rounded-xl shadow object-contain border border-[#99B19C]/40"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300 shadow border-2 border-red-500 hover:border-red-600 text-xs sm:text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                {/* Email and SMS Checkboxes */}
                <div className="flex flex-col items-center space-y-3 w-full">
                  {/* Email Checkbox */}
                  <div className="flex items-center justify-center space-x-3 w-full">
                    <input
                      type="checkbox"
                      id="sendEmailCheckbox"
                      checked={sendEmailChecked}
                      onChange={(e) => setSendEmailChecked(e.target.checked)}
                      className="w-4 h-4 text-[#6D2932] bg-white border-2 border-[#99B19C] rounded focus:ring-[#6D2932] focus:ring-2"
                    />
                    <label
                      htmlFor="sendEmailCheckbox"
                      className="text-[#6D2932] font-medium text-xs sm:text-sm cursor-pointer select-none"
                    >
                      📧 Send prediction results to my email (
                      {userEmail || "email not found"})
                    </label>
                  </div>

                  {/* SMS Checkbox */}
                  <div className="flex items-center justify-center space-x-3 w-full">
                    <input
                      type="checkbox"
                      id="sendSMSCheckbox"
                      checked={sendSMSChecked}
                      onChange={(e) => setSendSMSChecked(e.target.checked)}
                      className="w-4 h-4 text-[#6D2932] bg-white border-2 border-[#99B19C] rounded focus:ring-[#6D2932] focus:ring-2"
                    />
                    <label
                      htmlFor="sendSMSCheckbox"
                      className="text-[#6D2932] font-medium text-xs sm:text-sm cursor-pointer select-none"
                    >
                      📱 Send prediction results to my phone (
                      {phoneNumber || "phone not found"})
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedImageFile || isUploaded}
                    className={`px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm ${
                      !selectedImageFile || isUploaded
                        ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-[#99B19C] text-[#6D2932] border-[#99B19C] hover:bg-[#6D2932] hover:text-[#FAF5EF] hover:border-[#6D2932]"
                    }`}
                  >
                    {isUploaded ? "Uploaded ✓" : "Upload"}
                  </button>

                  <button
                    onClick={handleDetect}
                    disabled={!isUploaded}
                    className={`px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 text-xs sm:text-sm ${
                      !isUploaded
                        ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-[#6D2932] text-[#FAF5EF] border-[#6D2932] hover:bg-[#99B19C] hover:text-[#6D2932] hover:border-[#99B19C]"
                    }`}
                  >
                    Detect
                  </button>
                </div>

                {/* Prediction Results Table */}
                {predictionResults && (
                  <div className="w-full mt-8">
                    <h3 className="text-lg font-bold mb-4 text-center text-[#6D2932]">
                      Detection Results
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white/90 border border-[#99B19C]/40 rounded-xl shadow text-xs sm:text-sm">
                        <thead className="bg-[#99B19C] text-[#6D2932]">
                          <tr>
                            <th className="px-4 py-2 text-center font-semibold">
                              Metric
                            </th>
                            <th className="px-4 py-2 text-center font-semibold">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#D7D1C9]">
                            <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                              Detected Blood Group
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="bg-[#6D2932] text-[#FAF5EF] px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                                {predictionResults.bloodGroup}
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D7D1C9]">
                            <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                              Confidence Score
                            </td>
                            <td className="px-4 py-2 font-semibold text-green-600 text-center">
                              {predictionResults.confidence}%
                            </td>
                          </tr>
                          <tr className="border-b border-[#D7D1C9]">
                            <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                              Processing Time
                            </td>
                            <td className="px-4 py-2 font-semibold text-blue-600 text-center">
                              {predictionResults.processingTime} ms
                            </td>
                          </tr>
                          <tr className="border-b border-[#D7D1C9]">
                            <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                              Image Quality Score
                            </td>
                            <td className="px-4 py-2 font-semibold text-purple-600 text-center">
                              {predictionResults.imageQuality}/100
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-medium text-[#6D2932] text-center">
                              Prediction Timestamp
                            </td>
                            <td className="px-4 py-2 font-semibold text-[#99B19C] text-center">
                              {predictionResults.timestamp
                                ? new Date(
                                    predictionResults.timestamp
                                  ).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <ToastContainer />
              </div>
            </div>
          )}
          {activeSection === "profile" && (
            <div className="w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-[#6D2932] tracking-tight">
                  User Profile
                </h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#6D2932] hover:text-[#FAF5EF] font-bold transition-all duration-300 border-2 border-[#99B19C] hover:border-[#6D2932] text-xs sm:text-sm"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] hover:text-[#6D2932] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] text-xs sm:text-sm"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-bold transition-all duration-300 border-2 border-gray-400 hover:border-gray-500 text-xs sm:text-sm"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#99B19C] shadow-lg bg-gradient-to-br from-[#FAF5EF] to-[#D7D1C9]">
                        {userProfile.profilePicture ? (
                          <img
                            src={userProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6D2932] text-6xl font-bold">
                            {userProfile.name
                              ? userProfile.name.charAt(0).toUpperCase()
                              : "👤"}
                          </div>
                        )}
                      </div>
                      {isEditingProfile && (
                        <>
                          <button
                            onClick={() =>
                              document
                                .getElementById("profileImageInput")
                                .click()
                            }
                            className="absolute bottom-2 right-2 bg-[#6D2932] hover:bg-[#99B19C] text-white rounded-full p-2 shadow-lg transition-all duration-300"
                          >
                            📷
                          </button>
                          {userProfile.profilePicture && (
                            <button
                              onClick={handleRemoveProfilePicture}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300"
                              title="Remove profile picture"
                            >
                              🗑️
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {isEditingProfile && (
                      <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    )}

                    <div className="text-center">
                      <h3 className="text-xl font-bold text-[#6D2932]">
                        {userProfile.name || "User Name"}
                      </h3>
                      <p className="text-[#99B19C] text-sm">
                        {userProfile.email || "user@email.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#6D2932]">
                        👤 Full Name
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          name="name"
                          value={userProfile.name}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                          {userProfile.name || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#6D2932]">
                        📧 Email Address
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          name="email"
                          value={userProfile.email}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                          {userProfile.email || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#6D2932]">
                        📱 Phone Number
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userProfile.phone}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                          {userProfile.phone || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Gender Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#6D2932]">
                        ⚧️ Gender
                      </label>
                      {isEditingProfile ? (
                        <select
                          name="gender"
                          value={userProfile.gender}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                          {userProfile.gender || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Date of Birth Field */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-[#6D2932]">
                        🎂 Date of Birth
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={userProfile.dateOfBirth}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-2 border-2 border-[#99B19C] rounded-lg bg-white focus:border-[#6D2932] focus:outline-none text-[#6D2932] text-sm"
                        />
                      ) : (
                        <div className="w-full px-4 py-2 border-2 border-[#D7D1C9] rounded-lg bg-[#FAF5EF] text-[#6D2932] text-sm">
                          {userProfile.dateOfBirth
                            ? new Date(
                                userProfile.dateOfBirth
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Stats/Info Cards */}
                  {!isEditingProfile && (
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-[#6D2932] to-[#99B19C] p-4 rounded-xl text-white text-center">
                        <div className="text-2xl font-bold">🩸</div>
                        <div className="text-sm font-medium">Blood Type</div>
                        <div className="text-lg font-bold">
                          {predictionResults?.bloodGroup || "Not Detected"}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#99B19C] to-[#D7D1C9] p-4 rounded-xl text-[#6D2932] text-center">
                        <div className="text-2xl font-bold">📊</div>
                        <div className="text-sm font-medium">
                          Last Confidence
                        </div>
                        <div className="text-lg font-bold">
                          {predictionResults?.confidence
                            ? `${predictionResults.confidence}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ToastContainer />
            </div>
          )}
          {activeSection === "methodology" && (
            <div className="p-8 bg-white/80 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-[#6D2932]">
                Methodology
              </h2>
              <p className="text-[#6D2932] text-sm mb-6">
                The bar chart below shows the number of samples for each blood
                group in our dataset. A- is the most common, while A+ is the
                least. This helps us understand the distribution of blood types
                in our data.
              </p>
              <div className="flex justify-center mb-8">
                <img
                  src={heroPic3}
                  alt="Blood Group Distribution Diagram"
                  className="w-full max-w-2xl rounded-xl"
                />
              </div>
              <p className="text-[#6D2932] text-sm mb-6">
                The line chart below shows how the model’s accuracy improves as
                it trains. Both training and validation accuracy increase over
                time, reaching 94.88%.With this accuracy, our model reliably
                predicts blood groups from fingerprints. This high score means
                the system is effective and ready for real-world use.
              </p>
              <div className="flex justify-center mb-4">
                <img
                  src={modelAccuracy}
                  alt="Model Accuracy Chart"
                  className="w-full max-w-2xl rounded-xl"
                />
              </div>
              <p className="text-[#6D2932] text-sm mb-6">
                The confusion matrix above shows that most predictions match the
                true blood group labels, with very few misclassifications. This
                demonstrates the model’s reliability across all blood types.
              </p>
              <div className="flex justify-center mb-4">
                <img
                  src={confusionMatrix}
                  alt="Confusion Matrix"
                  className="w-full max-w-2xl rounded-xl"
                />
              </div>
              <p className="text-[#6D2932] text-sm text-center"></p>
            </div>
          )}
          {activeSection === "history" && (
            <div className="w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#99B19C]/40">
              <h2 className="text-2xl font-extrabold mb-6 text-center text-[#6D2932] tracking-tight">
                Detection History
              </h2>

              {detectionHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/90 border border-[#99B19C]/40 rounded-xl shadow text-xs sm:text-sm">
                    <thead className="bg-[#99B19C] text-[#6D2932]">
                      <tr>
                        <th className="px-4 py-2 text-center font-semibold">
                          Date & Time
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Blood Group
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Confidence
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Image Quality
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectionHistory.map((detection, index) => {
                        // Ensure timestamp is a valid date
                        let displayDate;
                        try {
                          displayDate = new Date(
                            detection.timestamp
                          ).toLocaleString();
                        } catch (e) {
                          console.error("Invalid date:", detection.timestamp);
                          displayDate = "Invalid Date";
                        }

                        return (
                          <tr
                            key={index}
                            className="border-b border-[#D7D1C9] hover:bg-[#FAF5EF]"
                          >
                            <td className="px-4 py-2 text-center">
                              {displayDate}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="bg-[#6D2932] text-[#FAF5EF] px-3 py-1 rounded-full font-bold">
                                {detection.bloodGroup}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center font-semibold text-green-600">
                              {detection.confidence || 0}%
                            </td>
                            <td className="px-4 py-2 text-center font-semibold text-purple-600">
                              {detection.imageQuality || 0}/100
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetection(detection)}
                                  className="px-3 py-1 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#6D2932] hover:text-[#FAF5EF] transition-all duration-300 text-xs font-semibold"
                                  title="View full report"
                                >
                                  👁️ View
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadReport(detection)
                                  }
                                  className="px-3 py-1 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] hover:text-[#6D2932] transition-all duration-300 text-xs font-semibold"
                                  title="Generate and download PDF report"
                                >
                                  � PDF Report
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-[#6D2932]">
                  <p className="text-lg font-medium">
                    No detection history found.
                  </p>
                  <p className="text-sm mt-2">
                    Upload and analyze fingerprints to see your detection
                    history here.
                  </p>
                </div>
              )}

              {/* Modal for viewing detection details */}
              {modalIsOpen && selectedDetection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => {
                      setModalIsOpen(false);
                      setSelectedDetection(null);
                    }}
                  ></div>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative z-10 animate-fade-in">
                    <button
                      onClick={() => {
                        setModalIsOpen(false);
                        setSelectedDetection(null);
                      }}
                      className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C]"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-bold text-[#6D2932] mb-4 text-center">
                      Detection Report
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <span className="bg-[#6D2932] text-[#FAF5EF] px-6 py-3 rounded-full font-bold text-2xl">
                          {selectedDetection.bloodGroup}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#FAF5EF] p-4 rounded-lg">
                          <p className="text-sm font-semibold text-[#6D2932]">
                            Date & Time
                          </p>
                          <p className="text-lg font-bold text-[#6D2932]">
                            {new Date(
                              selectedDetection.timestamp
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-[#FAF5EF] p-4 rounded-lg">
                          <p className="text-sm font-semibold text-[#6D2932]">
                            Confidence Score
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {selectedDetection.confidence}%
                          </p>
                        </div>
                        <div className="bg-[#FAF5EF] p-4 rounded-lg">
                          <p className="text-sm font-semibold text-[#6D2932]">
                            Image Quality
                          </p>
                          <p className="text-lg font-bold text-purple-600">
                            {selectedDetection.imageQuality}/100
                          </p>
                        </div>
                        <div className="bg-[#FAF5EF] p-4 rounded-lg">
                          <p className="text-sm font-semibold text-[#6D2932]">
                            Processing Time
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {selectedDetection.processingTime} ms
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() =>
                            handleDownloadReport(selectedDetection)
                          }
                          className="px-5 py-2 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] hover:text-[#6D2932] font-bold transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] text-xs sm:text-sm"
                        >
                          � Generate PDF Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeSection === "bloodArticle" && (
            <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-[#99B19C]/40">
              {/* Carousel only in Blood Article page */}
              <div className="w-full max-w-6xl mx-auto mb-10">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-lg border-2 border-[#99B19C]/50 h-[400px] md:h-[500px] w-full flex items-center justify-center">
                  <img
                    src={trendingArticles[carouselIndex].image}
                    alt={trendingArticles[carouselIndex].title}
                    className="absolute top-0 left-0 w-full h-full object-contain transition-all duration-500 bg-white"
                    style={{ objectFit: "contain" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(255,255,255,0) 100%)",
                    }}
                  >
                    <h2
                      className="text-2xl md:text-4xl font-extrabold drop-shadow-lg mb-2"
                      style={{ color: "#6D2932" }}
                    >
                      {trendingArticles[carouselIndex].title}
                    </h2>
                    <p className="text-white text-lg drop-shadow mb-2">
                      {trendingArticles[carouselIndex].summary}
                    </p>
                    <button
                      className="text-[#99B19C] font-bold underline hover:text-[#6D2932] transition-colors duration-200 text-lg"
                      onClick={() => openModal(trendingArticles[carouselIndex])}
                    >
                      See More
                    </button>
                  </div>
                  {/* Carousel Controls */}
                  <div className="absolute bottom-4 right-8 flex space-x-3">
                    {trendingArticles.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-4 h-4 rounded-full ${
                          carouselIndex === idx
                            ? "bg-[#99B19C]"
                            : "bg-[#D7D1C9]"
                        }`}
                        onClick={() => setCarouselIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-6 text-[#6D2932] text-center">
                Trending Blood Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white/90 rounded-xl shadow-lg border border-[#99B19C]/30 flex flex-col hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                    style={{ minHeight: "350px", position: "relative" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="absolute top-0 left-0 w-full h-full object-contain bg-white rounded-t-xl"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col items-center justify-between">
                      <h3 className="text-lg font-bold text-[#6D2932] mb-2 text-center">
                        {article.title}
                      </h3>
                      <p className="text-[#6D2932] text-xs mb-3 text-center">
                        {article.summary}
                      </p>
                      <button
                        className="text-[#99B19C] font-semibold underline hover:text-[#6D2932] transition-colors duration-200 text-xs"
                        onClick={() => openModal(article)}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Custom Modal for full article (no external dependency) */}
              {modalIsOpen && selectedArticle && !selectedDetection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-transparent"
                    onClick={closeModal}
                  ></div>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative z-10 animate-fade-in">
                    <button
                      onClick={closeModal}
                      className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C]"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    {selectedArticle && (
                      <>
                        <img
                          src={selectedArticle.image}
                          alt={selectedArticle.title}
                          className="w-64 h-64 object-contain rounded-xl mb-6 mx-auto shadow-lg"
                        />
                        <h2 className="text-xl font-bold text-[#6D2932] mb-2 text-center">
                          {selectedArticle.title}
                        </h2>
                        <p className="text-[#6D2932] text-sm mb-4 text-center">
                          {selectedArticle.summary}
                        </p>
                        <div className="text-[#6D2932] text-xs text-left whitespace-pre-line">
                          {selectedArticle.content}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
