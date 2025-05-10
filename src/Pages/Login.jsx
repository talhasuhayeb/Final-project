import { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login data:" : "Register data:", formData);
    // ...
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2c2c2c] text-white rounded-xl shadow-lg border border-[#B79455] overflow-hidden">
          <div className="p-8 text-center">
            {isLogin ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase text-[#B79455]">
                  Login
                </h2>
                <p className="text-[#d1d1d1]">
                  Please enter your login and password!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                      required
                    />
                    <label
                      htmlFor="loginEmail"
                      className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      id="loginPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                      required
                    />
                    <label
                      htmlFor="loginPassword"
                      className="absolute left-0 -top-3.5 text-[#B79455] text-sm transition-all pointer-events-none"
                    >
                      Password
                    </label>
                  </div>

                  <p className="text-[#d1d1d1] hover:text-[#B79455] cursor-pointer text-sm">
                    Forgot password?
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#8A0302] hover:bg-[#6e0202] text-white font-bold transition duration-300"
                  >
                    Login
                  </button>

                  <div className="flex justify-center space-x-6 pt-4">
                    <a
                      href="#!"
                      className="text-[#B79455] hover:text-[#8A0302]"
                    ></a>
                    <a
                      href="#!"
                      className="text-[#B79455] hover:text-[#8A0302]"
                    ></a>
                    <a
                      href="#!"
                      className="text-[#B79455] hover:text-[#8A0302]"
                    ></a>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase text-[#B79455]">
                  Register
                </h2>
                <p className="text-[#d1d1d1]">Please enter your details!</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="regName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-transparent border-b border-[#B79455] focus:outline-none focus:border-[#8A0302]"
                      required
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
                      required
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
                      required
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
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                          className="text-[#8A0302] focus:ring-[#8A0302]"
                          required
                        />
                        <span className="ml-2 text-white">Male</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                          className="text-[#8A0302] focus:ring-[#8A0302]"
                        />
                        <span className="ml-2 text-white">Female</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === "other"}
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
                      placeholder=" "
                      required
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
                </form>
              </div>
            )}

            <div className="mt-6">
              <p className="text-[#d1d1d1] text-sm">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#B79455] font-bold hover:text-[#8A0302] cursor-pointer focus:outline-none"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
