// src/components/EditorComponents/leftSidebar.jsx
import React from "react";
import overlayImage from "../../assets/images/overlay.png";
import skewImage from "../../assets/images/skew.png";
import ColorMatchImage from "../../assets/images/color_match.png";
import { Plus, Eraser, ZoomIn } from "lucide-react";

const LeftSidebar = () => {
  return (
    <div className="w-16 bg-[#121018] flex flex-col items-center py-4 space-y-4  rounded-lg mx-2 my-2">
      {/* Top section with Cinemaglow branding */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Navigation icons */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer">
          <img src={overlayImage} alt="" className="w-5 h-5" />
        </div>
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer">
          <img src={skewImage} alt="" className="w-5 h-5" />
        </div>
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer">
          <Eraser className="w-5 h-5 text-white" />
        </div>
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer">
          <img src={ColorMatchImage} alt="" className="w-5 h-5" />
        </div>
        <div className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer">
          <ZoomIn className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
