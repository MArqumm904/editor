"use client"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

// Local image imports
import img1 from "../assets/images/gallery/1.png"
import img2 from "../assets/images/gallery/2.png"
import img3 from "../assets/images/gallery/3.png"
import img4 from "../assets/images/gallery/4.png"
import img5 from "../assets/images/gallery/5.png"
import img6 from "../assets/images/gallery/6.jpg"
import img7 from "../assets/images/gallery/7.png"

const ImageDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-black text-white px-6 pb-8">
      <div className="pt-6 pb-8 ml-24">
        <h1 className="text-2xl font-semibold text-white">Cinemaglosw</h1>
      </div>

      <div className="flex gap-6">
        {/* Featured Image + Back Button */}
        <div className="flex-1 flex items-start gap-4">
          {/* Back Button - positioned to the left of image */}
          <button
            className="mt-4 w-20 h-10 bg-darkbg border border-white rounded-lg flex items-center justify-center hover:bg-darkbg transition-colors flex-shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>


          {/* Image and Info Container */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-2xl overflow-hidden">
              <img
                src={featuredImage.src || "/placeholder.svg"}
                alt={featuredImage.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Featured Image Info Below */}
            <div className="mt-3">
              <h2 className="text-lg font-medium mb-2 text-white">{featuredImage.title}</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm text-white font-semibold">{featuredImage.artist.charAt(0)}</span>
                </div>
                <span className="text-white text-sm font-medium">{featuredImage.artist}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Thumbnails */}
        <div className="w-80">
          <div className="grid grid-cols-2 gap-4">
            {sidebarImages.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                  <img src={item.src || "/placeholder.svg"} alt="Thumbnail" className="w-full h-32 object-cover" />
                </div>
                {/* Artist Info Below Thumbnail */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">{item.artist.charAt(0)}</span>
                  </div>
                  <span className="text-white text-xs font-medium truncate">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gallery Grid */}
      <div className="mt-12">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-6">
          {galleryItems.map((item) => (
            <div key={`bottom-${item.id}`} className="break-inside-avoid group cursor-pointer">
              <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <img
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  className={`w-full object-cover ${item.height}`}
                />
              </div>
              {/* Artist Info Below Each Image */}
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">{item.artist.charAt(0)}</span>
                </div>
                <span className="text-white text-sm font-medium">{item.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ImageDetail
