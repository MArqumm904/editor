import React, { useState, useRef, useEffect } from "react";
import GifImage from "../../assets/images/gif.png";
import DocImage from "../../assets/images/doc.png";
import PlayImage from "../../assets/images/play.png";
import Dots from "../../assets/images/dots.png";
import { ChevronDown, Image, Play, Move } from "lucide-react";

const SecondSidebar = ({
  onMediaUpload,
  uploadedMedia,
  onMediaSelect,
  onMediaReorder,
  isMobile = false,
  activeTab,
  onTabChange,
  animationOverlays = [],
  onAnimationOverlaySelect,
  onAnimationOverlayReorder,
  onAnimationOverlayRemove,
  onLayerRemove,
  onEffectRemove,
}) => {
  // const [activeTab, setActiveTab] = useState("Upload");
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedLayerIndex, setDraggedLayerIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggedAnimationIndex, setDraggedAnimationIndex] = useState(null);
  const [dragOverAnimationIndex, setDragOverAnimationIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
    type: null, // 'media' or 'animation'
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    // If activeTab prop is provided, use it
    if (activeTab && onTabChange) {
      // activeTab already controlled by parent
    }
  }, [activeTab]);

  const mediaCount = Array.isArray(uploadedMedia) ? uploadedMedia.length : 0;
  const effectCount = Array.isArray(uploadedMedia)
    ? uploadedMedia.filter((media) => media?.appliedEffect).length
    : 0;
  const totalLayerCount = mediaCount + effectCount;

  // Mock data for layers
  const layers = [
    { id: 1, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 2, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 3, name: "Image name", thumbnail: "/api/placeholder/40/40" },
    { id: 4, name: "Image name", thumbnail: "/api/placeholder/40/40" },
  ];

  const handleFileUpload = (files) => {
    try {
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
        if (onTabChange) {
          onTabChange("Layer"); // Automatically switch to Layer tab
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleLayerDragStart = (e, index) => {
    setDraggedLayerIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleLayerDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleLayerDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleLayerDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedLayerIndex !== null && draggedLayerIndex !== dropIndex) {
      const newMediaOrder = [...uploadedMedia];
      const [draggedItem] = newMediaOrder.splice(draggedLayerIndex, 1);
      newMediaOrder.splice(dropIndex, 0, draggedItem);

      if (onMediaReorder) {
        onMediaReorder(newMediaOrder);
      }
    }
    setDraggedLayerIndex(null);
    setDragOverIndex(null);
  };

  const handleLayerDragEnd = () => {
    setDraggedLayerIndex(null);
    setDragOverIndex(null);
  };

  // Animation overlay drag handlers
  const handleAnimationDragStart = (e, index) => {
    setDraggedAnimationIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleAnimationDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverAnimationIndex(index);
  };

  const handleAnimationDragLeave = () => {
    setDragOverAnimationIndex(null);
  };

  const handleAnimationDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedAnimationIndex !== null && draggedAnimationIndex !== dropIndex) {
      const newAnimationOrder = [...animationOverlays];
      const [draggedItem] = newAnimationOrder.splice(draggedAnimationIndex, 1);
      newAnimationOrder.splice(dropIndex, 0, draggedItem);

      if (onAnimationOverlayReorder) {
        onAnimationOverlayReorder(newAnimationOrder);
      }
    }
    setDraggedAnimationIndex(null);
    setDragOverAnimationIndex(null);
  };

  const handleAnimationDragEnd = () => {
    setDraggedAnimationIndex(null);
    setDragOverAnimationIndex(null);
  };

  // Context menu handlers
  const handleContextMenu = (e, targetId, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetId,
      type,
    });
  };

  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, targetId: null, type: null });
  };

  const handleContextMenuAction = (action) => {
    const { targetId, type } = contextMenu;

    if (action === "remove") {
      if (type === "animation" && onAnimationOverlayRemove) {
        onAnimationOverlayRemove(targetId);
      }

      if (type === "media" && onLayerRemove) {
        onLayerRemove(targetId);
      }

      if (type === "effect" && onEffectRemove) {
        onEffectRemove(targetId);
      }
    }

    hideContextMenu();
  };

  return (
    <div
      className={`bg-[#121018] rounded-lg ${
        isMobile ? "w-full h-full p-4" : "w-72 p-4 my-2"
      }`}
    >
      {/* Header - Only show on desktop or when mobile needs it */}
      {!isMobile && (
        <h1 className="text-white text-xl font-bold mb-4">Cinemaglow</h1>
      )}

      {/* Tab Toggle */}
      <div className="flex mb-4">
        <div className="flex bg-[#8088e2] rounded-2xl overflow-hidden p-1 w-full">
          <button
            className={`flex-1 py-2 text-xs font-medium transition-colors rounded-2xl ${
              activeTab === "Layer"
                ? "bg-[#fff] text-black"
                : "text-[#ffffff] hover:text-white"
            }`}
            onClick={() => onTabChange("Layer")}
          >
            Layer {totalLayerCount > 0 && `(${totalLayerCount})`}
          </button>
          <button
            className={`flex-1 py-2 text-xs font-medium transition-colors rounded-2xl ${
              activeTab === "Upload"
                ? "bg-[#fff] text-black"
                : "text-[#ffffff] hover:text-white"
            }`}
            onClick={() => onTabChange("Upload")}
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
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center ${
              isMobile ? "h-[22rem]" : "h-[33rem]"
            } flex flex-col justify-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-[#8088e2] bg-[#1a1a2e] scale-105"
                : "border-white hover:border-[#8088e2] hover:bg-[#1a1a2e]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <div className="flex items-center justify-center space-x-6 rounded-xl bg-[#100f17] p-1 mb-4">
              <img src={DocImage} alt="" />
              <img src={GifImage} alt="" />
              <img src={PlayImage} alt="" />
            </div>

            <p className="text-white text-xs mb-2">
              {isDragOver
                ? "Drop your media here!"
                : isMobile
                ? "Tap to Upload Media From Your Device"
                : "Drag & Drop Media From Your Device To Import"}
            </p>

            <p className="text-white text-xs opacity-80">JPG GIF Video</p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.gif"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        /* Layer Content */
        <div
          className={`max-w-full bg-[#17151d] rounded-xl p-2 ${
            isMobile ? "h-96" : "h-[38rem]"
          }`}
        >
          <div className="text-white text-xs opacity-70 mb-3 px-2">
            {isMobile
              ? "Tap to select • Long press to reorder"
              : "💡 Drag layers to reorder them. Higher numbers appear on top."}
          </div>
          <div className="space-y-3 overflow-y-auto max-h-full">
            {/* Animation Overlay Layers */}
            {animationOverlays && animationOverlays.length > 0 && (
              <>
                <div className="text-white text-xs opacity-50 mb-2 px-2 border-b border-gray-600 pb-1">
                  Animation Overlays ({animationOverlays.length})
                </div>
                {animationOverlays.map((overlay, index) => (
                  <div
                    key={`animation-${overlay.id}`}
                    className={`flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer bg-[#2a1b23] hover:bg-[#322128] ${
                      draggedAnimationIndex === index
                        ? "opacity-50 scale-95"
                        : ""
                    } ${
                      dragOverAnimationIndex === index &&
                      draggedAnimationIndex !== null &&
                      draggedAnimationIndex !== index
                        ? "border-2 border-[#8088e2] bg-[#3a2830]"
                        : ""
                    }`}
                    onClick={() =>
                      onAnimationOverlaySelect &&
                      onAnimationOverlaySelect(overlay.id)
                    }
                    onContextMenu={(e) =>
                      handleContextMenu(e, overlay.id, "animation")
                    }
                    {...(!isMobile && {
                      draggable: true,
                      onDragStart: (e) => handleAnimationDragStart(e, index),
                      onDragOver: (e) => handleAnimationDragOver(e, index),
                      onDragLeave: handleAnimationDragLeave,
                      onDrop: (e) => handleAnimationDrop(e, index),
                      onDragEnd: handleAnimationDragEnd,
                    })}
                  >
                    {/* Drag Handle - Only show on desktop */}
                    {!isMobile && (
                      <div className="flex flex-col mr-3 ms-1 cursor-move">
                        <img
                          src={Dots}
                          alt="Drag to reorder"
                          className="opacity-60 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}

                    {/* Animation Thumbnail */}
                    <div
                      className={`${
                        isMobile ? "w-12 h-12" : "w-10 h-12"
                      } bg-purple-400 rounded mr-3 flex-shrink-0 overflow-hidden`}
                    >
                      <img
                        src={overlay.gifUrl || overlay.url}
                        alt={overlay.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Animation Name */}
                    <span
                      className={`text-white font-medium flex-1 ${
                        isMobile ? "text-sm" : "text-sm"
                      }`}
                    >
                      {overlay.name || "Animation Overlay"}
                    </span>

                    {/* Layer Number (Z-Index) */}
                    <div className="w-6 h-6 bg-[#8088e2] rounded-full flex items-center justify-center ml-2">
                      <span className="text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-white text-xs opacity-50 mb-2 px-2 border-b border-gray-600 pb-1">
                  Media Layers ({mediaCount})
                </div>
              </>
            )}

            {/* Media Layers */}
            {uploadedMedia && uploadedMedia.length > 0
              ? uploadedMedia.map((media, index) => (
                  <React.Fragment key={media?.id ?? index}>
                    <div
                      className={`flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        onMediaSelect &&
                        uploadedMedia &&
                        uploadedMedia.length > 0 &&
                        index === 0
                          ? "bg-[#8088e2]"
                          : "bg-[#1d1b23] hover:bg-[#222128]"
                      } ${
                        draggedLayerIndex === index ? "opacity-50 scale-95" : ""
                      } ${
                        dragOverIndex === index &&
                        draggedLayerIndex !== null &&
                        draggedLayerIndex !== index
                          ? "border-2 border-[#8088e2] bg-[#2a2830]"
                          : ""
                      }`}
                      onClick={() => onMediaSelect && onMediaSelect(index)}
                      onContextMenu={(e) => handleContextMenu(e, index, "media")}
                      {...(!isMobile && {
                        draggable: true,
                        onDragStart: (e) => handleLayerDragStart(e, index),
                        onDragOver: (e) => handleLayerDragOver(e, index),
                        onDragLeave: handleLayerDragLeave,
                        onDrop: (e) => handleLayerDrop(e, index),
                        onDragEnd: handleLayerDragEnd,
                      })}
                    >
                      {/* Drag Handle - Only show on desktop */}
                      {!isMobile && (
                        <div className="flex flex-col mr-3 ms-1 cursor-move">
                          <img
                            src={Dots}
                            alt="Drag to reorder"
                            className="opacity-60 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div
                        className={`${
                          isMobile ? "w-12 h-12" : "w-10 h-12"
                        } bg-orange-400 rounded mr-3 flex-shrink-0 overflow-hidden`}
                      >
                        {media &&
                        media.type &&
                        media.type.startsWith("image/") ? (
                          <img
                            src={media.preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : media &&
                          media.type &&
                          media.type.startsWith("video/") ? (
                          <div className="w-full h-full bg-[#8088e2] flex items-center justify-center">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-[#8088e2] flex items-center justify-center">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Layer Name */}
                      <span
                        className={`text-white font-medium flex-1 ${
                          isMobile ? "text-sm" : "text-sm"
                        }`}
                      >
                        {media && media.name
                          ? isMobile && media.name.length > 15
                            ? media.name.substring(0, 15) + "..."
                            : media.name
                          : "Unknown Media"}
                      </span>

                      {/* Layer Number (Z-Index) */}
                      <div className="w-6 h-6 bg-[#8088e2] rounded-full flex items-center justify-center ml-2">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {media?.appliedEffect ? (
                      <div
                        className={`flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer mt-1 ${
                          isMobile ? "ml-6" : "ml-8"
                        } bg-[#15131d] hover:bg-[#1d1b23] border border-transparent hover:border-[#8088e2]/60`}
                        onClick={() => onMediaSelect && onMediaSelect(index)}
                        onContextMenu={(e) => handleContextMenu(e, index, "effect")}
                      >
                        <div
                          className={`${
                            isMobile ? "w-10 h-10" : "w-9 h-9"
                          } rounded-lg overflow-hidden mr-3 bg-[#1f1b2a] flex-shrink-0`}
                        >
                          <img
                            src={media.appliedEffect}
                            alt={`Effect on ${media?.name || `Layer ${index + 1}`}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-[#8088e2] text-xs font-semibold uppercase tracking-wide">
                            Effect
                          </span>
                          <span className="text-white text-xs truncate">
                            {media?.name ? `on ${media.name}` : `Layer ${index + 1}`}
                          </span>
                        </div>
                        <Image className="w-4 h-4 text-[#8088e2]" />
                      </div>
                    ) : null}
                  </React.Fragment>
                ))
              : layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center p-2 bg-[#1d1b23] rounded-xl hover:bg-[#222128] transition-colors cursor-pointer"
                  >
                    {/* Drag Handle - Only show on desktop */}
                    {!isMobile && (
                      <div className="flex flex-col mr-3 ms-1">
                        <img src={Dots} alt="" />
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div
                      className={`${
                        isMobile ? "w-12 h-12" : "w-10 h-12"
                      } bg-orange-400 rounded mr-3 flex-shrink-0 overflow-hidden`}
                    >
                      <img
                        src="https://images.pexels.com/photos/23897250/pexels-photo-23897250.jpeg?_gl=1*1msubz2*_ga*OTc3NzE2NDMwLjE3NTQzMjc5MTY.*_ga_8JE65Q40S6*czE3NTUyODkxNjkkbzIkZzEkdDE3NTUyODkxOTgkajMxJGwwJGgw"
                        alt=""
                      />
                    </div>

                    {/* Layer Name */}
                    <span
                      className={`text-white font-medium ${
                        isMobile ? "text-sm" : "text-sm"
                      }`}
                    >
                      {isMobile && layer.name.length > 15
                        ? layer.name.substring(0, 15) + "..."
                        : layer.name}
                    </span>

                    {/* Layer Number (Z-Index) */}
                    <div className="w-6 h-6 bg-[#8088e2] rounded-full flex items-center justify-center ml-2">
                      <span className="text-white text-xs font-bold">
                        {layer.id}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white rounded-sm shadow-lg border border-gray-200 py-1 min-w-[120px] z-[9999]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onMouseLeave={hideContextMenu}
        >
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => handleContextMenuAction("remove")}
          >
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SecondSidebar;
