// src/components/EditorComponents/SecondSidebar.jsx
import React, { useState, useRef } from "react";
import GifImage from "../../assets/images/gif.png";
import DocImage from "../../assets/images/doc.png";
import PlayImage from "../../assets/images/play.png";
import Dots from "../../assets/images/dots.png";
import { ChevronDown, Image, Play, Move } from "lucide-react";

const SecondSidebar = ({ onMediaUpload, uploadedMedia, onMediaSelect, onMediaReorder }) => {
  const [activeTab, setActiveTab] = useState("Upload");
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedLayerIndex, setDraggedLayerIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const fileInputRef = useRef(null);

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
      const mediaFiles = fileArray.filter(file => 
        file && 
        file.type && 
        (file.type.startsWith('image/') || 
         file.type.startsWith('video/') || 
         file.type === 'image/gif')
      );
      
      if (mediaFiles.length > 0) {
        onMediaUpload(mediaFiles);
        setActiveTab("Layer"); // Automatically switch to Layer tab
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

  // Layer drag and drop handlers
  const handleLayerDragStart = (e, index) => {
    setDraggedLayerIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleLayerDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleLayerDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleLayerDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedLayerIndex !== null && draggedLayerIndex !== dropIndex) {
      // Reorder the media array
      const newMediaOrder = [...uploadedMedia];
      const [draggedItem] = newMediaOrder.splice(draggedLayerIndex, 1);
      newMediaOrder.splice(dropIndex, 0, draggedItem);
      
      // Call the reorder function to update parent state
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
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center h-[33rem] flex flex-col justify-center cursor-pointer transition-all duration-200 ${
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
                : "Drag & Drop Media From Your Device To Import"
              }
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
        <div className="max-w-full bg-[#17151d] rounded-xl p-2 h-[38rem]">
          <div className="text-white text-xs opacity-70 mb-3 px-2">
            💡 Drag layers to reorder them. Higher numbers appear on top.
          </div>
          <div className="space-y-3">
            {uploadedMedia && uploadedMedia.length > 0 ? (
              uploadedMedia.map((media, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    onMediaSelect && uploadedMedia && uploadedMedia.length > 0 && index === 0
                      ? "bg-[#8088e2] border-2 border-white"
                      : "bg-[#1d1b23] hover:bg-[#222128]"
                  } ${draggedLayerIndex === index ? 'opacity-50 scale-95' : ''} ${
                    dragOverIndex === index && draggedLayerIndex !== null && draggedLayerIndex !== index
                      ? 'border-2 border-[#8088e2] bg-[#2a2830]' : ''
                  }`}
                  onClick={() => onMediaSelect(index)}
                  draggable
                  onDragStart={(e) => handleLayerDragStart(e, index)}
                  onDragOver={(e) => handleLayerDragOver(e, index)}
                  onDragLeave={handleLayerDragLeave}
                  onDrop={(e) => handleLayerDrop(e, index)}
                  onDragEnd={handleLayerDragEnd}
                >
                  {/* Drag Handle */}
                  <div className="flex flex-col mr-3 ms-1 cursor-move">
                    <img src={Dots} alt="Drag to reorder" className="opacity-60 hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Thumbnail */}
                  <div className="w-10 h-12 bg-orange-400 rounded mr-3 flex-shrink-0 overflow-hidden">
                    {media && media.type && media.type.startsWith('image/') ? (
                      <img
                        src={media.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : media && media.type && media.type.startsWith('video/') ? (
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
                  <span className="text-white text-sm font-medium flex-1">
                    {media && media.name ? media.name : 'Unknown Media'}
                  </span>
                  
                  {/* Layer Number (Z-Index) */}
                  <div className="w-6 h-6 bg-[#8088e2] rounded-full flex items-center justify-center ml-2">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
              ))
            ) : (
              layers.map((layer) => (
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
                  
                  {/* Layer Number (Z-Index) */}
                  <div className="w-6 h-6 bg-[#8088e2] rounded-full flex items-center justify-center ml-2">
                    <span className="text-white text-xs font-bold">{layer.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondSidebar;