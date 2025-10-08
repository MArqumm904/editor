"use client"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState, useMemo } from "react"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
const VIDEO_EXTENSION_REGEX = /\.(mp4|webm|ogg|mov)$/i

const getMediaSource = (media) => (media?.src || media?.media_url || "").toString()

const isVideoMedia = (media) => {
  if (!media) {
    return false
  }

  const type = typeof media.media_type === "string" ? media.media_type.toLowerCase() : ""
  if (type === "video") {
    return true
  }

  const src = getMediaSource(media)
  if (!src) {
    return false
  }

  const cleanedSrc = src.split("?")[0]?.toLowerCase() ?? ""
  return VIDEO_EXTENSION_REGEX.test(cleanedSrc)
}

const ImageDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { id } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const [featuredImage, setFeaturedImage] = useState(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [error, setError] = useState(null)

  const numericId = Number(id)
  const hasValidId = Number.isFinite(numericId) && numericId > 0

  const getInitial = (name = "") => {
    const trimmed = name.trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() : "?"
  }

  useEffect(() => {
    if (!hasValidId) {
      setError("Invalid image reference.")
      setFeaturedImage(null)
      return
    }

    if (!API_BASE_URL) {
      setError("API base URL not configured.")
      return
    }

    const controller = new AbortController()
    let isActive = true

    const fetchDetail = async () => {
      setDetailLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/gallery/get-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: numericId }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch image details (${response.status})`)
        }

        const payload = await response.json()

        if (!payload.success || !payload.data) {
          throw new Error("Unexpected response while loading image details.")
        }

        const detail = payload.data

        if (!detail?.media_url) {
          throw new Error("Media URL missing for this image.")
        }

        if (isActive) {
          setFeaturedImage({
            id: detail.id,
            src: detail.media_url,
            artist: detail.user_name || "Unknown artist",
            title: detail.title || `Artwork #${detail.id}`,
            media_type: detail.media_type,
            user_image: detail.user_image,
            timestamp: detail.timestamp,
          })
        }
      } catch (err) {
        if (!isActive || err.name === "AbortError") {
          return
        }

        setError(err.message || "Unable to load image details.")
        setFeaturedImage(null)
      } finally {
        if (isActive) {
          setDetailLoading(false)
        }
      }
    }

    fetchDetail()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [hasValidId, numericId])

  useEffect(() => {
    if (!API_BASE_URL) {
      setError((prev) => prev ?? "API base URL not configured.")
      return
    }

    const controller = new AbortController()
    let isActive = true

    const fetchGallery = async () => {
      setGalleryLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/gallery`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch gallery (${response.status})`)
        }

        const payload = await response.json()
        const records = Array.isArray(payload?.data) ? payload.data : []

        if (isActive) {
          const mapped = records.map((item) => ({
            id: item.id,
            src: item.src || item.media_url,
            artist: item.artist || item.user_name || "Unknown artist",
            title: item.title || `Artwork #${item.id}`,
            height: item.height || "h-80",
            media_type: item.media_type,
            user_image: item.user_image,
            timestamp: item.timestamp,
          }))

          setGalleryItems(mapped)
        }
      } catch (err) {
        if (!isActive || err.name === "AbortError") {
          return
        }

        setError((prev) => prev ?? (err.message || "Unable to load gallery."))
      } finally {
        if (isActive) {
          setGalleryLoading(false)
        }
      }
    }

    fetchGallery()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  const resolvedFeaturedImage = useMemo(() => {
    if (featuredImage) {
      const fallback = galleryItems.find((item) => item.id === featuredImage.id)

      return {
        ...fallback,
        ...featuredImage,
        src: featuredImage.src || fallback?.src,
        artist: featuredImage.artist || fallback?.artist || "Unknown artist",
        title:
          featuredImage.title ||
          fallback?.title ||
          (featuredImage.id ? `Artwork #${featuredImage.id}` : "Artwork"),
        height: fallback?.height || "h-80",
      }
    }

    if (hasValidId) {
      const fallback = galleryItems.find((item) => item.id === numericId)
      return fallback || null
    }

    return null
  }, [featuredImage, galleryItems, hasValidId, numericId])

  const sidebarImages = useMemo(() => {
    const excludeId = resolvedFeaturedImage?.id

    return galleryItems
      .filter((item) => item.id !== excludeId)
      .slice(0, 6)
  }, [galleryItems, resolvedFeaturedImage])

  const bottomGalleryItems = useMemo(() => {
    const excludeId = resolvedFeaturedImage?.id

    return galleryItems.filter((item) => item.id !== excludeId)
  }, [galleryItems, resolvedFeaturedImage])

  const pageTitle =
    resolvedFeaturedImage?.title || (hasValidId ? `Artwork #${numericId}` : "Artwork Detail")

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

  const featuredArtist = resolvedFeaturedImage?.artist || "Unknown artist"
  const featuredTitle = resolvedFeaturedImage?.title || "Artwork"
  const featuredAlt = resolvedFeaturedImage
    ? `${featuredTitle} by ${featuredArtist}`
    : "Artwork preview"
  const showLoadingMessage =
    (detailLoading && !resolvedFeaturedImage) ||
    (galleryLoading && galleryItems.length === 0)

  const renderMedia = (
    mediaItem,
    { className = "", alt = "Artwork media", variant = "default" } = {}
  ) => {
    const src = getMediaSource(mediaItem)
    const isVideo = isVideoMedia(mediaItem)

    if (!src) {
      return (
        <img
          src="/placeholder.svg"
          alt={alt}
          className={className}
          loading={variant === "featured" ? "eager" : "lazy"}
        />
      )
    }

    if (isVideo) {
      const isFeatured = variant === "featured"

      return (
        <video
          src={src}
          className={className}
          controls={isFeatured}
          muted={!isFeatured}
          loop={!isFeatured}
          autoPlay={!isFeatured}
          playsInline
          preload="metadata"
          poster={mediaItem?.poster || undefined}
          aria-label={alt}
        >
          Your browser does not support the video tag.
        </video>
      )
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={variant === "featured" ? "eager" : "lazy"}
      />
    )
  }

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
          <h1 className="text-xl sm:text-2xl font-semibold text-white">{pageTitle}</h1>

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

      {error && (
        <motion.div
          className="mb-4 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-red-200"
          variants={mainContentVariants}
        >
          {error}
        </motion.div>
      )}

      {showLoadingMessage && !error && (
        <motion.div
          className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
          variants={mainContentVariants}
        >
          Loading gallery...
        </motion.div>
      )}

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
              {renderMedia(resolvedFeaturedImage, {
                className: "w-full h-64 sm:h-80 lg:h-96 object-cover",
                alt: featuredAlt,
                variant: "featured",
              })}
            </motion.div>

            {/* Featured Image Info Below */}
            <motion.div
              className="mt-3"
              variants={mainContentVariants}
            >
              <h2 className="text-base sm:text-lg font-medium mb-2 text-white">{featuredTitle}</h2>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#8088e2",
                    transition: { duration: 0.2 },
                  }}
                >
                  <span className="text-xs sm:text-sm text-white font-semibold">
                    {getInitial(featuredArtist)}
                  </span>
                </motion.div>
                <span className="text-white text-sm font-medium">{featuredArtist}</span>
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
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  {renderMedia(item, {
                    className: "w-full h-24 sm:h-32 object-cover",
                    alt: item.title || "Gallery thumbnail",
                    variant: "thumbnail",
                  })}
                </motion.div>
                {/* Artist Info Below Thumbnail */}
                <div className="mt-2 flex items-center gap-2">
                  <motion.div
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center"
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "#8088e2",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className="text-xs text-white font-semibold">
                      {getInitial(item.artist)}
                    </span>
                  </motion.div>
                  <span className="text-white text-xs font-medium truncate">
                    {item.artist || "Unknown artist"}
                  </span>
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
          {bottomGalleryItems.map((item, index) => (
            <motion.div
              key={`bottom-${item.id}`}
              className="break-inside-avoid group cursor-pointer"
              variants={gridItemVariants}
              custom={index}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                variants={imageVariants}
                whileHover="hover"
              >
                {renderMedia(item, {
                  className: `w-full object-cover ${item.height || "h-80"}`,
                  alt: item.title || "Gallery item",
                  variant: "grid",
                })}
              </motion.div>
              {/* Artist Info Below Each Image */}
              <div className="mt-3 flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#8088e2",
                    transition: { duration: 0.2 },
                  }}
                >
                  <span className="text-xs text-white font-semibold">
                    {getInitial(item.artist)}
                  </span>
                </motion.div>
                <span className="text-white text-xs sm:text-sm font-medium">
                  {item.artist || "Unknown artist"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImageDetail
