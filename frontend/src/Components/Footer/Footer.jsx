import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";

const logoVariants = {
  rest: { scale: 1, boxShadow: "0 0 0px #6D2932" }, // maroon
  hover: {
    scale: 1.15,
    boxShadow: "0 0 32px #6D2932", // maroon
    transition: { type: "spring", stiffness: 300 },
  },
};

const linkVariants = {
  rest: {
    x: 0,
    scale: 1,
    color: "#530201",
    borderBottom: "2px solid transparent",
  },
  hover: {
    x: 6,
    scale: 1.08,
    color: "#6D2932", // maroon
    borderBottom: "2px solid #6D2932", // maroon
    transition: { type: "spring", stiffness: 300 },
  },
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.25,
    rotate: 15,
    boxShadow: "0 0 16px #6D2932", // maroon
    transition: { type: "spring", stiffness: 300 },
  },
};

// Add some color variants to test
const footerVariants = [
  {
    background: "linear-gradient(120deg, #6D2932 0%, #E8D8C4 100%)",
    color: "#561C24",
    accent: "#C7B7A3",
  },
  {
    background: "linear-gradient(120deg, #C7B7A3 0%, #fff 100%)",
    color: "#6D2932",
    accent: "#561C24",
  },
  {
    background: "linear-gradient(120deg, #E8D8C4 0%, #6D2932 100%)",
    color: "#561C24",
    accent: "#C7B7A3",
  },
  {
    background: "linear-gradient(120deg, #561C24 0%, #C7B7A3 100%)",
    color: "#E8D8C4",
    accent: "#6D2932",
  },
];

const Footer = ({ variant = 2 }) => {
  const theme = footerVariants[variant % footerVariants.length];
  return (
    <footer
      className="pt-10 pb-4 px-4 md:px-20"
      style={{
        background: theme.background,
        color: theme.color,
        position: "relative",
        zIndex: 10,
      }}
    >
      <motion.div
        className="max-w-6xl mx-auto w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl px-8 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
      >
        {/* Logo and Info */}
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="flex items-center gap-4">
            <motion.img
              src={Logo}
              alt="BloodDetect logo"
              className="h-14 w-14 object-cover rounded-full shadow-lg cursor-pointer border-4 border-white"
              variants={logoVariants}
              initial="rest"
              whileHover="hover"
              style={{
                background: "#fff",
              }}
            />
            <div className="flex flex-col items-start">
              <span
                className="font-extrabold text-2xl tracking-tight select-none"
                style={{
                  color: "#6D2932", // <-- logo text color updated
                  letterSpacing: "0.04em",
                }}
              >
                Bindu
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: theme.color, opacity: 0.7 }}
              >
                AI-Powered Blood Detection
              </span>
            </div>
          </div>
          <p className="mt-2 text-center md:text-left opacity-80 text-sm">
            © 2025 Blood Group Detection System. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <h3
              className="font-semibold tracking-wider uppercase mb-4"
              style={{ color: theme.accent }}
            >
              Navigation
            </h3>
            <ul className="space-y-2">
              {["Home", "About", "Blood Bank"].map((label) => (
                <motion.li key={label} initial="rest" whileHover="hover">
                  <motion.a
                    href={label === "About" ? "#about" : "#"}
                    className="font-medium"
                    variants={linkVariants}
                    style={{
                      color: theme.color,
                      cursor: "pointer",
                      paddingBottom: "2px",
                      display: "inline-block",
                    }}
                  >
                    {label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="font-semibold tracking-wider uppercase mb-4"
              style={{ color: theme.accent }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms"].map((label) => (
                <motion.li key={label} initial="rest" whileHover="hover">
                  <motion.a
                    href="#"
                    className="font-medium"
                    variants={linkVariants}
                    style={{
                      color: theme.color,
                      cursor: "pointer",
                      paddingBottom: "2px",
                      display: "inline-block",
                    }}
                  >
                    {label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 mt-6 md:mt-0">
          <motion.a
            href="#"
            className="transition"
            initial="rest"
            whileHover="hover"
            variants={iconVariants}
          >
            <span className="sr-only">Facebook</span>
            <svg className="h-7 w-7" fill={theme.accent} viewBox="0 0 24 24">
              <motion.path
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                variants={iconVariants}
              />
            </svg>
          </motion.a>
          <motion.a
            href="#"
            className="transition"
            initial="rest"
            whileHover="hover"
            variants={iconVariants}
          >
            <span className="sr-only">Twitter</span>
            <svg className="h-7 w-7" fill={theme.accent} viewBox="0 0 24 24">
              <motion.path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                variants={iconVariants}
              />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
