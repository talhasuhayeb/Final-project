import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-br  text-white min-h-screen flex items-center justify-center p-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Text Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-wide border-b-4 border-[#B79455] pb-2 inline-block">
            How Our Blood Group Detection System Works
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            {/* Card-1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#B79455]/30 hover:border-[#B79455] transition-all">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-[#B79455]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#B79455] text-center">
                1. Sample Collection
              </h3>
              <p className="text-white/90 font-medium text-center">
                Users begin by uploading a high-quality image of their
                fingerprint through our secure web interface.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-[#B79455]/30 hover:border-[#B79455] transition-all">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-[#B79455]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#B79455] text-center">
                2. AI Analysis
              </h3>
              <p className="text-white/90 font-medium text-center">
                Our trained neural network analyzes the blood sample images,
                detecting agglutination patterns that indicate blood type
                reactions with anti-A, anti-B, and anti-D antibodies.
              </p>
            </div>

            {/* Card-3 */}
            <div className="bg-white/10 font-medium backdrop-blur-sm rounded-xl p-6 border border-[#B79455]/30 hover:border-[#B79455] transition-all">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-[#B79455]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#B79455] text-center">
                3. Result Verification
              </h3>
              <p className="text-white/90 text-center">
                The system cross-references findings with our medical database
                and provides a verified blood type result (A/B/AB/O and Rh
                factor) with 99.8% accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
