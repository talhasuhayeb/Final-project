import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    role: "user", // default role
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg text-[#6D2932] rounded-2xl shadow-2xl border border-[#99B19C]/40 overflow-hidden">
          <div className="p-8 text-center text-xs sm:text-sm">
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold uppercase text-[#6D2932] tracking-tight">
                Login
              </h2>
              <p className="text-[#99B19C] font-medium">
                Please enter your email and password!
              </p>

              <form
                onSubmit={handleLogin}
                className="space-y-6"
                autoComplete="off"
              >
                <div className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={loginInfo.email}
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
                    value={loginInfo.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Password"
                  />
                </div>

                <div className="relative">
                  <select
                    name="role"
                    value={loginInfo.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] text-xs sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-full bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] font-bold text-base shadow-md transition-all duration-300 border-2 border-[#6D2932] hover:border-[#99B19C] focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 sm:text-sm"
                >
                  Login
                </button>
                <span>
                  <p className="text-[#99B19C] text-xs sm:text-sm">
                    Don't have an account?
                    <Link
                      to="/register"
                      className="text-[#6D2932] font-bold px-1 hover:text-[#99B19C] cursor-pointer focus:outline-none"
                    >
                      Register
                    </Link>
                  </p>
                </span>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
      {/* Floating Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#99B19C] hover:bg-[#6D2932] text-[#FAF5EF] font-bold shadow-lg border-2 border-[#99B19C] hover:border-[#6D2932] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6D2932]/50 text-xs sm:text-sm"
        aria-label="Go to Home"
      >
        Home
      </button>
    </div>
  );
};
export default Login;
