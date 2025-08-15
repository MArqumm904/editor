import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import img from "../assets/images/1.png";
import leave1 from "../assets/images/leave1.png";
import leave2 from "../assets/images/leave2.png";
import leave3 from "../assets/images/leave3.png";
import leave4 from "../assets/images/leave4.png";

const Donatehero = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-darkbg relative overflow-hidden flex items-center justify-center">
      {/* Animated floating elements - decorative shapes */}
      <div className="absolute top-20 left-20 w-24 h-24 opacity-60">
        <img
          src={leave1}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute top-32 right-32 w-20 h-20 opacity-70">
        <img
          src={leave1}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Main content container */}
      <div className="text-center z-10 px-4 max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Bring Your Photos To Life
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Animate your images with magical motion in just seconds.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="px-12 py-5 bg-[#8088E2] text-white font-semibold rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Create Now
          </button>
          <button className="px-12 py-5 bg-transparent border-2 border-gray-600 text-white font-semibold rounded-md hover:border-[#8088E2] hover:text-[#8088E2] transition-all duration-300">
            Explore Gallery
          </button>
        </div>

        {/* Video showcase container */}
        <div className="relative w-[90vw] max-w-[1200px] mx-auto pt-12">
          {/* Rounded container with gradient border */}
          <div className="relative p-1 bg-[#8088E2] rounded-3xl shadow-2xl">
            <div className="bg-black rounded-3xl overflow-hidden relative">
              {/* Video/Image container */}
              <div
                className="relative"
                style={{
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  width: "100%",
                }}
              >
                {/* Image */}
                <img
                  src={img}
                  alt="Animated landscape preview"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayClick}
                    className="w-24 h-24 bg-[#8088E2] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 hover:bg-[#8088E2]"
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-white ml-1" />
                    ) : (
                      <Play className="w-10 h-10 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Video element (hidden initially) */}
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl hidden"
                  src=""
                  controls={false}
                  muted
                  loop
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-24 h-24 opacity-30">
        <img
          src={leave3}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative -top-44 right-[420px] w-24 h-24 opacity-40">
        <img
          src={leave4}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Donatehero;
