import React from "react";
import Logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tl from-[#99B19C] via-[#D7D1C9] to-[#FAF5EF]/40 text-[#6D2932] pt-10 pb-4 px-4 md:px-20 border-t border-[#D7D1C9]/60 shadow-inner text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        {/* Logo and Info */}
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              className="h-14 w-14 object-cover rounded-full shadow-md"
              alt="BloodDetect logo"
            />
            <span className="font-bold text-xl tracking-tight select-none text-[#6D2932]">
              Bindu
            </span>
          </div>
          <p className="text-[#6D2932]/70 mt-2 text-center md:text-left">
            © 2025 Blood Group Detection System. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-[#99B19C] tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#6D2932]/80 hover:text-[#99B19C] transition font-medium"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#6D2932]/80 hover:text-[#99B19C] transition font-medium"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#6D2932]/80 hover:text-[#99B19C] transition font-medium"
                >
                  Detection
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#99B19C] tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#6D2932]/80 hover:text-[#99B19C] transition font-medium"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#6D2932]/80 hover:text-[#99B19C] transition font-medium"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#D7D1C9]/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#99B19C] font-medium">
            Made for better healthcare
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-[#99B19C] hover:text-[#6D2932] transition"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#99B19C] hover:text-[#6D2932] transition"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
