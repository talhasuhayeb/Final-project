import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "email") {
      newValue = value.toLowerCase();
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, gender, phone } = formData;
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", { position: "top-center" });
      return;
    }
    if (!name || !email || !password || !gender || !phone) {
      toast.error("Please fill all fields", {
        position: "top-center",
      });
      return;
    }
    try {
      const url = "http://localhost:8080/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        toast.success(message, { position: "top-center" });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        toast.error(details || message, { position: "top-center" });
      } else if (!success) {
        toast.error(message, { position: "top-center" });
      }
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg text-[#6D2932] rounded-2xl shadow-2xl border border-[#99B19C]/40 overflow-hidden">
          <div className="p-8 text-center text-xs sm:text-sm">
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold uppercase text-[#6D2932] tracking-tight">
                Register
              </h2>
              <p className="text-[#99B19C] font-medium">Create your account</p>
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                autoComplete="off"
              >
                <div className="relative">
                  <input
                    type="text"
                    id="regName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    id="regPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="relative flex flex-col items-start">
                  <span className="text-[#99B19C] text-xs sm:text-sm mb-2">
                    Gender
                  </span>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="text-[#6D2932] focus:ring-[#99B19C] text-xs sm:text-sm"
                      />
                      <span className="ml-2 text-[#6D2932] text-xs sm:text-sm">
                        Male
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="text-[#6D2932] focus:ring-[#99B19C] text-xs sm:text-sm"
                      />
                      <span className="ml-2 text-[#6D2932] text-xs sm:text-sm">
                        Female
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === "Other"}
                        onChange={handleChange}
                        className="text-[#6D2932] focus:ring-[#99B19C] text-xs sm:text-sm"
                      />
                      <span className="ml-2 text-[#6D2932] text-xs sm:text-sm">
                        Other
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold text-base shadow-md transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50  sm:text-sm"
                >
                  Register
                </button>
                <p className="text-[#99B19C] text-xs sm:text-sm text-center mt-2">
                  Already have an account?
                  <Link
                    to="/login"
                    className="text-[#6D2932] font-bold px-1 hover:text-[#99B19C] cursor-pointer focus:outline-none"
                  >
                    Login
                  </Link>
                </p>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
