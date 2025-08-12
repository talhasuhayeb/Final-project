import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    role: "user", // default role
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "email") {
      newValue = value.toLowerCase();
    }
    setLoginInfo({ ...loginInfo, [name]: newValue });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = loginInfo;
    if (!email || !password) {
      toast.error(" email & Password required", {
        position: "top-center",
      });
      return;
    }
    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const {
        success,
        message,
        error,
        name,
        jwtToken,
        role: returnedRole,
      } = result;
      if (success) {
        toast.success(message, { position: "top-center" });
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("role", returnedRole);
        setTimeout(() => {
          if (returnedRole === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#E8D8C4]/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: -120, scale: 0.96, rotate: -4 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-lg text-[#6D2932] rounded-2xl shadow-2xl border border-[#E8D8C4]/40 overflow-hidden">
          <div className="p-8 text-center text-xs sm:text-sm">
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl font-extrabold uppercase text-[#6D2932] tracking-tight"
              >
                Login
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[#C7B7A3] font-medium"
              >
                Please enter your email and password!
              </motion.p>

              <motion.form
                onSubmit={handleLogin}
                className="space-y-6"
                autoComplete="off"
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div whileFocus={{ scale: 1.05 }} className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={loginInfo.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#C7B7A3] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#C7B7A3] transition-all text-xs sm:text-sm focus:scale-105"
                    placeholder="Email"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.05 }} className="relative">
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={loginInfo.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#C7B7A3] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#C7B7A3] transition-all text-xs sm:text-sm focus:scale-105"
                    placeholder="Password"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.05 }} className="relative">
                  <select
                    name="role"
                    value={loginInfo.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#C7B7A3] focus:outline-none focus:border-[#6D2932] text-[#6D2932] text-xs sm:text-sm focus:scale-105"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </motion.div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 0 24px #C7B7A3",
                    backgroundColor: "#C7B7A3",
                    color: "#6D2932",
                    borderColor: "#6D2932",
                  }}
                  className="w-full py-2 rounded-full bg-[#6D2932] text-[#FAF5EF] font-bold text-base shadow-md transition-all duration-300 border-2 border-[#6D2932] focus:outline-none focus:ring-2 focus:ring-[#C7B7A3]/50 sm:text-sm cursor-pointer"
                >
                  Login
                </motion.button>

                <div className="space-y-2">
                  <p className="text-[#C7B7A3] text-xs sm:text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-[#6D2932] font-bold hover:text-[#C7B7A3] cursor-pointer focus:outline-none"
                    >
                      Forgot your password?
                    </Link>
                  </p>
                  <p className="text-[#C7B7A3] text-xs sm:text-sm">
                    Don't have an account?
                    <Link
                      to="/register"
                      className="text-[#6D2932] font-bold px-1 hover:text-[#C7B7A3] cursor-pointer focus:outline-none"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </motion.form>
              <ToastContainer
                position="top-center"
                autoClose={2500}
                theme="light"
              />
            </div>
          </div>
        </div>
      </motion.div>
      {/* Floating Home Button */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 24px #C7B7A3",
          backgroundColor: "#C7B7A3",
          color: "#6D2932",
          borderColor: "#C7B7A3",
        }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#6D2932] text-[#FAF5EF] font-bold shadow-lg border-2 border-[#6D2932] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C7B7A3]/50 text-xs sm:text-sm cursor-pointer"
        aria-label="Go to Home"
      >
        Home
      </motion.button>
    </div>
  );
};
export default Login;
