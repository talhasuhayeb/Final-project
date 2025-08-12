import React from "react";
import { motion } from "framer-motion";
import "./AboutCard.css";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.25, type: "spring", stiffness: 80 },
  }),
};

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: 12,
    scale: 1.15,
    transition: { type: "spring", stiffness: 300 },
  },
};

const About = () => {
  const cards = [
    {
      title: "1. Sample Collection",
      desc: "Users begin by uploading a high-quality image of their fingerprint through our secure web interface.",
      icon: (
        <motion.svg
          className="logo"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6D2932" // <-- maroon logo color
          variants={iconVariants}
          initial="rest"
          whileHover="hover"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </motion.svg>
      ),
    },
    {
      title: "2. AI Analysis",
      desc: "Our trained neural network analyzes the fingerprint image, detecting unique patterns and features for blood group prediction.",
      icon: (
        <motion.svg
          className="logo"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6D2932" // <-- maroon logo color
          variants={iconVariants}
          initial="rest"
          whileHover="hover"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </motion.svg>
      ),
    },
    {
      title: "3. Result Verification",
      desc: "The system cross-references findings with our medical database and provides a verified blood type result (A/B/AB/O and Rh factor) with 94.8% accuracy.",
      icon: (
        <motion.svg
          className="logo"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6D2932" // <-- maroon logo color
          variants={iconVariants}
          initial="rest"
          whileHover="hover"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </motion.svg>
      ),
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(120deg, #fff 0%, #f8e6e6 60%, #6D2932 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Text Section */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 80 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold tracking-wide border-b-4 pb-2 inline-block shadow-sm"
            style={{
              color: "#6D2932",
              borderColor: "#561C24",
              background: "linear-gradient(90deg, #6D2932 0%, #561C24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 32px #561C24",
              transition: { type: "spring", stiffness: 300, damping: 18 },
            }}
          >
            How Our Blood Group Detection System Works
          </motion.h2>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                className="card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{}}
                style={{
                  background: "#E8D8C4", // card background updated
                  borderLeft: "3px solid #6D2932",
                  borderRight: "3px solid #6D2932",
                  borderBottom: "3px solid #6D2932",
                  borderTop: "none",
                  borderRadius: "0 0 1.5em 1.5em",
                  position: "relative",
                }}
              >
                {/* Top animation line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: "#C7B7A3", // animation line color updated
                    borderRadius: "1.5em 1.5em 0 0",
                    zIndex: 2,
                  }}
                />
                {card.icon}
                <h3
                  className="text-xl font-bold mb-2 text-center"
                  style={{
                    color: "#6D2932",
                  }}
                >
                  {card.title}
                </h3>
                <div className="hover_content">
                  <p
                    className="font-medium text-center text-xs sm:text-sm"
                    style={{
                      color: "#6D2932", // maroon for <p> tag
                      opacity: 0.95,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
