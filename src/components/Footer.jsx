import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#8B92E8] text-white">
      <div className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-4 gap-8 mb-12">
          {/* Cinemaglow Section */}
          <div className="col-span-2">
            <h2 className="text-3xl font-bold mb-6">Cinemaglow</h2>
            <p className="text-white/80 text-base leading-relaxed max-w-sm">
              Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius
            </p>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Social Media</h3>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-[#27477D47] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <span className="text-base font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-[#27477D47] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <span className="text-base">𝕏</span>
              </div>
              <div className="w-10 h-10 bg-[#27477D47] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <span className="text-base">●</span>
              </div>
              <div className="w-10 h-10 bg-[#27477D47] rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                <span className="text-base font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Quick Link and Contact Section */}
          <div className="flex justify-between">
            <div className="mr-16">
              <h3 className="text-xl font-semibold mb-6">Quick Link</h3>
              <ul className="space-y-3 text-base">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Create</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Donate</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Partner with Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className='ml-20'>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <div className="text-base text-white/80 space-y-2">
                <p>+12 123-3456-5675</p>
                <p>contact@domain.com</p>
                <p>example@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8">
          <div className="flex space-x-8 text-base text-white/80">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Term & Conditions</a>
          </div>
        </div>
      </div>
      
      {/* Copyright Section - Dark Background */}
      <div className="bg-darkbg py-4">
        <div className="max-w-7xl mx-auto px-12">
          <div className="text-center text-sm text-white/60">
            © 2025 • Cinemagraph Website
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer