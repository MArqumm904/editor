import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#8B8FE8] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Cinemaglow Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Cinemaglow</h2>
            <p className="text-white/90 text-sm lg:text-base leading-relaxed">
              Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius
            </p>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Social Media</h3>
            <div className="flex space-x-3">
              {/* Facebook */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              
              {/* Twitter/X */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              
              {/* Dribbble */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.72C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
                </svg>
              </div>
              
              {/* LinkedIn */}
              <div className="w-10 h-10 bg-[#6776c6] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Link Section */}
          <div className="lg:col-span-1 mb-7">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Quick Link</h3>
            <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Create</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Donate</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Partner with Us</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Contact</h3>
            <div className="text-sm lg:text-base text-white/90 space-y-2">
              <p>+12 123-3456-5675</p>
              <p>contact@domain.com</p>
              <p>example@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Links Section */}
        <div className="border-t border-[#6776c6] pt-6 lg:pt-7">
          <div className="flex flex-col sm:flex-row  space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-sm lg:text-base text-white/80">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Term & Conditions</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section - Dark Background */}
      <div className="bg-[#0d0b13] py-3 lg:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center text-xs lg:text-sm text-white/60">
            © 2025 • Cinemagraph Website
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer