import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleLogout = (e) => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    toast.success("User Logged Out", { position: "top-center" });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleDetect = () => {
    alert("Detection triggered!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
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
                <span className="font-bold text-xl select-none text-center sm:text-left">
                  Blood Detection System
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="font-semibold text-md sm:text-lg select-none">
                  Welcome, {loggedInUser}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white rounded font-medium hover:bg-red-100 hover:font-bold hover:text-red-600 transition duration-300"
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
              className="file-input file-input-bordered file-input-md w-full max-w-md"
            />

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Uploaded Preview"
                className="mt-4 max-w-full h-64 rounded shadow object-contain"
              />
            )}

            <button
              onClick={handleDetect}
              className="btn w-full sm:w-auto py-3 px-6 rounded-lg bg-[#8A0302] hover:bg-[#6e0202] text-white font-bold transition duration-300"
            >
              Detect
            </button>
            <ToastContainer />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
