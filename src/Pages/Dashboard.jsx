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
            if (data && data.phoneNumber) setPhoneNumber(data.phoneNumber);
            if (data && data.email) setUserEmail(data.email);
          })
          .catch((err) =>
            console.error("Failed to fetch user phone number", err)
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
        setPredictionResults({
          bloodGroup: result.predicted_label,
          confidence: result.confidence_percentage,
          processingTime: result.processing_time,
          imageQuality: result.image_quality_score,
          timestamp: result.timestamp,
        });

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
          className={`fixed top-1/2 left-0 h-72 w-44 bg-white/80 backdrop-blur-lg shadow-lg rounded-r-2xl border border-[#99B19C]/40 p-3 space-y-3 z-40 transition-transform duration-300 transform -translate-y-1/2 ${
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
            onClick={() => setActiveSection("methodology")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 mb-2 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "methodology" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Methodology
          </button>
          <button
            onClick={() => setActiveSection("bloodArticle")}
            className={`w-full text-left px-4 py-2 rounded-lg font-bold text-[#6D2932] border border-[#99B19C]/40 transition-all duration-200 hover:bg-[#99B19C]/10 ${
              activeSection === "bloodArticle" ? "bg-[#99B19C]/20" : ""
            }`}
          >
            Blood Article
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
                              {predictionResults.timestamp}
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
              {modalIsOpen && (
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
