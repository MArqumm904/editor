import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ppf from "../assets/images/image.png";
import DollarImage from "../assets/images/dollar.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Donors = () => {
  const donors = [
    { id: 1, name: "John Doe", amount: "$100" },
    { id: 2, name: "Jane Smith", amount: "$250" },
    { id: 3, name: "Mike Johnson", amount: "$150" },
    { id: 4, name: "Sarah Wilson", amount: "$300" },
    { id: 5, name: "David Brown", amount: "$200" },
    { id: 6, name: "Lisa Davis", amount: "$180" },
    { id: 7, name: "Tom Miller", amount: "$220" },
    { id: 8, name: "Amy Taylor", amount: "$190" },
    { id: 9, name: "Chris Lee", amount: "$280" },
    { id: 10, name: "Emma White", amount: "$160" },
    { id: 11, name: "Ryan Clark", amount: "$240" },
    { id: 12, name: "Sophie Hall", amount: "$210" },
    { id: 13, name: "Alex Green", amount: "$170" },
    { id: 14, name: "Maya Patel", amount: "$260" },
    { id: 15, name: "Jake Adams", amount: "$140" },
    { id: 16, name: "Zoe Cooper", amount: "$320" },
  ];

  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Scroll animations
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const isCarouselInView = useInView(carouselRef, { once: true, margin: "-50px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const carouselVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.8,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.15,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const dotVariants = {
    hover: {
      scale: 1.4,
      backgroundColor: "#8088e2",
      transition: {
        duration: 0.2,
      },
    },
    active: {
      scale: 1.3,
      backgroundColor: "#8088e2",
    },
  };

  const computeItemsPerPage = () => {
    if (typeof window === "undefined") return 1;
    if (window.matchMedia("(min-width: 1024px)").matches) return 4;
    if (window.matchMedia("(min-width: 768px)").matches) return 2;
    return 1;
  };

  useEffect(() => {
    const update = () => {
      setItemsPerPage(computeItemsPerPage());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < donors.length; i += itemsPerPage) {
      result.push(donors.slice(i, i + itemsPerPage));
    }
    return result;
  }, [donors, itemsPerPage]);

  useEffect(() => {
    if (currentPage > pages.length - 1) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <motion.div 
      className="bg-darkbg flex items-center justify-center p-4 md:p-8 pt-12 md:pt-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl w-full">
        {/* Title */}
        <motion.h1 
          ref={titleRef}
          className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          Our Amazing Donors
        </motion.h1>

        {/* Carousel */}
        <motion.div 
          ref={carouselRef}
          className="relative"
          variants={carouselVariants}
          initial="hidden"
          animate={isCarouselInView ? "visible" : "hidden"}
        >
          {/* Track Container */}
          <div ref={containerRef} className="overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex"
              animate={{
                x: `-${currentPage * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              drag="x"
              dragConstraints={{
                left: -(pages.length - 1) * (containerRef.current?.offsetWidth || 0),
                right: 0,
              }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragEnd={(event, info) => {
                const threshold = 100; // Minimum drag distance to trigger page change
                
                // If drag distance is significant enough, change page
                if (info.offset.x < -threshold) {
                  // Swipe left - go to next page
                  goNext();
                } else if (info.offset.x > threshold) {
                  // Swipe right - go to previous page
                  goPrev();
                }
              }}
            >
              {pages.map((group, pageIndex) => (
                <div key={pageIndex} className="w-full shrink-0 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 md:mb-12">
                    {group.map((donor, index) => (
                      <motion.div
                        key={donor.id}
                        className="relative bg-gradient-to-b from-[#8088E2] to-[#0D0B13] rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center text-center shadow-lg border-2 border-[#8088e2] overflow-hidden"
                        variants={cardVariants}
                        initial="hidden"
                        animate={isCarouselInView ? "visible" : "hidden"}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          // scale: 1.05,
                          // y: -10,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative z-10 flex flex-col items-center">
                          <motion.div 
                            className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mb-2 flex items-center justify-center"
                            whileHover={{
                              scale: 1.08,
                              rotate: [0, -5, 5, 0],
                              transition: { duration: 0.3 }
                            }}
                          >
                            <img
                              src={ppf}
                              alt={donor.name}
                              className="w-full h-full object-cover bg-gray-300 rounded-full"
                              draggable={false}
                            />
                          </motion.div>

                          {/* Name */}
                          <motion.h3 
                            className="text-white text-xl sm:text-2xl font-semibold mb-3"
                            whileHover={{
                              color: "#8088E2",
                              scale: 1.05,
                              transition: { duration: 0.2 }
                            }}
                          >
                            {donor.name}
                          </motion.h3>

                          {/* Amount with dollar image */}
                          <motion.div 
                            className="flex items-center space-x-2"
                            whileHover={{
                              scale: 1.15,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <motion.img
                              src={DollarImage}
                              alt="dollar"
                              className="w-7 h-7"
                              draggable={false}
                              whileHover={{
                                rotate: [0, 15, -15, 0],
                                transition: { duration: 0.4 }
                              }}
                            />
                            <span className="text-white text-lg sm:text-xl font-medium">
                              {donor.amount}
                            </span>
                          </motion.div>
                        </div>

                        {/* Bottom gradient overlay */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-2 py-2 rounded-full backdrop-blur disabled:opacity-40 disabled:cursor-not-allowed z-10"
            aria-label="Previous"
            variants={buttonVariants}
            whileHover={currentPage > 0 ? "hover" : {}}
            whileTap={currentPage > 0 ? "tap" : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ArrowLeft size={18} />
          </motion.button>
          
          <motion.button
            onClick={goNext}
            disabled={currentPage === pages.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-2 py-2 rounded-full backdrop-blur disabled:opacity-40 disabled:cursor-not-allowed z-10"
            aria-label="Next"
            variants={buttonVariants}
            whileHover={currentPage < pages.length - 1 ? "hover" : {}}
            whileTap={currentPage < pages.length - 1 ? "tap" : {}}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Pagination Dots */}
        <motion.div 
          className="flex justify-center space-x-2 mt-3 md:mt-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {pages.map((_, i) => (
            <motion.button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentPage ? "bg-[#8088e2]" : "bg-gray-600"
              }`}
              variants={dotVariants}
              whileHover="hover"
              animate={i === currentPage ? "active" : ""}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Donors;