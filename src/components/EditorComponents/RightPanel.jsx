// src/components/EditorComponents/RightPanel.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Gif from "../../assets/images/rain_gif.gif";

// Import images for categoryData
import fire1 from "../../assets/images/fire-1.jpg";
import fire2 from "../../assets/images/fire-2.jpg";
import fire3 from "../../assets/images/fire-3.jpg";
import fire4 from "../../assets/images/fire-4.jpg";
import fire5 from "../../assets/images/fire-5.jpg";
import fire6 from "../../assets/images/fire-6.jpg";

import flower1 from "../../assets/images/floral-1.jpg";
import flower2 from "../../assets/images/floral-2.jpg";
import flower3 from "../../assets/images/floral-3.jpg";
import flower4 from "../../assets/images/floral-4.jpg";
import flower5 from "../../assets/images/floral-5.jpg";
import flower6 from "../../assets/images/floral-6.jpg";

import sparkles1 from "../../assets/images/sparkles-1.jpg";
import sparkles2 from "../../assets/images/sparkles-2.jpg";
import sparkles3 from "../../assets/images/sparkles-3.jpg";
import sparkles4 from "../../assets/images/sparkles-4.png";
import sparkles5 from "../../assets/images/sparkles-5.jpg";
import sparkles6 from "../../assets/images/sparkles-6.jpg";

import nature1 from "../../assets/images/nature-1.jpg";
import nature2 from "../../assets/images/nature-2.jpg";
import nature3 from "../../assets/images/nature-3.jpg";
import nature4 from "../../assets/images/nature-4.png";
import nature5 from "../../assets/images/nature-5.png";
import nature6 from "../../assets/images/nature-6.jpg";

import abstract1 from "../../assets/images/abstract-1.jpg";
import abstract2 from "../../assets/images/abstract-2.jpg";
import abstract3 from "../../assets/images/abstract-3.jpg";
import abstract4 from "../../assets/images/abstract-4.jpg";
import abstract5 from "../../assets/images/abstract-5.jpg";
import abstract6 from "../../assets/images/abstract-6.jpg";

