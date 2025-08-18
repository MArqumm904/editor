import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import img from "../assets/images/1.png";
import leave1 from "../assets/images/leave1.png";
import leave2 from "../assets/images/leave2.png";
import leave3 from "../assets/images/leave3.png";
import leave4 from "../assets/images/leave4.png";
import { useNavigate } from "react-router-dom";

const HERO = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const playButtonVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-darkbg relative overflow-hidden flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated floating elements - decorative shapes */}
      <motion.div 
        className="absolute z-0 pointer-events-none top-8 left-5 w-14 h-14 opacity-70 md:top-8 md:left-[200px] md:w-20 md:h-24"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "0s" }}
      >
        <img
          src={leave1}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div 
        className="absolute z-0 pointer-events-none top-10 right-5 w-10 h-10 opacity-70 md:top-10 md:right-[215px] md:w-16 md:h-12"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
      >
        <img
          src={leave2}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Main content container */}
      <motion.div 
        className="text-center -mt-12 sm:mt-10 md:mt-12 z-10 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-screen"
        variants={itemVariants}
      >
        {/* Heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2"
          variants={itemVariants}
        >
          Bring Your Photos To Life
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2"
          variants={itemVariants}
        >
          Animate your images with magical motion in just seconds.
        </motion.p>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 md:mb-20 px-4"
          variants={itemVariants}
        >
          <motion.button
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#8088E2] text-white font-semibold text-base sm:text-lg rounded-2xl hover:bg-[#6B73D1] transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/create")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Create Now
          </motion.button>
          <motion.button 
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold text-base sm:text-lg rounded-2xl hover:border-[#8088E2] hover:text-[#8088E2] transition-all duration-300" 
            onClick={() => navigate("/gallery")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Explore Gallery
          </motion.button>
        </motion.div>

        {/* Video showcase container */}
        <motion.div 
          className="relative w-[95vw] sm:w-[90vw] max-w-[900px] mx-auto pt-2 sm:pt-3 md:pt-5 px-2"
          variants={itemVariants}
        >
          {/* Rounded container with gradient border */}
          <motion.div 
            className="relative p-1.5 sm:p-2 bg-gradient-to-b from-[#8087e1] via-[#8087e1] to-[#0d0b13] rounded-[20px] sm:rounded-[24px] md:rounded-[28px] shadow-2xl"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <div className="bg-black rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden relative">
              {/* Video/Image container */}
              <div
                className="relative"
                style={{
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  width: "100%",
                }}
              >
                {/* Image */}
                <motion.img
                  src={img}
                  alt="Animated landscape preview"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-[16px] sm:rounded-[20px] md:rounded-[24px]"
                  variants={imageVariants}
                />

                {/* Play button overlay */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <motion.button
                    onClick={handlePlayClick}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#8088E2] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#8088E2]"
                    variants={playButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <AnimatePresence mode="wait">
                      {isPlaying ? (
                        <motion.div
                          key="pause"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Pause className="w-6 h-6 sm:w-8 sm:w-8 md:w-10 md:h-10 text-white ml-0.5 sm:ml-1" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="play"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Play className="w-6 h-6 sm:w-8 sm:w-8 md:w-10 md:h-10 text-white ml-0.5 sm:ml-1" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                {/* Video element (hidden initially) */}
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-[16px] sm:rounded-[20px] md:rounded-[24px] hidden"
                  src=""
                  controls={false}
                  muted
                  loop
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional floating decorative elements */}
      <motion.div 
        className="absolute z-0 pointer-events-none top-[200px] left-16 w-9 h-9 opacity-60 md:top-[250px] md:left-[310px] md:w-10 md:h-10"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <img
          src={leave3}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div 
        className="absolute top-[200px] right-12 w-10 h-10 opacity-60 pointer-events-none z-0 md:top-[250px] md:right-[295px] md:w-16 md:h-16"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "3s" }}
      >
        <img
          src={leave4}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default HERO;