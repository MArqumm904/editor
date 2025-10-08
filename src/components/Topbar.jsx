import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Images");
  const filterTabs = ["Images", "GIFs", "Videos"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const searchVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#8088e2",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const searchBarVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.nav
      className="bg-darkbg border-gray-800 px-4 sm:px-6 py-3 sm:py-4 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between max-w-[92rem] mx-auto">
        {/* Filter Tags - Desktop */}
        <motion.div
          className="hidden lg:flex items-center gap-3"
          variants={containerVariants}
        >
          {filterTabs.map((tag, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(tag)}
              className={
                activeTab === tag
                  ? "px-5 py-3 bg-[#8088E2] text-white text-sm rounded-full transition-colors"
                  : "px-5 py-3 bg-darkbg border-2 border-[#8088E2] text-white text-sm rounded-full transition-colors hover:bg-[#8088E2]"
              }
              variants={tagVariants}
              whileHover="hover"
              whileTap="tap"
              custom={index}
            >
              {tag}
            </motion.button>
          ))}
          <motion.button
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Plus className="w-4 h-4 text-white" />
          </motion.button>
        </motion.div>

        {/* Filter Tags - Mobile */}
        <motion.div
          className="lg:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide"
          variants={containerVariants}
        >
          {filterTabs.map((tag, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(tag)}
              className={
                activeTab === tag
                  ? "px-3 sm:px-4 py-2 bg-[#8088E2] text-white text-xs sm:text-sm rounded-full transition-colors whitespace-nowrap"
                  : "px-3 sm:px-4 py-2 bg-darkbg border-2 border-[#8088E2] text-white text-xs sm:text-sm rounded-full transition-colors hover:bg-[#8088E2] whitespace-nowrap"
              }
              variants={tagVariants}
              whileHover="hover"
              whileTap="tap"
              custom={index}
            >
              {tag}
            </motion.button>
          ))}
          <motion.button
            className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </motion.button>
        </motion.div>

        {/* Search Bar - Desktop */}
        <motion.div
          className="hidden md:block relative"
          variants={searchVariants}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
          <motion.input
            type="text"
            placeholder="Search"
            className="bg-gray-800 border border-white rounded-lg pl-10 pr-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8088E2] focus:border-[#8088E2] w-80"
            whileFocus={{
              scale: 1.02,
              borderColor: "#8088e2",
              transition: { duration: 0.2 },
            }}
          />
        </motion.div>

        {/* Search Button - Mobile */}
        <motion.button
          className="md:hidden w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Search className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            className="md:hidden mt-3 relative"
            variants={searchBarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <motion.input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 border border-white rounded-lg pl-10 pr-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8088E2] focus:border-[#8088E2]"
              autoFocus
              whileFocus={{
                scale: 1.02,
                borderColor: "#8088e2",
                transition: { duration: 0.2 },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Topbar;