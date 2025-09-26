import React, { useEffect, useState } from "react";
import overlayImage from "../../assets/images/overlay.png";
import skewImage from "../../assets/images/skew.png";
import { Plus, Eraser, ZoomIn, ZoomOut, X } from "lucide-react";
import { useRef } from "react";

const LeftSidebar = ({ isMobile = false, onMediaUpload, activeTool, onToolSelect }) => {
  const [isWarpActive, setIsWarpActive] = useState(false);
  const [showZoomOptions, setShowZoomOptions] = useState(false);
  const [zoomMode, setZoomMode] = useState(null); // 'zoom-in' or 'zoom-out'

  const handleOverlayClick = () => {
    if (onToolSelect) {
      onToolSelect("Overlay");
    }
    // Dispatch tool change event to deactivate zoom
    window.dispatchEvent(new CustomEvent("toolChanged", { detail: { tool: "Overlay" } }));
  };

  const handleZoomClick = () => {
    setShowZoomOptions(!showZoomOptions);
    if (zoomMode) {
      setZoomMode(null);
      if (onToolSelect) {
        onToolSelect(null);
      }
      // Dispatch zoom mode change event to clear zoom mode
      window.dispatchEvent(new CustomEvent("zoomModeChanged", { detail: { mode: null } }));
    }
  };

  const handleZoomIn = () => {
    setZoomMode('zoom-in');
    setShowZoomOptions(false);
    if (onToolSelect) {
      onToolSelect("ZoomIn");
    }
    // Dispatch zoom mode change event
    window.dispatchEvent(new CustomEvent("zoomModeChanged", { detail: { mode: "ZoomIn" } }));
  };

  const handleZoomOut = () => {
    setZoomMode('zoom-out');
    setShowZoomOptions(false);
    if (onToolSelect) {
      onToolSelect("ZoomOut");
    }
    // Dispatch zoom mode change event
    window.dispatchEvent(new CustomEvent("zoomModeChanged", { detail: { mode: "ZoomOut" } }));
  };

  useEffect(() => {
    const handler = (e) => setIsWarpActive(!!e.detail?.active);
    window.addEventListener("warpModeChanged", handler);
    return () => window.removeEventListener("warpModeChanged", handler);
  }, []);

  // Close zoom options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showZoomOptions && !event.target.closest('.zoom-container')) {
        setShowZoomOptions(false);
      }
    };

    if (showZoomOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showZoomOptions]);

  // Listen for tool changes to deactivate zoom mode
  useEffect(() => {
    const handleToolChange = (e) => {
      const tool = e.detail?.tool;
      if (tool && tool !== 'ZoomIn' && tool !== 'ZoomOut') {
        setZoomMode(null);
        setShowZoomOptions(false);
      }
    };

    window.addEventListener("toolChanged", handleToolChange);
    return () => window.removeEventListener("toolChanged", handleToolChange);
  }, []);

  // Listen for zoom mode changes from MainCanvas
  useEffect(() => {
    const handleZoomModeChange = (e) => {
      if (e.detail?.mode === null) {
        setZoomMode(null);
        setShowZoomOptions(false);
      }
    };

    window.addEventListener("zoomModeChanged", handleZoomModeChange);
    return () => window.removeEventListener("zoomModeChanged", handleZoomModeChange);
  }, []);
  const tools = [
    { icon: Plus, name: "Add", color: "text-white" },
    { image: overlayImage, name: "Overlay", onClick: handleOverlayClick },
    { image: skewImage, name: "Skew" },
    { icon: Eraser, name: "Eraser", color: "text-white" },
    { icon: ZoomIn, name: "Zoom", color: "text-white", onClick: handleZoomClick, isZoom: true },
  ];

  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
    // Dispatch tool change event to deactivate zoom
    window.dispatchEvent(new CustomEvent("toolChanged", { detail: { tool: "Add" } }));
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
            <div key={index} className={`relative ${tool.isZoom ? 'zoom-container' : ''}`}>
              <div
                className={`flex flex-col items-center space-y-2 p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#222232] transition-colors cursor-pointer ${activeTool === tool.name ? "ring-2 ring-white" : ""
                  }`}
              >
                <div
                  className="w-12 h-12 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors"
                  onClick={tool.name === "Add" ? handleClickUpload : tool.onClick}
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

              {/* Zoom Options for Mobile */}
              {tool.isZoom && showZoomOptions && (
                <div className="absolute top-full left-0 mt-2 bg-[#1a1a2e] rounded-lg shadow-lg border border-gray-600 p-2 z-50 w-full">
                  <div className="flex flex-col space-y-2">
                    <button
                      className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#2a2a3e] rounded transition-colors"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span className="text-sm">Zoom In</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#2a2a3e] rounded transition-colors"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="w-4 h-4" />
                      <span className="text-sm">Zoom Out</span>
                    </button>
                  </div>
                </div>
              )}
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
        <div
          className={`w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer ${activeTool === "Overlay" ? "ring-2 ring-white" : ""
            }`}
          onClick={handleOverlayClick}
        >
          <img src={overlayImage} alt="" className="w-5 h-5" />
        </div>
        <div
          className={`w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer ${isWarpActive ? "ring-2 ring-white" : ""
            }`}
          onClick={() => {
            window.dispatchEvent(new Event("enterWarpTransform"));
            // Dispatch tool change event to deactivate zoom
            window.dispatchEvent(new CustomEvent("toolChanged", { detail: { tool: "Skew" } }));
          }}
        >
          <img src={skewImage} alt="" className="w-5 h-5" />
        </div>
        <div
          className="w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer"
          // Find the eraser div and update its onClick:
          onClick={() => {
            window.dispatchEvent(new Event("enterEraserMode"));
            // Dispatch tool change event to deactivate zoom
            window.dispatchEvent(new CustomEvent("toolChanged", { detail: { tool: "Eraser" } }));
          }}
        >
          <Eraser className="w-5 h-5 text-white" />
        </div>
        <div className="relative zoom-container">
          <div
            className={`w-10 h-10 bg-[#8088e2] rounded-lg flex items-center justify-center hover:bg-[#717add] transition-colors cursor-pointer ${zoomMode ? "ring-2 ring-white" : ""}`}
            onClick={handleZoomClick}
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </div>

          {/* Zoom Options Dropdown */}
          {showZoomOptions && (
            <div className="absolute left-12 top-0 bg-[#1a1a2e] rounded-lg shadow-lg border border-gray-600 p-2 z-50">
              <div className="flex flex-col space-y-2">
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#2a2a3e] rounded transition-colors"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="text-sm">Zoom In</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#2a2a3e] rounded transition-colors"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="w-4 h-4" />
                  <span className="text-sm">Zoom Out</span>
                </button>
              </div>
            </div>
          )}
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