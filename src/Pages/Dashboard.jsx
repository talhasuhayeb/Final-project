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
    <div className="min-h-screen flex flex-col justify-between bg-[#8A0302]">
      <header>
        <nav className="bg-[#A41214] text-[#B79455] shadow-lg rounded-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:h-20 py-4 gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="BloodDetect logo"
                  className="h-16 w-16 object-cover"
                />
                <span className="font-bold text-xl text-center sm:text-left">
                  Blood Detection System
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-md sm:text-lg">
                  Welcome, {loggedInUser}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white rounded hover:bg-red-100 hover:text-red-600 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow py-8 px-4">
        <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl border border-[#B79455]">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#A41214]">
            Upload Fingerprint
          </h2>

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full max-w-md"
            />

            {selectedImage && (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="mt-4 max-w-full h-64 rounded shadow object-contain"
                />
                <button
                  onClick={handleRemoveImage}
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={handleUpload}
                disabled={!selectedImageFile || isUploaded}
                className={`btn py-3 px-6 rounded-lg font-bold transition duration-300 ${
                  !selectedImageFile || isUploaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isUploaded ? "Uploaded ✓" : "Upload"}
              </button>

              <button
                onClick={handleDetect}
                disabled={!isUploaded}
                className={`btn py-3 px-6 rounded-lg font-bold transition duration-300 ${
                  !isUploaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8A0302] hover:bg-[#6e0202] text-white"
                }`}
              >
                Detect
              </button>
            </div>

            {/* Prediction Results Table */}
            {predictionResults && (
              <div className="w-full mt-6">
                <h3 className="text-xl font-bold mb-3 text-center text-[#A41214]">
                  Detection Results
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-50 border border-gray-300 rounded-lg">
                    <thead className="bg-[#A41214] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Metric
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          Detected Blood Group
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-[#8A0302] text-white px-3 py-1 rounded-full font-bold">
                            {predictionResults.bloodGroup}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          Confidence Score
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          {predictionResults.confidence}%
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          Processing Time
                        </td>
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {predictionResults.processingTime} ms
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          Image Quality Score
                        </td>
                        <td className="px-4 py-3 font-semibold text-purple-600">
                          {predictionResults.imageQuality}/100
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">
                          Prediction Timestamp
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-600">
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
