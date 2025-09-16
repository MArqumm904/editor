import React from "react";
import overlayImage from "../../assets/images/overlay.png";
import skewImage from "../../assets/images/skew.png";
import ColorMatchImage from "../../assets/images/color_match.png";
import { Plus, Eraser, ZoomIn } from "lucide-react";
import { useRef } from "react";

const LeftSidebar = ({ isMobile = false, onMediaUpload }) => {
  const tools = [
    { icon: Plus, name: "Add", color: "text-white" },
    { image: overlayImage, name: "Overlay" },
    { image: skewImage, name: "Skew" },
    { icon: Eraser, name: "Eraser", color: "text-white" },
    { image: ColorMatchImage, name: "Color Match" },
    { icon: ZoomIn, name: "Zoom", color: "text-white" },
  ];

  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && onMediaUpload) {
      const fileArray = Array.from(files);
      const mediaFiles = fileArray.filter(
        (file) =>
          file &&
          file.type &&
          (file.type.startsWith("image/") ||
            file.type.startsWith("video/") ||
            file.type === "image/gif")
      );

      if (mediaFiles.length > 0) {
        onMediaUpload(mediaFiles);
      }
    }
  };

  if (isMobile) {
    return (
      <div className="w-full bg-[#121018] p-4 rounded-lg h-full">
        <h2 className="text-white text-lg font-bold mb-4">Tools</h2>
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#222232] transition-colors cursor-pointer"
            >
              <div
                className="w-12 h-12 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors"
                onClick={tool.name === "Add" ? handleClickUpload : undefined}
              >
                {tool.icon ? (
                  <tool.icon
                    className={`w-6 h-6 ${tool.color || "text-white"}`}
                  />
                ) : (
                  <img src={tool.image} alt={tool.name} className="w-6 h-6" />
                )}
              </div>
              <span className="text-white text-xs font-medium text-center">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile-specific instructions */}
        <div className="mt-6 p-3 bg-[#1a1a2e] rounded-lg">
          <p className="text-white text-xs opacity-70 text-center">
            Tap on any tool to apply it to your selected media
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-16 bg-[#121018] flex flex-col items-center py-4 space-y-4 rounded-lg mx-2 my-2">
      {/* Top section with Cinemaglow branding */}
      <div className="flex flex-col items-center space-y-3">
        <div
          className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#717add]"
          onClick={handleClickUpload}
        >
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
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.gif"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default LeftSidebar;
