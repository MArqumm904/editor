// src/components/EditorComponents/RightPanel.jsx
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import PlayImage from "../../assets/images/play.png";

const RightPanel = () => {
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const toggleAnimation = () => setIsAnimationOpen(!isAnimationOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleExport = () => setIsExportOpen(!isExportOpen);

  // Animation overlay data
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

  // Categories data with icons and items
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

  // Export data
  const exportItems = ["PNG", "JPG", "SVG"];

  // Render animation grid items
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

  // Render category tabs
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
              tabsContainer.scrollLeft -= 120; // Scroll left by 120px
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
              tabsContainer.scrollLeft += 120; // Scroll right by 120px
            }
          }}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Render category items grid
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

  // Render list items
  const renderListItems = (items) => {
    return (
      <div className="space-y-2 pt-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-[#2a2635] p-2 rounded-lg cursor-pointer hover:bg-[#3a3645] transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <span className="text-[#fff] text-[0.750rem]">{item}</span>
          </div>
        ))}
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
        {/* Animation Overlay Section */}
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

        {/* Categories Section */}
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

        {/* Export Section */}
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
              isExportOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {renderListItems(exportItems)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
