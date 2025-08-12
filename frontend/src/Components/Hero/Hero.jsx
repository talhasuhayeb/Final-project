import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import fingerprintImg from "../../assets/fingerprint.png"; // <-- Add this import

// Modern fingerprint SVG with blood drop accent
const FingerprintSVG = () => (
  <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
    <ellipse cx="130" cy="130" rx="120" ry="120" fill="#fff" opacity="0.96" />
    <g>
      <path
        d="M70 130c0-33 27-60 60-60s60 27 60 60"
        stroke="#561C24"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M90 150c0-22 18-40 40-40s40 18 40 40"
        stroke="#8B2C1A"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M110 170c0-11 9-20 20-20s20 9 20 20"
        stroke="#C97A6A"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Animated blood drop */}
      <motion.path
        d="M130 190c0-18 18-32 18-32s18 14 18 32a18 18 0 1 1-36 0z"
        fill="#6D2932"
        initial={{ scale: 0.8, opacity: 0.7 }}
        animate={{ scale: [0.8, 1.1, 0.95, 1], opacity: [0.7, 1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <ellipse cx="130" cy="205" rx="7" ry="4" fill="#fff" opacity="0.5" />
    </g>
  </svg>
);

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, type: "spring", stiffness: 80 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, type: "spring", stiffness: 100 },
  },
};

const subheadingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.3, type: "spring", stiffness: 80 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.7, type: "spring", stiffness: 120 },
  },
};

const accentVariants = {
  animate: {
    scale: [1, 1.12, 1],
    opacity: [0.7, 1, 0.7],
    rotate: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 7, ease: "easeInOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.2, type: "spring", stiffness: 60, delay: 0.2 },
  },
};

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #561C24 0%, #fff 100%)",
        minHeight: "100vh",
        height: "100vh",
      }}
    >
      {/* Glass background accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(184,0,27,0.13) 0%, transparent 70%), radial-gradient(circle at 20% 80%, rgba(86,28,36,0.09) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-center px-6 md:px-12 relative z-10">
        {/* Left: Content */}
        <motion.div
          className="flex flex-col justify-center items-start bg-white/95 backdrop-blur-xl rounded-2xl p-10 shadow-2xl"
          animate={{ x: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight"
            style={{
              color: "#561C24",
              textShadow: "0 2px 16px rgba(86,28,36,0.12)",
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            whileHover={{
              scale: 1.06,
              textShadow: "0 0 32px #6D2932",
              transition: { type: "spring", stiffness: 300, damping: 18 },
            }}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #561C24 0%, #6D2932 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 900,
              }}
            >
              Blood Group Detection
            </span>
            <br />
            <span style={{ color: "#222", fontWeight: 700 }}>
              Using Fingerprint
            </span>
          </motion.h1>
          <motion.p
            className="mb-8 text-lg font-medium max-w-md"
            style={{ color: "#222", opacity: 0.85, cursor: "pointer" }}
            variants={subheadingVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              x: 8,
              color: "#530201",
              transition: { type: "spring", stiffness: 200, damping: 18 },
            }}
          >
            Instant, needle-free blood group analysis powered by advanced Image
            processing and DL. Secure, fast, and accurate—Know Your Type,
            Instantly.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
              delay: 0.3,
            }}
            whileHover={{
              scale: [1, 1.08, 1],
              boxShadow: "0 0 32px #6D2932",
              transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{ display: "inline-block", borderRadius: "9999px" }}
          >
            <Link
              to="/register"
              className="inline-block px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 border-2"
              style={{
                background: "linear-gradient(90deg, #561C24 0%, #561C24 100%)",
                color: "#fff",
                borderColor: "#561C24",
                boxShadow: "0 4px 24px #561C24",
              }}
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Realistic Fingerprint Image with unique hover animation */}
        <motion.div
          className="flex justify-center items-center relative"
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
            delay: 0.2,
          }}
        >
          <motion.div
            className="relative w-[300px] h-[300px] rounded-2xl shadow-2xl border-4 flex items-center justify-center overflow-hidden"
            style={{
              borderColor: "#561C24",
              background: "rgba(255,255,255,0.85)",
            }}
            whileHover={{
              scale: 1.08,
              rotate: 4,
              boxShadow: "0 0 40px 8px #6D2932",
              transition: { type: "spring", stiffness: 200, damping: 12 },
            }}
          >
            <motion.img
              src={fingerprintImg}
              alt="Fingerprint"
              className="w-full h-full object-cover"
              style={{ opacity: 0.95 }}
              draggable={false}
              whileHover={{
                scale: 1.15,
                rotate: -6,
                filter: "drop-shadow(0 0 24px #6D2932)",
                transition: { type: "spring", stiffness: 180, damping: 10 },
              }}
            />
            {/* Animated accent circles */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full"
              style={{
                background: "rgba(184,0,27,0.18)",
                filter: "blur(16px)",
              }}
              variants={accentVariants}
              animate="animate"
              whileHover={{
                scale: 1.3,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-16 h-16 rounded-full"
              style={{
                background: "rgba(86,28,36,0.14)",
                filter: "blur(12px)",
              }}
              variants={accentVariants}
              animate="animate"
              whileHover={{
                scale: 1.4,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
