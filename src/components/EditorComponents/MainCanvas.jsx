// src/components/EditorComponents/MainCanvas.jsx
import React from "react";

const MainCanvas = () => {
  return (
    <div className="flex-1 bg-[#121018] relative flex flex-col rounded-xl mx-2 my-2">
      {/* Main Canvas Area - Large blank area */}
      <div className="flex-1">
        {/* This area is intentionally empty as shown in the image */}
      </div>

      {/* Bottom centered element */}
      <div className="absolute bg-[#0d0b13] h-12 px-40 rounded-lg bottom-4 left-1/2 transform -translate-x-1/2">
        {/* content */}
      </div>
    </div>
  );
};

export default MainCanvas;
