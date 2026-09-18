import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// AdminHeader styled like DashboardHeader, with logo on the left
export default function AdminHeader({
  title,
  subtitle,
  adminName,
  onHome,
  onLogout,
  logo, // pass logo prop
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
            {/* Website logo */}
            <img
              src={logo}
              alt="Website logo"
              className="h-10 w-10 lg:h-14 lg:w-14 object-cover rounded-full shadow-lg cursor-pointer border-2 lg:border-4 border-white bg-white transition-all duration-300"
              style={{ background: "#fff" }}
            />
            <div className="flex flex-col">
              <span
                className="font-extrabold text-xl lg:text-2xl tracking-tight select-none transition-all duration-300"
                style={{
                  color: "#E8D8C4",
                  letterSpacing: "0.04em",
                }}
              >
                {title}
              </span>
              {subtitle && (
                <span
                  className="text-[10px] lg:text-xs font-medium transition-all duration-300"
                  style={{ color: "#C7B7A3", opacity: 0.7 }}
                >
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="font-semibold text-xs lg:text-base text-[#C7B7A3] w-full text-center md:w-auto md:text-left mb-2 md:mb-0 transition-all duration-300">
              Welcome, {adminName}
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
              Welcome, {adminName}
            </span>
            <div className="flex flex-col gap-4">
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
