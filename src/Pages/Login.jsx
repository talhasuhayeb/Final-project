import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false); // Changed to false to show register first
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };
  console.log("loginInfo ->", loginInfo);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login data:" : "Register data:", loginInfo);
    const { email, password } = loginInfo;
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
      const { success, message, error, name, jwtToken } = result;
      if (success) {
        toast.success(message, { position: "top-center" });
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
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
                Login
              </h2>
              <p className="text-[#d1d1d1]">
                Please enter your email and password!
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={loginInfo.email}
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
                    value={loginInfo.password}
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#8A0302] hover:bg-[#6e0202] text-white font-bold transition duration-300"
                >
                  Login
                </button>
                <span>
                  <p className="text-[#d1d1d1] text-sm">
                    Don't have an account?
                    <Link
                      to="/register"
                      className="text-[#B79455] font-bold px-1 hover:text-[#8A0302] cursor-pointer focus:outline-none"
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
    </div>
  );
};
export default Login;
