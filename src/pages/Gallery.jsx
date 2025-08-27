import { motion, useInView } from "framer-motion";
import { useRef,useEffect } from "react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import GalleryGrid from "../components/GalleryGrid"
import Topbar from "../components/Topbar"

const Gallery = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

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

  return (
    <div className="min-h-screen bg-darkbg">
      <Navbar />
      <Topbar />
      <motion.main 
        className="container mx-auto px-4 py-8 mb-48"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1 
          ref={titleRef}
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-16"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          Art Gallery
        </motion.h1>
        
        <GalleryGrid />
      </motion.main>
      <Footer />
    </div>
  )
}

export default Gallery
