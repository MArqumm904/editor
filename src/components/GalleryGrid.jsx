import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const GalleryGrid = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const loadMoreRef = useRef(null);
  
  const [galleryItems, setGalleryItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

  // Fetch gallery data from Laravel API
  const fetchGalleryData = useCallback(async (pageNum) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery?page=${pageNum}`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        setGalleryItems(prev => [...prev, ...result.data]);
        setHasMore(result.has_more);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, API_BASE_URL]);

  // Initial load
  useEffect(() => {
    fetchGalleryData(1);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchGalleryData(page + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [page, loading, hasMore, fetchGalleryData]);

  const handleImageClick = (imageId) => {
    navigate(`/gallery/${imageId}`);
  };

  // Get first letter for avatar
  const getAvatarLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
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
    <>
      <motion.div 
        ref={containerRef}
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {galleryItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className="break-inside-avoid mb-4 group cursor-pointer"
            onClick={() => handleImageClick(item.id)}
            variants={itemVariants}
            custom={index}
            whileHover="hover"
            whileTap="tap"
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <motion.div 
              className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              variants={cardHoverVariants}
            >
              {/* Render based on media type */}
              {item.media_type === 'video' ? (
                <motion.video
                  src={item.src || "/placeholder.svg"}
                  className={`w-full object-cover ${item.height}`}
                  variants={imageHoverVariants}
                  autoPlay
                  loop
                  muted
                  playsInline
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('img');
                    fallback.src = '/placeholder.svg';
                    fallback.className = e.target.className;
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              ) : (
                <motion.img
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  className={`w-full object-cover ${item.height}`}
                  variants={imageHoverVariants}
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              )}

              {/* Media Type Badge */}
              {item.media_type === 'gif' && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  GIF
                </div>
              )}
              {item.media_type === 'video' && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  VIDEO
                </div>
              )}

              {/* Artist Info Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
                variants={artistInfoVariants}
              >
                <div className="flex items-center gap-2">
                  {item.user_image ? (
                    <motion.img
                      src={item.user_image}
                      alt={item.artist}
                      className="w-6 h-6 rounded-full object-cover"
                      whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 }
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <motion.div 
                    className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                    style={{ display: item.user_image ? 'none' : 'flex' }}
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "#8088e2",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="text-xs text-white font-semibold">
                      {getAvatarLetter(item.artist)}
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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8088e2]"></div>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
        {!loading && hasMore && (
          <p className="text-gray-400 text-sm">Scroll for more...</p>
        )}
        {!hasMore && galleryItems.length > 0 && (
          <p className="text-gray-400 text-sm">No more images to load</p>
        )}
        {!loading && galleryItems.length === 0 && (
          <p className="text-gray-400 text-sm">No images found</p>
        )}
      </div>
    </>
  );
};

export default GalleryGrid;