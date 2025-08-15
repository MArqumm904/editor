import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const links = [
    { name: "Create", path: "/" }, 
    { name: "Gallery", path: "/gallery" },
    { name: "Donate", path: "/donate" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-darkbg text-white border-white/5">
      <div className="max-w-7xl px-8 py-10 mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-4xl font-semibold tracking-wider">Cinemaglow</h1>

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
                `relative text-[16px] font-semibold px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive
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
            className="relative z-10 px-10 ms-2 py-2.5 text-[16px] font-medium text-white transition-all duration-300 hover:bg-[#8088E2]  hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "transparent" }}
          >
            Donate
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
