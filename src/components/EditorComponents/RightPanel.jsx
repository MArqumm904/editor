import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const RightPanel = () => {
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [selectedAspectRatio, setSelectedAspectRatio] = useState("original");
  const [selectedResolution, setSelectedResolution] = useState("high");
  const [selectedFormat, setSelectedFormat] = useState("video");
  const [duration, setDuration] = useState("10 Seconds");
  const [includeInGallery, setIncludeInGallery] = useState(false);

  const toggleAnimation = () => {
    if (isAnimationOpen) {
      setIsAnimationOpen(false);
    } else {
      setIsAnimationOpen(false);
      setIsCategoriesOpen(false);
      setIsExportOpen(false);
      setIsAnimationOpen(true);
    }
  };

  const toggleCategories = () => {
    if (isCategoriesOpen) {
      setIsCategoriesOpen(false);
    } else {
      setIsAnimationOpen(false);
      setIsCategoriesOpen(false);
      setIsExportOpen(false);
      setIsCategoriesOpen(true);
    }
  };

  const toggleExport = () => {
    if (isExportOpen) {
      setIsExportOpen(false);
    } else {
      setIsAnimationOpen(false);
      setIsCategoriesOpen(false);
      setIsExportOpen(false);
      setIsExportOpen(true);
    }
  };

  const animationItems = [
    {
      icon: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-orange-400 to-yellow-500",
      count: 4,
    },
    {
      icon: "https://images.unsplash.com/photo-1682972085748-cc91aa745468?q=80&w=1241&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-blue-400 to-purple-600",
      count: 2,
    },
    {
      icon: "https://plus.unsplash.com/premium_photo-1744395627443-fbe46009acef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-gray-200 to-gray-400",
      count: 3,
    },
  ];

  const categoryData = [
    {
      name: "Fire",
      icon: "🔥",
      items: [
        { icon: "🔥", name: "Flame 1" },
        { icon: "🔥", name: "Flame 2" },
        { icon: "🔥", name: "Flame 3" },
        { icon: "🔥", name: "Flame 4" },
        { icon: "🔥", name: "Flame 5" },
        { icon: "🔥", name: "Flame 6" },
      ],
    },
    {
      name: "Floral",
      icon: "🌸",
      items: [
        { icon: "🌸", name: "Flower 1" },
        { icon: "🌸", name: "Flower 2" },
        { icon: "🌸", name: "Flower 3" },
        { icon: "🌸", name: "Flower 4" },
        { icon: "🌸", name: "Flower 5" },
        { icon: "🌸", name: "Flower 6" },
      ],
    },
    {
      name: "Sparkles",
      icon: "✨",
      items: [
        { icon: "✨", name: "Sparkle 1" },
        { icon: "✨", name: "Sparkle 2" },
        { icon: "✨", name: "Sparkle 3" },
        { icon: "✨", name: "Sparkle 4" },
        { icon: "✨", name: "Sparkle 5" },
        { icon: "✨", name: "Sparkle 6" },
      ],
    },
    {
      name: "Nature",
      icon: "🌿",
      items: [
        { icon: "🌿", name: "Leaf 1" },
        { icon: "🌿", name: "Leaf 2" },
        { icon: "🌿", name: "Leaf 3" },
        { icon: "🌿", name: "Leaf 4" },
        { icon: "🌿", name: "Leaf 5" },
        { icon: "🌿", name: "Leaf 6" },
      ],
    },
    {
      name: "Abstract",
      icon: "🎨",
      items: [
        { icon: "🎨", name: "Abstract 1" },
        { icon: "🎨", name: "Abstract 2" },
        { icon: "🎨", name: "Abstract 3" },
        { icon: "🎨", name: "Abstract 4" },
        { icon: "🎨", name: "Abstract 5" },
        { icon: "🎨", name: "Abstract 6" },
      ],
    },
    {
      name: "Geometric",
      icon: "🔷",
      items: [
        { icon: "🔷", name: "Shape 1" },
        { icon: "🔷", name: "Shape 2" },
        { icon: "🔷", name: "Shape 3" },
        { icon: "🔷", name: "Shape 4" },
        { icon: "🔷", name: "Shape 5" },
        { icon: "🔷", name: "Shape 6" },
      ],
    },
  ];

  const renderAnimationGrid = () => {
    return (
      <div className="grid grid-cols-3 gap-2 pt-2 mb-5">
        {animationItems.map((item, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {Array.from({ length: item.count }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <img
                  src={item.icon}
                  alt=""
                  className="w-20 h-14 rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <div className="flex items-center space-x-2 pt-2 mb-4">
        <button
          className="w-6 h-6 rounded-full absolute -ms-1 z-20 bg-[#1b1b23] flex items-center justify-center text-white hover:bg-[#3a3645] transition-all duration-200"
          onClick={() => {
            const tabsContainer = document.getElementById(
              "category-tabs-container"
            );
            if (tabsContainer) {
              tabsContainer.scrollLeft -= 120;
            }
          }}
        >
          <ChevronLeft className="w-4 h-4 " />
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            id="category-tabs-container"
            className="flex space-x-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {categoryData.map((category, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === index
                    ? "bg-[#23232e]"
                    : "bg-[#23232e] hover:bg-[#252530]"
                }`}
                onClick={() => setSelectedCategory(index)}
              >
                <span className="text-base">{category.icon}</span>
                <span className="text-[#fff] text-[0.750rem] font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-6 h-6 absolute right-4 rounded-full bg-[#1b1b23] flex items-center justify-center text-white hover:bg-[#3a3645] transition-all duration-200"
          onClick={() => {
            const tabsContainer = document.getElementById(
              "category-tabs-container"
            );
            if (tabsContainer) {
              tabsContainer.scrollLeft += 120;
            }
          }}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderCategoryItems = () => {
    const currentCategory = categoryData[selectedCategory];
    return (
      <div className="grid grid-cols-3 gap-3 pt-2">
        {currentCategory.items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg border border-gray-200 min-h-[60px] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-[#1c1925] text-[0.600rem] font-medium">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExportSection = () => {
    const aspectRatios = [
      { id: "original", label: "Original", width: "w-full", height: "h-24" },
      { id: "1:1", label: "1:1", width: "w-32", height: "h-24" },
      { id: "9:16", label: "9:16", width: "w-20", height: "h-24" },
      { id: "4:5", label: "4:5", width: "w-24", height: "h-24" },
      { id: "16:9", label: "16:9", width: "w-48", height: "h-24" },
    ];

    const resolutions = ["Low", "Medium", "High"];
    const formats = ["Image", "GIF", "Video"];
    const durationOptions = [
      "5 Seconds",
      "10 Seconds",
      "15 Seconds",
      "30 Seconds",
    ];

    const currentRatio = aspectRatios.find(
      (ratio) => ratio.id === selectedAspectRatio
    );

    return (
      <div className="space-y-3 mb-3">
        {/* Preview Area - Changes size based on selected aspect ratio */}
        <div className="flex justify-center">
          <div
            className={`${currentRatio.width} ${currentRatio.height} bg-gray-300 transition-all duration-300 ease-in-out`}
          ></div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Aspect Ratio</h4>
          <div className="flex space-x-4">
            {aspectRatios.map((ratio) => (
              <div
                key={ratio.id}
                className="flex flex-col items-center space-y-1"
              >
                <button
                  onClick={() => setSelectedAspectRatio(ratio.id)}
                  className={`transition-all duration-200 ${
                    selectedAspectRatio === ratio.id
                      ? "border-2 border-dashed border-gray-400 bg-gray-300"
                      : "border-2 border-white bg-[#1b1b23]"
                  } ${
                    ratio.id === "1:1"
                      ? "w-8 h-7"
                      : ratio.id === "9:16"
                      ? "w-5 h-7 "
                      : ratio.id === "4:5"
                      ? "w-6 h-7 "
                      : ratio.id === "16:9"
                      ? "w-7 h-5 "
                      : "w-7 h-7 " // Original
                  }`}
                ></button>
                <span className="text-white text-xs">{ratio.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Settings */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Resolution</h4>
          <div className="flex space-x-1 bg-[#1b1b23] rounded-lg p-1">
            {resolutions.map((resolution) => (
              <button
                key={resolution}
                onClick={() => setSelectedResolution(resolution.toLowerCase())}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedResolution === resolution.toLowerCase()
                    ? "bg-gray-400 text-white"
                    : "bg-transparent text-white hover:bg-[#2a2635]"
                }`}
              >
                {resolution}
              </button>
            ))}
          </div>
        </div>

        {/* Format Settings */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Format</h4>
          <div className="flex space-x-1 bg-[#1b1b23] rounded-lg p-1">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format.toLowerCase())}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedFormat === format.toLowerCase()
                    ? "bg-gray-400 text-white"
                    : "bg-transparent text-white hover:bg-[#2a2635]"
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Setting */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Duration</h4>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#2a2635] text-white text-sm rounded-lg px-3 py-1.5 border-none focus:outline-none focus:ring-2 focus:ring-[#8088e2]"
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Gallery Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="gallery-checkbox"
            checked={includeInGallery}
            onChange={(e) => setIncludeInGallery(e.target.checked)}
            className="w-6 h-6 accent-[#8088e2] bg-[#2a2635] border-gray-600 rounded-md"
            style={{ accentColor: "#8088e2" }}
          />
          <label htmlFor="gallery-checkbox" className="text-white text-sm">
            Include your image to the public gallery.
          </label>
        </div>

        {/* Export Button */}
        <button className="w-full bg-[#8088e2] text-white py-2.5 px-4 rounded-xl font-medium hover:bg-[#6b73d1] transition-all duration-200 ">
          Export
        </button>
      </div>
    );
  };

  return (
    <div className="w-60 rounded-lg mx-3 my-2 mt-5">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="space-y-3">
        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <button
            className="w-full p-3 flex items-center justify-between cursor-pointer  transition-all duration-200 ease-in-out"
            onClick={toggleAnimation}
            type="button"
          >
            <span className="text-[#fff] text-[0.810rem] ms-2 mb-1 font-medium">
              Select Animation Overlay
            </span>
            {isAnimationOpen ? (
              <ChevronDown className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            )}
          </button>

          <div
            className={`px-3  transition-all duration-300 ease-in-out overflow-hidden ${
              isAnimationOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {renderAnimationGrid()}
          </div>
        </div>

        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <button
            className="w-full p-3 flex items-center justify-between cursor-pointer  transition-all duration-200 ease-in-out "
            onClick={toggleCategories}
            type="button"
          >
            <span className="text-[#fff] text-[0.810rem] ms-2 mb-1 font-medium">
              Categories
            </span>
            {isCategoriesOpen ? (
              <ChevronDown className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            )}
          </button>

          <div
            className={`px-3 transition-all duration-300  ease-in-out overflow-hidden ${
              isCategoriesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {renderCategoryTabs()}
            <div className="transition-all duration-500 ease-in-out  mb-3">
              {renderCategoryItems()}
            </div>
          </div>
        </div>

        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <button
            className="w-full p-3 flex items-center justify-between cursor-pointer  transition-all duration-200 ease-in-out"
            onClick={toggleExport}
            type="button"
          >
            <span className="text-[#fff] text-[0.810rem] ms-2 mb-1 font-medium">
              Export
            </span>
            {isExportOpen ? (
              <ChevronDown className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#fff] transition-transform duration-200" />
            )}
          </button>

          <div
            className={`px-3 transition-all duration-300 ease-in-out overflow-hidden ${
              isExportOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {renderExportSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;