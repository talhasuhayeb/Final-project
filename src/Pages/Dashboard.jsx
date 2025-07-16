import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

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
        // Store prediction results
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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40">
      <header>
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

      <main className="flex-grow py-8 px-4">
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
      </main>

      <Footer />
    </div>
  );
}