const RightPanel = ({ isMobile = false, onEffectSelect, onExport, selectedMediaIndex }) => {
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedAnimationCategory, setSelectedAnimationCategory] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("original");
  const [selectedResolution, setSelectedResolution] = useState("high");
  const [selectedFormat, setSelectedFormat] = useState("video");
  const [duration, setDuration] = useState("10 Seconds");
  const [includeInGallery, setIncludeInGallery] = useState(false);

  useEffect(() => {
    const durationInMs = parseInt(duration.split(' ')[0]) * 1000;
    window.selectedDuration = durationInMs;
  }, [duration]);
  useEffect(() => {
    const handleDurationRequest = () => {
      const durationInMs = parseInt(duration.split(' ')[0]) * 1000;
      window.selectedDuration = durationInMs;
    };

    window.addEventListener('getDuration', handleDurationRequest);
    return () => window.removeEventListener('getDuration', handleDurationRequest);
  }, [duration]);

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

  const animationCategoryData = [
    {
      name: "Weather",
      icon: "🌧",
      items: [
        {
          name: "Rain",
          icon: "🌧",
          gif: Gif,
        },
        {
          name: "Snow",
          icon: "❄",
          gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmk1Y21hMTRzYmo2OHViaHVjMmxqczN5a3pyMm5iZmppNHR0cXVoaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/tIHktzgRi8yjIplFVI/giphy.gif",
        },
      ],
    },
    {
      name: "Nature",
      icon: "🌿",
      items: [
        {
          name: "Trees",
          icon: "🌳",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2QwemsyZ20xeGx1eG5xcmFsdGJlZ3hndjF1bzFteTBjbmJ1dmZ3aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XBbe8ApwcblsY/giphy.gif",
        },
        {
          name: "Flowers",
          icon: "🌸",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjg4N283cHNnaW03N2swb3hlZjhlbG5pdmlvbTJieHd3em9wbndoZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/faxxu56uHap44/giphy.gif",
        },
        {
          name: "Leaves",
          icon: "🍃",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmdiM2p2NXo4YzhyMG44dXczc2F0OTF3eG04aGpwZno4OWNjeTN0ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dBvFwjVAQAt0I/giphy.gif",
        },
        {
          name: "Petals",
          icon: "🌺",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHQ3b3BkdHFmZzlmbWhhbG93aDhnOWh6cXBqbDdseHA1Z3piNHIwcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3ohhwypdTGY1lXbQtO/giphy.gif",
        },
        {
          name: "Plants",
          icon: "🌱",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2tvb3ZzdHk1NDR6d21xdHVqMWttamhhNHRvZTZpbHVkNG5senl1dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/49M1JQPy7RhD2/giphy.gif",
        },
        {
          name: "Birds",
          icon: "🦅",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2g5dXNnMmgwb24xdXJ4Y204dXNoZ2g2ZWhza3J4Y3NiZWRjOTlwMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oriOeBHxdF9FokwJq/giphy.gif",
        },
      ],
    },
    {
      name: "Effects",
      icon: "✨",
      items: [
        {
          name: "Smoke",
          icon: "💨",
          gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHdsdTAzaTcwYXdkMzlnYmp4YnluZW54MDI2a3FtMXdqenFmOTk3ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Kc8s2aGkxak3UsDJeL/giphy.gif",
        },
        {
          name: "Particles",
          icon: "⭐",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazVqMHlwajBxcGVnMXI4dXJ4cWYwbW1odDFheDJvcGp6YmllY2ticSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26BRGoqbUQvk8nwTC/giphy.gif",
        },
        {
          name: "Stars",
          icon: "🌟",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHJicWJ4NmUwbXh3bDFwa3Jib2Z5c2hyejR4Z2h2ZXlqbzhneHV1dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U3qYN8S0j3bpK/giphy.gif",
        },
        {
          name: "Lighting",
          icon: "💡",
          gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd25yaG5qbDY5M2wzc3EzNjZoaWMxZW0yc2d0aDkzYzN6M2FpYmYwbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JDPsfIOg1uL6M/giphy.gif",
        },
      ],
    },
    {
      name: "Objects",
      icon: "🕯",
      items: [
        {
          name: "Candles",
          icon: "🕯",
          gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWFpNGkwNTJ2NmJvdXFxcXljMDh6dnVrbDh6cGx6bHMyc251cHc5MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/euQr1xeeZjX25mNL4T/giphy.gif",
        },
        {
          name: "Asteroid",
          icon: "☄",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWUxYzlwMzY2dHhvNGduNmI4M3JyYm43YnE5Mjh2bmZwaGNhanY0byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/W5g5W5hMkzrJQDpN3P/giphy.gif",
        },
      ],
    },
  ];

  // Use images instead of icons in categoryData
  const categoryData = [
    {
      name: "Fire",
      icon: fire1,
      items: [
        { icon: fire1, name: "Flame 1" },
        { icon: fire2, name: "Flame 2" },
        { icon: fire3, name: "Flame 3" },
        { icon: fire4, name: "Flame 4" },
        { icon: fire5, name: "Flame 5" },
        { icon: fire6, name: "Flame 6" },
      ],
    },
    {
      name: "Floral",
      icon: flower1,
      items: [
        { icon: flower1, name: "Flower 1" },
        { icon: flower2, name: "Flower 2" },
        { icon: flower3, name: "Flower 3" },
        { icon: flower4, name: "Flower 4" },
        { icon: flower5, name: "Flower 5" },
        { icon: flower6, name: "Flower 6" },
      ],
    },
    {
      name: "Sparkles",
      icon: sparkles1,
      items: [
        { icon: sparkles1, name: "Sparkle 1" },
        { icon: sparkles2, name: "Sparkle 2" },
        { icon: sparkles3, name: "Sparkle 3" },
        { icon: sparkles4, name: "Sparkle 4" },
        { icon: sparkles5, name: "Sparkle 5" },
        { icon: sparkles6, name: "Sparkle 6" },
      ],
    },
    {
      name: "Nature",
      icon: nature1,
      items: [
        { icon: nature1, name: "Leaf 1" },
        { icon: nature2, name: "Leaf 2" },
        { icon: nature3, name: "Leaf 3" },
        { icon: nature4, name: "Leaf 4" },
        { icon: nature5, name: "Leaf 5" },
        { icon: nature6, name: "Leaf 6" },
      ],
    },
    {
      name: "Abstract",
      icon: abstract1,
      items: [
        { icon: abstract1, name: "Abstract 1" },
        { icon: abstract2, name: "Abstract 2" },
        { icon: abstract3, name: "Abstract 3" },
        { icon: abstract4, name: "Abstract 4" },
        { icon: abstract5, name: "Abstract 5" },
        { icon: abstract6, name: "Abstract 6" },
      ],
    },
  ];

  const renderAnimationCategoryTabs = () => {
    return (
      <div
        className={`flex items-center space-x-2 pt-2 mb-4 ${isMobile ? "relative" : ""
          }`}
      >
        {!isMobile && (
          <button
            className="w-6 h-6 rounded-full absolute -ms-1 z-20 bg-[#1b1b23] flex items-center justify-center text-white hover:bg-[#3a3645] transition-all duration-200"
            onClick={() => {
              const tabsContainer = document.getElementById(
                "animation-tabs-container"
              );
              if (tabsContainer) {
                tabsContainer.scrollLeft -= 120;
              }
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          <div
            id="animation-tabs-container"
            className="flex space-x-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {animationCategoryData.map((category, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform whitespace-nowrap flex-shrink-0 ${selectedAnimationCategory === index
                  ? "bg-[#8088e2] text-white"
                  : "bg-[#23232e] hover:bg-[#252530] text-white"
                  }`}
                onClick={() => setSelectedAnimationCategory(index)}
              >
                <span className="text-base">{category.icon}</span>
                <span className="text-[0.750rem] font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!isMobile && (
          <button
            className="w-6 h-6 absolute right-4 rounded-full bg-[#1b1b23] flex items-center justify-center text-white hover:bg-[#3a3645] transition-all duration-200"
            onClick={() => {
              const tabsContainer = document.getElementById(
                "animation-tabs-container"
              );
              if (tabsContainer) {
                tabsContainer.scrollLeft += 120;
              }
            }}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const renderAnimationItems = () => {
    const currentAnimationCategory =
      animationCategoryData[selectedAnimationCategory];
    return (
      <div
        className={`grid gap-2 pt-2 mb-5 ${isMobile ? "grid-cols-2" : "grid-cols-3"
          }`}
      >
        {currentAnimationCategory.items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
            onClick={() => {
              // 🔥 Send effect back to Create.jsx
              if (onEffectSelect) {
                onEffectSelect(item, selectedMediaIndex);
              }
            }}
          >
            <img
              src={item.gif}
              alt={item.name}
              className={`rounded-lg object-cover ${isMobile ? "w-full h-20" : "w-20 h-14"
                }`}
            />
            <div className="text-center mt-1">
              <div className="text-white text-[0.600rem] font-medium">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <div
        className={`flex items-center space-x-1 pt-2 mb-4 ${isMobile ? "relative" : ""
          }`}
      >
        {!isMobile && (
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
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          <div
            id="category-tabs-container"
            className="flex space-x-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {categoryData.map((category, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-300 ease-in-out transform whitespace-nowrap flex-shrink-0 ${selectedCategory === index
                  ? "bg-[#8088e2] text-white"
                  : "bg-[#23232e] hover:bg-[#252530] text-white"
                  }`}
                onClick={() => setSelectedCategory(index)}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6 rounded object-cover"
                />
                <span className="text-[0.850rem] font-medium">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!isMobile && (
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
        )}
      </div>
    );
  };

  // Replace the renderCategoryItems function with this updated version:

  const renderCategoryItems = () => {
    const currentCategory = categoryData[selectedCategory];
    return (
      <div
        className={`grid gap-2 pt-2 ${isMobile ? "grid-cols-2" : "grid-cols-3"
          }`}
      >
        {currentCategory.items.map((item, index) => (
          <div
            key={index}
            className={`bg-[#bcbfe2] rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg border border-gray-200 flex items-center justify-center ${isMobile ? "min-h-[80px]" : "min-h-[60px]"
              }`}
            onClick={() => {
              // 🔥 Send image overlay back to Create.jsx (same as animation overlays)
              if (onEffectSelect) {
                onEffectSelect({
                  name: item.name,
                  gif: item.icon, // Using the image as gif/url for consistency
                  gifUrl: item.icon, // Alternative property name
                  url: item.icon, // Another alternative
                }, selectedMediaIndex);
              }
            }}
          >
            <div className="text-center">
              <div className="mb-1 flex justify-center">
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`${isMobile ? "w-14 h-14" : "w-20 h-16"} rounded object-cover`}
                />
              </div>
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
            className={`${currentRatio.width} ${currentRatio.height
              } bg-gray-300 transition-all duration-300 ease-in-out ${isMobile ? "max-w-full" : ""
              }`}
          ></div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Aspect Ratio</h4>
          <div
            className={`flex gap-0 ${isMobile ? "grid-cols-3" : "flex space-x-4"
              }`}
          >
            {aspectRatios.map((ratio) => (
              <div
                key={ratio.id}
                className="flex flex-col items-center space-y-1"
              >
                <button
                  onClick={() => setSelectedAspectRatio(ratio.id)}
                  className={`transition-all duration-200 ${selectedAspectRatio === ratio.id
                    ? "border-2 border-dashed border-[#8088e2] bg-gray-300"
                    : "border-2 border-white bg-[#1b1b23]"
                    } ${ratio.id === "1:1"
                      ? "w-8 h-7"
                      : ratio.id === "9:16"
                        ? "w-5 h-7"
                        : ratio.id === "4:5"
                          ? "w-6 h-7"
                          : ratio.id === "16:9"
                            ? "w-7 h-5"
                            : "w-7 h-7" // Original
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
          <div className="flex space-x-1 bg-[#20202b] rounded-md p-1">
            {resolutions.map((resolution) => (
              <button
                key={resolution}
                onClick={() => setSelectedResolution(resolution.toLowerCase())}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${selectedResolution === resolution.toLowerCase()
                  ? "bg-[#8088e2] text-white"
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
          <div className="flex space-x-1 bg-[#20202b] rounded-md p-1">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format.toLowerCase())}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${selectedFormat === format.toLowerCase()
                  ? "bg-[#8088e2] text-white"
                  : "bg-transparent text-white hover:bg-[#2a2635]"
                  }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Setting */}
        {(selectedFormat === "video" || selectedFormat === "gif") && (
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
        )}

        {/* Gallery Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="gallery-checkbox"
            checked={includeInGallery}
            onChange={(e) => setIncludeInGallery(e.target.checked)}
            className="w-6 h-6 accent-[#8088e2] bg-[#2a2635] cursor-pointer border-gray-600 rounded-md"
            style={{ accentColor: "#8088e2" }}
          />
          <label
            htmlFor="gallery-checkbox"
            className="text-white text-sm cursor-pointer"
          >
            Include your Media to the public gallery.
          </label>
        </div>

        {/* Export Button */}
        <button
          className="w-full bg-[#8088e2] text-white py-2.5 px-4 rounded-sm font-medium hover:bg-[#6b73d1] transition-all duration-200"
          onClick={() => {
            if (selectedFormat === "image") {
              // Canvas export karne ke liye parent component ko signal bhejte hain
              if (onExport) {
                onExport("image", {
                  aspectRatio: selectedAspectRatio,
                  resolution: selectedResolution,
                });
              }
            } else if (selectedFormat === "video") {
              // Video export: Dispatch exportCanvas event for video
              window.dispatchEvent(
                new CustomEvent("exportCanvas", { detail: { format: "video" } })
              );
            } else if (selectedFormat === "gif") {
              window.dispatchEvent(
                new CustomEvent("exportCanvas", { detail: { format: "gif" } })
              );
            }
          }}
        >
          Export
        </button>
      </div>
    );
  };

  return (
    <div
      className={`rounded-lg ${isMobile ? "w-full h-full p-4 overflow-y-auto" : "w-60 mx-3 my-2 mt-5"
        }`}
    >
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {isMobile && (
        <h2 className="text-white text-lg font-bold mb-4">Effects & Export</h2>
      )}

      <div className="space-y-3">
        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <button
            className="w-full p-3 flex items-center justify-between cursor-pointer transition-all duration-200 ease-in-out"
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
            className={`px-3 transition-all duration-300 ease-in-out overflow-hidden ${isAnimationOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            {renderAnimationCategoryTabs()}
            <div className="transition-all duration-500 ease-in-out mb-3">
              {renderAnimationItems()}
            </div>
          </div>
        </div>

        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <div
            className={`px-3 transition-all duration-300 ease-in-out overflow-hidden ${isCategoriesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            {renderCategoryTabs()}
            <div className="transition-all duration-500 ease-in-out mb-3">
              {renderCategoryItems()}
            </div>
          </div>
        </div>

        <div className="bg-[#13131b] rounded-2xl overflow-hidden">
          <button
            className="w-full p-3 flex items-center justify-between cursor-pointer transition-all duration-200 ease-in-out"
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
            className={`px-3 transition-all duration-300 ease-in-out overflow-hidden ${isExportOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
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