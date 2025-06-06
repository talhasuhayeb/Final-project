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
    console.log(name, value);
    const copyFormData = { ...formData };
    copyFormData[name] = value;
    setFormData(copyFormData);
  };
  console.log("formData ->", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, gender, phone } = formData;
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
        const details = error?.details[0].message;
        toast.error(details, { position: "top-center" });
      } else if (!success) {
        toast.error(message, { position: "top-center" });
      }
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2c2c2c] text-white rounded-xl shadow-lg border border-[#B79455] overflow-hidden">
          <div className="p-8 text-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase text-[#B79455]">
                Register
              </h2>
              <p className="text-[#d1d1d1]">Please enter your details!</p>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 "
                autoComplete="off"
              >
                <div className="relative">
                  <input
                    type="text"
                    id="regName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="regName"
                    className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                  />
                  <label
                    htmlFor="regEmail"
                    className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                  >
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                  />
                  <label
                    htmlFor="regPassword"
                    className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                  >
                    Password
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-left text-[#B79455] mb-3 text-sm">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="text-[#8A0302] focus:ring-[#8A0302]"
                      />
                      <span className="ml-2 text-white">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="text-[#8A0302] focus:ring-[#8A0302]"
                      />
                      <span className="ml-2 text-white">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === "Other"}
                        onChange={handleChange}
                        className="text-[#8A0302] focus:ring-[#8A0302]"
                      />
                      <span className="ml-2 text-white">Other</span>
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="regPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                  />
                  <label
                    htmlFor="regPhone"
                    className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                  >
                    Phone Number
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#8A0302] hover:bg-[#6e0202] text-white font-bold transition duration-300"
                >
                  Register
                </button>
                <span>
                  <p className="text-[#d1d1d1] text-sm">
                    Already have an account?
                    <Link
                      to="/login"
                      className="text-[#B79455] font-bold px-1 hover:text-[#8A0302] cursor-pointer focus:outline-none"
                    >
                      Login
                    </Link>
                  </p>
                </span>
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
