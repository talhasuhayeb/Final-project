import React, { useEffect, useState } from "react";
// import Modal from "react-modal"; // Removed due to Vite error. We'll use a custom modal below.
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import heroPic3 from "../../src/assets/distribution.png";
import modelAccuracy from "../../src/assets/modelAccuracy.png";
import confusionMatrix from "../../src/assets/confusionMatrix.png";
// New subcomponents
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import Sidebar from "../Components/Dashboard/Sidebar";
import DetectionPanel from "../Components/Dashboard/DetectionPanel";
import ProfilePanel from "../Components/Dashboard/ProfilePanel";
import MethodologySection from "../Components/Dashboard/MethodologySection";
import BloodArticles from "../Components/Dashboard/BloodArticles";
import HistoryTable from "../Components/Dashboard/HistoryTable";

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
    bloodType: "",
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
              _id: data._id || "", // Include the MongoDB _id
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
              bloodType: data.bloodType || "",
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

        // Save fingerprint data to user's record
        const token = localStorage.getItem("token");
        if (token && result.filename) {
          try {
            const response = await fetch(
              "http://localhost:8080/auth/update-fingerprint",
              {
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
              }
            );

            // Refresh detection history to get the updated records with IDs
            const historyResponse = await fetch(
              "http://localhost:8080/auth/detection-history",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              setDetectionHistory(historyData);

              // Update blood type in user profile
              setUserProfile((prev) => ({
                ...prev,
                bloodType: result.predicted_label,
              }));
            }
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
      bloodType: userProfile.bloodType,
    });
    setIsEditingProfile(false);
    setProfilePictureFile(null);
  };

  const handleViewDetection = (detection) => {
    console.log("Selected detection details:", detection);
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
              <span class="info-value">${
                userProfile && (userProfile.profile_id || userProfile._id)
                  ? userProfile.profile_id ||
                    `${userProfile._id.toString().substring(0, 8)}`
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
              <span class="info-label">Analysis ID:</span>
              <span class="info-value">${
                detection && (detection.analysis_id || detection._id)
                  ? detection.analysis_id ||
                    `${detection._id.toString().substring(0, 8)}`
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
                second: "2-digit",
                timeZoneName: "short",
              })}</span>
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

        <div class="section" style="text-align: center; margin: 15px 0;">
          <div class="section-title">🔎 Fingerprint Image</div>
          <div style="display: flex; justify-content: center; margin-top: 10px;">
            ${
              detection.filename
                ? `<img src="http://localhost:8080/uploads/${detection.filename}" 
                     alt="Fingerprint" 
                     style="max-width: 200px; max-height: 200px; object-fit: contain; 
                            border: 1px solid #99B19C; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />`
                : ""
            }
            <div style="display: ${
              detection.filename ? "none" : "flex"
            }; flex-direction: column; align-items: center; justify-content: center; 
                        width: 200px; height: 150px; border: 2px dashed #D7D1C9; 
                        border-radius: 8px; background-color: #FAF5EF; color: #6D2932;">
              <div style="text-align: center;">
                <svg xmlns="http://www.w3.org/2000/svg" style="height: 48px; width: 48px; margin: 0 auto 8px auto; color: #99B19C; display: block;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style="margin: 0; font-size: 12px; font-style: italic; font-weight: 500;">No fingerprint image available</p>
              </div>
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
      {/* Header replaced with DashboardHeader component */}
      <DashboardHeader
        logo={logo}
        loggedInUser={loggedInUser}
        onHome={() => navigate("/")}
        onLogout={handleLogout}
      />
      <main className="flex-grow py-8 px-4 flex flex-col">
        {/* Sidebar Trigger Icon (kept) */}
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
        {/* Sliding Sidebar replaced with Sidebar component */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onEnter={() => setSidebarOpen(true)}
          onLeave={() => setSidebarOpen(false)}
        />
        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-64">
          {activeSection === "main" && (
            <DetectionPanel
              selectedImage={selectedImage}
              selectedImageFile={selectedImageFile}
              sendEmailChecked={sendEmailChecked}
              setSendEmailChecked={setSendEmailChecked}
              sendSMSChecked={sendSMSChecked}
              setSendSMSChecked={setSendSMSChecked}
              userEmail={userEmail}
              phoneNumber={phoneNumber}
              isUploaded={isUploaded}
              predictionResults={predictionResults}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              onUpload={handleUpload}
              onDetect={handleDetect}
            />
          )}

          {activeSection === "profile" && (
            <ProfilePanel
              userProfile={userProfile}
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              handleProfileImageChange={handleProfileImageChange}
              handleProfileInputChange={handleProfileInputChange}
              handleSaveProfile={handleSaveProfile}
              handleCancelEdit={handleCancelEdit}
              handleRemoveProfilePicture={handleRemoveProfilePicture}
            />
          )}

          {activeSection === "methodology" && (
            <MethodologySection
              heroPic3={heroPic3}
              modelAccuracy={modelAccuracy}
              confusionMatrix={confusionMatrix}
            />
          )}

          {activeSection === "history" && (
            <HistoryTable
              detectionHistory={detectionHistory}
              logo={logo}
              userProfile={userProfile}
              userEmail={userEmail}
              loggedInUser={loggedInUser}
              selectedDetection={selectedDetection}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              setSelectedDetection={setSelectedDetection}
              handleViewDetection={handleViewDetection}
              handleDownloadReport={handleDownloadReport}
            />
          )}

          {activeSection === "bloodArticle" && (
            <BloodArticles
              trendingArticles={trendingArticles}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
              modalIsOpen={modalIsOpen}
              selectedArticle={selectedArticle}
              openModal={openModal}
              closeModal={closeModal}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
