import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from ".././assets/images/logo1.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Create", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Donate", path: "/donate" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-darkbg text-white border-white/5">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-3 lg:py-10 mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Cinemaglow Logo"
              className="h-24 w-auto object-contain"
            />
            <span className="text-3xl font-bold tracking-wide">Stardust</span>
          </div>
          {/* Nav Links */}
          <div
            className="relative backdrop-blur-xl border border-white/20 px-7 py-2 rounded-full flex items-center gap-1"
            style={{
              backdropFilter: "blur(20px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[16px] font-semibold px-3 py-2 rounded-md transition-all duration-300 ${isActive
                    ? "text-[#8088E2]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#8088E2] rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Donate Button */}
          <div className="relative inline-block">
            <svg
              width="150"
              height="45"
              viewBox="0 0 150 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                d="M1 1 H138 L149 12 V44 H1 Z"
                stroke="#8088E2"
                strokeWidth="2"
                fill="transparent"
              />
            </svg>
            <button
              onClick={() =>
                window.open(
                  "https://www.paypal.com/donate?hosted_button_id=6SWFP9BSSTJ9G",
                  "_self" // same tab
                )
              }
              className="relative z-10 px-10 ms-2 py-2.5 text-[16px] font-medium text-white transition-all duration-300 hover:bg-[#8088E2] hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "transparent" }}
            >
              Donate
            </button>
          </div>

        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between">
            {/* Logo - Smaller on mobile */}
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-wider">
              Cinemaglow
            </h1>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div
              className="backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-2"
              style={{
                backdropFilter: "blur(20px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
              }}
            >
              {/* Mobile Nav Links */}
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-[16px] font-semibold px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                      ? "text-[#8088E2] bg-[#8088E2]/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Mobile Donate Button */}
              <div className="pt-2">
                <button
                  className="w-full text-center py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 border border-[#8088E2] hover:bg-[#8088E2] hover:shadow-lg"
                  style={{ background: "transparent" }}
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden items-center justify-between">
          {/* Logo */}
          <h1 className="text-3xl font-semibold tracking-wider">Cinemaglow</h1>

          {/* Tablet Nav Links */}
          <div
            className="relative backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full flex items-center gap-1"
            style={{
              backdropFilter: "blur(20px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[14px] font-semibold px-2 py-2 rounded-md transition-all duration-300 ${isActive
                    ? "text-[#8088E2]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#8088E2] rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Tablet Donate Button */}
          <div className="relative inline-block">
            <svg
              width="120"
              height="40"
              viewBox="0 0 150 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                d="M1 1 H108 L119 12 V39 H1 Z"
                stroke="#8088E2"
                strokeWidth="2"
                fill="transparent"
              />
            </svg>
            <button
              className="relative z-10 px-8 ms-2 py-2 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#8088E2] hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "transparent" }}
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
