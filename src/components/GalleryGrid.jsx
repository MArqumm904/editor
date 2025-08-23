import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import img1 from "../assets/images/gallery/1.png";
import img2 from "../assets/images/gallery/2.png";
import img3 from "../assets/images/gallery/3.png";
import img4 from "../assets/images/gallery/4.png";
import img5 from "../assets/images/gallery/5.png";
import img6 from "../assets/images/gallery/6.jpg";
import img7 from "../assets/images/gallery/7.png";

const GalleryGrid = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const galleryItems = [
    {
      id: 1,
      src: img1,
      artist: "Nicholas Turner",
      title: "Abstract Waves",
      height: "h-80",
    },
    {
      id: 2,
      src: img3,
      artist: "Patty Stone",
      title: "Cave Explorer",
      height: "h-60",
    },
    {
      id: 3,
      src: img5,
      artist: "Neal Wilson",
      title: "Vibrant Portrait",
      height: "h-52",
    },
    {
      id: 4,
      src: img2,
      artist: "Nicholas Turner",
      title: "Steampunk Device",
      height: "h-72",
    },
    {
      id: 5,
      src: img5,
      artist: "Neal Wilson",
      title: "Vibrant Portrait 2",
      height: "h-52",
    },
    {
      id: 6,
      src: img6,
      artist: "Nicholas Turner",
      title: "Starry Night Scene",
      height: "h-96",
    },
    {
      id: 7,
      src: img4,
      artist: img6,
      title: "Cute Monster",
      height: "h-60",
    },
    {
      id: 8,
      src: img6,
      artist: "Arlene McCoy",
      title: "Golden Orb",
      height: "h-80",
    },
    {
      id: 9,
      src: img7,
      artist: "Robert Fox",
      title: "Cosmic Spiral",
      height: "h-72",
    },
    {
      id: 10,
      src: img1,
      artist: "Robert Fox",
      title: "Golden Landscape",
      height: "h-60",
    },
    {
      id: 11,
      src: img7,
      artist: "Nicholas Turner",
      title: "Artist Palette",
      height: "h-72",
    },
    {
      id: 12,
      src: img5,
      artist: "Nicholas Turner",
      title: "Alien World",
      height: "h-60",
    },
    {
      id: 13,
      src: img2,
      artist: "Nicholas Turner",
      title: "Sky Castle",
      height: "h-52",
    },
    {
      id: 14,
      src: img5,
      artist: "Nicholas Turner",
      title: "Alien Landscape",
      height: "h-60",
    },
  ];

  const handleImageClick = (imageId) => {
    navigate(`/gallery/${imageId}`);
  };

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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const artistInfoVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div 
      ref={containerRef}
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {galleryItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="break-inside-avoid mb-4 group cursor-pointer"
          onClick={() => handleImageClick(item.id)}
          variants={itemVariants}
          custom={index}
          whileHover="hover"
          whileTap="tap"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div 
            className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            variants={cardHoverVariants}
          >
            <motion.img
              src={item.src || "/placeholder.svg"}
              alt={item.title}
              className={`w-full object-cover ${item.height}`}
              variants={imageHoverVariants}
              draggable={false}
            />

            {/* Artist Info Overlay */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
              variants={artistInfoVariants}
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#8088e2",
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-xs text-white font-semibold">
                    {item.artist.charAt(0)}
                  </span>
                </motion.div>
                <motion.span 
                  className="text-white text-sm font-medium"
                  whileHover={{
                    color: "#8088e2",
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  {item.artist}
                </motion.span>
              </div>
            </motion.div>

            {/* Hover Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-[#8088e2]/20 via-transparent to-transparent opacity-0"
              variants={overlayVariants}
            />

            {/* Glow effect on hover */}
            <motion.div 
              className="absolute inset-0 rounded-2xl opacity-0"
              whileHover={{
                opacity: 1,
                boxShadow: "0 0 30px rgba(128, 136, 226, 0.3)",
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GalleryGrid;
