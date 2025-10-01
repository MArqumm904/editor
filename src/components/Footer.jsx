import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#8B8FE8] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Cinemaglow Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl lg:text-2xl font-bold mb-4 lg:mb-6">
              Stardust Photo Editor
            </h2>
            <p className="text-white/90 text-sm lg:text-base leading-relaxed">
              Stardust Cinemagraph brings your photos to life with stunning
              cinemagraphs, animated images, and looping motion graphics.
            </p>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">
              Social Media
            </h3>
            <div className="flex space-x-3">
              {/* Facebook */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>

              {/* LinkedIn */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.3726 0 0 5.3726 0 12c0 4.991 3.066 9.266 7.444 11.043-.103-.938-.196-2.378.041-3.405.214-.928 1.379-5.91 1.379-5.91s-.352-.704-.352-1.747c0-1.635.949-2.856 2.127-2.856 1.003 0 1.488.753 1.488 1.655 0 1.007-.641 2.512-.972 3.904-.277 1.17.588 2.12 1.743 2.12 2.092 0 3.7-2.207 3.7-5.392 0-2.816-2.021-4.787-4.907-4.787-3.345 0-5.305 2.51-5.305 5.103 0 1.015.39 2.104.878 2.695.097.116.111.217.082.333-.089.364-.289 1.17-.328 1.333-.05.21-.164.255-.381.154-1.418-.66-2.31-2.72-2.31-4.377 0-3.566 2.595-6.841 7.489-6.841 3.934 0 6.986 2.806 6.986 6.56 0 3.916-2.461 6.978-5.88 6.978-1.148 0-2.227-.596-2.594-1.298 0 0-.617 2.35-.761 2.88-.288 1.02-1.059 2.03-1.575 2.71C9.86 23.836 10.925 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Link Section */}
          {/* Quick Link Section */}
          <div className="lg:col-span-1 mb-7">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">
              Quick Link
            </h3>
            <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
              <li>
                <Link
                  to={"/create"}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  to={"/gallery"}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to={"/donate"}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  to={"/partner"}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Partner with Us
                </Link>
              </li>

              {/* Replace Contact with Edit Photos */}
              <li>
                <Link
                  to={"/create"}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Create
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">
              Edit Your Photos
            </h3>
            <div className="text-sm lg:text-base text-white/90 space-y-2">
              <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                Explore creative stickers, moving pictures, video backgrounds,
                and overlays designed for websites, social media, and
                storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Links Section */}
        <div className="border-t border-[#6776c6] pt-6 lg:pt-7">
          <div className="flex flex-col sm:flex-row  space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-sm lg:text-base text-white/80">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Term & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section - Dark Background */}
      <div className="bg-[#0d0b13] py-3 lg:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center text-xs lg:text-sm text-white/60">
            © 2025 • Stardust Photo Editor. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
