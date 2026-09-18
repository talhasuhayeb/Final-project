import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const logoVariants = {
  rest: { scale: 1, boxShadow: "0 0 0px #E8D8C4" },
  hover: {
    scale: 1.18,
    boxShadow: "0 0 40px #E8D8C4",
    transition: { type: "spring", stiffness: 300 },
  },
};

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 60 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// DashboardHeader renders the top navigation bar with logo, greeting, and actions
export default function DashboardHeader({
  logo,
  loggedInUser,
  onHome,
  onLogout,
  activeSection,
  setActiveSection,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Return the JSX for the header/navigation bar
  return (
    <header
      className="mx-auto z-50 my-4 sm:my-8 sticky top-4 sm:top-8 w-[95%] sm:w-full"
      style={{
        maxWidth: "1100px",
        borderRadius: "2rem",
        boxShadow:
          "0 8px 32px 0 rgba(199,183,163,0.12), 0 1.5px 8px 0 rgba(232,216,196,0.08)",
        background: "rgba(86,28,36,0.92)", // #561C24 glassy
        backdropFilter: "blur(22px)",
        padding: "0.5rem 0",
      }}
    >
      <nav>
        <div className="flex flex-row justify-between items-center w-full h-16 sm:h-20 py-4 gap-4 px-4 sm:px-8">
          <div className="flex items-center space-x-3 lg:space-x-4 group">
            <motion.img
              src={logo}
              alt="BloodDetect logo"
              className="h-10 w-10 lg:h-14 lg:w-14 object-cover rounded-full shadow-lg cursor-pointer border-2 lg:border-4 border-white bg-white transition-all duration-300"
              variants={logoVariants}
              initial="rest"
              whileHover="hover"
              style={{
                background: "#fff",
              }}
            />
            <div className="flex flex-col">
              <span
                className="font-extrabold text-xl lg:text-2xl tracking-tight select-none transition-all duration-300"
                style={{
                  color: "#E8D8C4",
                  letterSpacing: "0.04em",
                }}
              >
                Bindu
              </span>
              <span
                className="text-[10px] lg:text-xs font-medium transition-all duration-300"
                style={{ color: "#C7B7A3", opacity: 0.7 }}
              >
                AI-Powered Blood Detection
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="font-semibold text-xs lg:text-base text-[#C7B7A3] w-full text-center md:w-auto md:text-left mb-2 md:mb-0 transition-all duration-300">
              Welcome, {loggedInUser}
            </span>
            <button
              onClick={onHome}
              className="px-3 py-2 lg:px-5 lg:py-2 text-sm lg:text-base min-h-[40px] lg:min-h-[48px] rounded-xl font-semibold text-[#C7B7A3] bg-[#E8D8C4]/10 border border-[#C7B7A3] transition shadow cursor-pointer hover:scale-105"
              type="button"
              style={{
                backdropFilter: "blur(8px)",
                border: "1.5px solid #C7B7A3",
              }}
            >
              Home
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 lg:px-5 lg:py-2 text-sm lg:text-base min-h-[40px] lg:min-h-[48px] rounded-xl font-semibold text-[#561C24] bg-gradient-to-r from-[#C7B7A3] to-[#E8D8C4] transition shadow cursor-pointer hover:scale-105"
              type="button"
              style={{
                border: "1.5px solid #C7B7A3",
                boxShadow: "0 2px 12px #C7B7A322",
              }}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-xl bg-[#C7B7A3]/60 hover:bg-[#E8D8C4]/10 transition shadow flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              viewBox="0 0 32 32"
              fill="none"
              stroke="#E8D8C4"
              strokeWidth="2"
              initial={{ rotate: 0 }}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              {menuOpen ? (
                <path d="M8 8L24 24M8 24L24 8" strokeLinecap="round" />
              ) : (
                <path d="M6 12h20M6 18h20" strokeLinecap="round" />
              )}
            </motion.svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="sm:hidden fixed top-20 right-4 w-60 bg-[#561C24]/90 backdrop-blur-xl shadow-2xl border-l border-[#C7B7A3] flex flex-col p-6 gap-4 z-50 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(86,28,36,0.95) 60%, rgba(232,216,196,0.09) 100%)",
              border: "1.5px solid #C7B7A3",
            }}
          >
            <span className="font-semibold text-center text-lg text-[#C7B7A3] mb-4">
              Welcome, {loggedInUser}
            </span>
            <div className="flex flex-col gap-4">
              {/* Dashboard Sections */}
              {setActiveSection && (
                <div className="flex flex-col gap-2 border-b border-[#C7B7A3]/30 pb-4">
                  <button
                    onClick={() => {
                      setActiveSection("main");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 min-h-[48px] rounded-lg font-bold text-[#C7B7A3] transition-all duration-200 hover:bg-[#99B19C]/20 ${
                      activeSection === "main"
                        ? "bg-[#99B19C]/30 text-white"
                        : ""
                    }`}
                  >
                    Detection
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("profile");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 min-h-[48px] rounded-lg font-bold text-[#C7B7A3] transition-all duration-200 hover:bg-[#99B19C]/20 ${
                      activeSection === "profile"
                        ? "bg-[#99B19C]/30 text-white"
                        : ""
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("methodology");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 min-h-[48px] rounded-lg font-bold text-[#C7B7A3] transition-all duration-200 hover:bg-[#99B19C]/20 ${
                      activeSection === "methodology"
                        ? "bg-[#99B19C]/30 text-white"
                        : ""
                    }`}
                  >
                    Methodology
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("bloodArticle");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 min-h-[48px] rounded-lg font-bold text-[#C7B7A3] transition-all duration-200 hover:bg-[#99B19C]/20 ${
                      activeSection === "bloodArticle"
                        ? "bg-[#99B19C]/30 text-white"
                        : ""
                    }`}
                  >
                    Blood Article
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("history");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 min-h-[48px] rounded-lg font-bold text-[#C7B7A3] transition-all duration-200 hover:bg-[#99B19C]/20 ${
                      activeSection === "history"
                        ? "bg-[#99B19C]/30 text-white"
                        : ""
                    }`}
                  >
                    History
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onHome();
                }}
                className="w-full px-5 py-3 min-h-[48px] flex items-center justify-center rounded-xl font-semibold text-[#C7B7A3] bg-white/80 border border-[#C7B7A3] hover:bg-[#E8D8C4]/10 transition shadow mt-2"
                type="button"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="w-full px-5 py-3 min-h-[48px] flex items-center justify-center rounded-xl font-semibold text-[#561C24] bg-gradient-to-r from-[#C7B7A3] to-[#E8D8C4] hover:from-[#E8D8C4] hover:to-[#C7B7A3] transition shadow"
                type="button"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
