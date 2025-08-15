// src/components/EditorComponents/SecondSidebar.jsx
import React, { useState } from "react";
import GifImage from "../../assets/images/gif.png";
import DocImage from "../../assets/images/doc.png";
import PlayImage from "../../assets/images/play.png";
import Dots from "../../assets/images/dots.png";
import { ChevronDown, Image, Play, Move } from "lucide-react";

const SecondSidebar = () => {
  const [activeTab, setActiveTab] = useState("Upload");

  // Mock data for layers
  const layers = [
    { id: 1, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 2, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 3, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 4, name: "Image name", thumbnail: "/api/placeholder/40/40" },
  ];

  return (
    <div className="w-72 bg-[#121018] p-4 rounded-lg  my-2">
      {/* Header */}
      <h1 className="text-white text-xl font-bold mb-4">Cinemaglow</h1>

      {/* Tab Toggle */}
      <div className="flex mb-4">
        <div className="flex bg-[#8088e2] rounded-2xl overflow-hidden p-1">
          <button
            className={`px-11 py-2 text-xs font-medium transition-colors rounded-2xl ${
              activeTab === "Layer"
                ? "bg-[#fff] text-black"
                : "text-[#ffffff] hover:text-white"
            }`}
            onClick={() => setActiveTab("Layer")}
          >
            Layer
          </button>
          <button
            className={`px-11 py-1 text-xs font-medium transition-colors rounded-2xl ${
              activeTab === "Upload"
                ? "bg-[#fff] text-black"
                : "text-[#ffffff] hover:text-white"
            }`}
            onClick={() => setActiveTab("Upload")}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "Upload" ? (
        /* Upload Content */
        <div className="max-w-full">
          <div className="text-white text-md font-medium mb-2">Your Media</div>

          {/* Import Media Dropdown */}
          <div className="bg-[#8088e2] rounded-xl p-3 mb-5 flex items-center justify-between hover:bg-[#5855eb] transition-colors cursor-pointer">
            <span className="text-white text-xs font-medium ms-2">
              Import Media
            </span>
            <ChevronDown className="w-5 h-5 text-white" />
          </div>

          {/* Media Import Zone */}
          <div className="border-2 border-dashed border-white rounded-2xl p-8 text-center h-[33rem] flex flex-col justify-center">
            <div className="flex items-center justify-center space-x-6 rounded-xl bg-[#100f17] p-1 mb-4">
              <img src={DocImage} alt="" />
              <img src={GifImage} alt="" />
              <img src={PlayImage} alt="" />
            </div>

            <p className="text-white text-xs mb-2">
              Drag & Drop Media From Your Device To Import
            </p>

            <p className="text-white text-xs opacity-80">JPE GIF Video</p>
          </div>
        </div>
      ) : (
        /* Layer Content */
        <div className="max-w-full bg-[#17151d] rounded-xl p-2 h-[38rem]">
          <div className="space-y-3">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center p-2 bg-[#1d1b23] rounded-xl hover:bg-[#222128] transition-colors cursor-pointer"
              >
                {/* Drag Handle */}
                <div className="flex flex-col mr-3 ms-1">
                  <img src={Dots} alt="" />
                </div>

                {/* Thumbnail */}
                <div className="w-10 h-12 bg-orange-400 rounded mr-3 flex-shrink-0 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/23897250/pexels-photo-23897250.jpeg?_gl=1*1msubz2*_ga*OTc3NzE2NDMwLjE3NTQzMjc5MTY.*_ga_8JE65Q40S6*czE3NTUyODkxNjkkbzIkZzEkdDE3NTUyODkxOTgkajMxJGwwJGgw"
                    alt=""
                  />
                </div>

                {/* Layer Name */}
                <span className="text-white text-sm font-medium">
                  {layer.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondSidebar;
