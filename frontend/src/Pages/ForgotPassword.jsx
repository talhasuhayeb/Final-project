import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [forgotInfo, setForgotInfo] = useState({
    email: "",
    role: "user", // default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForgotInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { email, role } = forgotInfo;

    if (!email) {
      toast.error("Email is required", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = "http://localhost:8080/auth/forgot-password";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        toast.success(message, { position: "top-center" });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(message, { position: "top-center" });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5EF] via-[#D7D1C9] to-[#99B19C]/40 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-lg text-[#6D2932] rounded-2xl shadow-2xl border border-[#99B19C]/40 overflow-hidden">
          <div className="p-8 text-center text-xs sm:text-sm">
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold uppercase text-[#6D2932] tracking-tight">
                Forgot Password
              </h2>
              <p className="text-[#99B19C] font-medium">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form
                onSubmit={handleForgotPassword}
                className="space-y-6"
                autoComplete="off"
              >
                <div className="relative">
                  <input
                    type="email"
                    id="forgotEmail"
                    name="email"
                    value={forgotInfo.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] placeholder-[#99B19C] transition-all text-xs sm:text-sm"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative">
                  <select
                    name="role"
                    value={forgotInfo.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-[#99B19C] focus:outline-none focus:border-[#6D2932] text-[#6D2932] text-xs sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded-full font-bold text-base shadow-md transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#99B19C]/50 sm:text-sm ${
                    isLoading
                      ? "bg-gray-400 border-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#6D2932] hover:bg-[#99B19C] text-[#FAF5EF] border-[#6D2932] hover:border-[#99B19C]"
                  }`}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="space-y-2">
                  <p className="text-[#99B19C] text-xs sm:text-sm">
                    Remember your password?
                    <Link
                      to="/login"
                      className="text-[#6D2932] font-bold px-1 hover:text-[#99B19C] cursor-pointer focus:outline-none"
                    >
                      Login
                    </Link>
                  </p>
                  <p className="text-[#99B19C] text-xs sm:text-sm">
                    Don't have an account?
                    <Link
                      to="/register"
                      className="text-[#6D2932] font-bold px-1 hover:text-[#99B19C] cursor-pointer focus:outline-none"
                    >
                      Register
                    </Link>
                  </p>
                </div>
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

export default ForgotPassword;
