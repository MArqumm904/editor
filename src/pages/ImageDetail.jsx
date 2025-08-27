"use client"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef,useEffect } from "react"

// Local image imports
import img1 from "../assets/images/gallery/1.png"
import img2 from "../assets/images/gallery/2.png"
import img3 from "../assets/images/gallery/3.png"
import img4 from "../assets/images/gallery/4.png"
import img5 from "../assets/images/gallery/5.png"
import img6 from "../assets/images/gallery/6.jpg"
import img7 from "../assets/images/gallery/7.png"

const ImageDetail = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Gallery items using imported images
  const galleryItems = [
    { id: 1, src: img1, artist: "Nicholas Turner", title: "Blue image glow background use wallpaper", height: "h-80" },
    { id: 2, src: img2, artist: "Patty Stone", title: "Cave Explorer", height: "h-60" },
    { id: 3, src: img3, artist: "Neal Wilson", title: "Vibrant Portrait", height: "h-52" },
    { id: 4, src: img4, artist: "Nicholas Turner", title: "Steampunk Device", height: "h-72" },
    { id: 5, src: img5, artist: "Neal Wilson", title: "Vibrant Portrait 2", height: "h-52" },
    { id: 6, src: img6, artist: "Arlene McCoy", title: "Golden Orb", height: "h-80" },
    { id: 7, src: img7, artist: "Robert Fox", title: "Cosmic Spiral", height: "h-72" },
    { id: 8, src: img1, artist: "Nicholas Turner", title: "Abstract Waves", height: "h-60" },
  ]

  // Featured image
  const featuredImage = galleryItems[0]

  // Sidebar thumbnails
  const sidebarImages = [
    { id: 1, src: img4, artist: "Nicholas Turner" },
    { id: 2, src: img3, artist: "Neal Wilson" },
    { id: 3, src: img6, artist: "Arlene McCoy" },
    { id: 4, src: img7, artist: "Robert Fox" },
    { id: 5, src: img4, artist: "Nicholas Turner" },
    { id: 6, src: img3, artist: "Neal Wilson" },
  ]

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
      y: -30,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const mainContentVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
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

  const imageVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const sidebarItemVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const bottomGridVariants = {
    hidden: { opacity: 0, y: 60 },
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

  const gridItemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Header */}
      <motion.div 
        className="pt-6 pb-8 ml-0 sm:ml-12 lg:ml-24"
        variants={titleVariants}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Cinemaglow</h1>
          
          {/* Back Button - Mobile/Tablet */}
          <motion.button
            className="lg:hidden w-10 h-10 bg-darkbg border border-white rounded-lg flex items-center justify-center hover:bg-darkbg transition-colors"
            onClick={() => navigate(-1)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 sm:gap-6"
        variants={mainContentVariants}
      >
        {/* Featured Image + Back Button */}
        <div className="flex-1 flex flex-col sm:flex-row items-start gap-4">
          {/* Back Button - Desktop Only */}
          <motion.button
            className="hidden lg:flex w-20 h-10 bg-darkbg border border-white rounded-lg items-center justify-center hover:bg-darkbg transition-colors flex-shrink-0"
            onClick={() => navigate(-1)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          {/* Image and Info Container */}
          <div className="flex-1 w-full">
            <motion.div 
              className="bg-gray-800 rounded-2xl overflow-hidden"
              variants={imageVariants}
              whileHover="hover"
            >
              <img
                src={featuredImage.src || "/placeholder.svg"}
                alt={featuredImage.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </motion.div>

            {/* Featured Image Info Below */}
            <motion.div 
              className="mt-3"
              variants={mainContentVariants}
            >
              <h2 className="text-base sm:text-lg font-medium mb-2 text-white">{featuredImage.title}</h2>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#8088e2",
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-xs sm:text-sm text-white font-semibold">{featuredImage.artist.charAt(0)}</span>
                </motion.div>
                <span className="text-white text-sm font-medium">{featuredImage.artist}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar Thumbnails */}
        <motion.div 
          className="w-full lg:w-80"
          variants={mainContentVariants}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4">
            {sidebarImages.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="group cursor-pointer"
                variants={sidebarItemVariants}
                custom={index}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <img 
                    src={item.src || "/placeholder.svg"} 
                    alt="Thumbnail" 
                    className="w-full h-24 sm:h-32 object-cover" 
                  />
                </motion.div>
                {/* Artist Info Below Thumbnail */}
                <div className="mt-2 flex items-center gap-2">
                  <motion.div 
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center"
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "#8088e2",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="text-xs text-white font-semibold">{item.artist.charAt(0)}</span>
                  </motion.div>
                  <span className="text-white text-xs font-medium truncate">{item.artist}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Gallery Grid */}
      <motion.div 
        className="mt-8 sm:mt-12"
        variants={bottomGridVariants}
      >
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 sm:space-y-6">
          {galleryItems.map((item, index) => (
            <motion.div 
              key={`bottom-${item.id}`} 
              className="break-inside-avoid group cursor-pointer"
              variants={gridItemVariants}
              custom={index}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                variants={imageVariants}
                whileHover="hover"
              >
                <img
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  className={`w-full object-cover ${item.height}`}
                />
              </motion.div>
              {/* Artist Info Below Each Image */}
              <div className="mt-3 flex items-center gap-2">
                <motion.div 
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#8088e2",
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-xs text-white font-semibold">{item.artist.charAt(0)}</span>
                </motion.div>
                <span className="text-white text-xs sm:text-sm font-medium">{item.artist}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImageDetail