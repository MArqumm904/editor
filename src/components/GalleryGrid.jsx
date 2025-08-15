import { useNavigate } from "react-router-dom";
import img1 from "../assets/images/gallery/1.png";
import img2 from "../assets/images/gallery/2.png";
import img3 from "../assets/images/gallery/3.png";
import img4 from "../assets/images/gallery/4.png";
import img5 from "../assets/images/gallery/5.png";
import img6 from "../assets/images/gallery/6.jpg";
import img7 from "../assets/images/gallery/7.png";

const GalleryGrid = () => {
  const navigate = useNavigate();
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

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
      {galleryItems.map((item) => (
        <div
          key={item.id}
          className="break-inside-avoid mb-4 group cursor-pointer"
          onClick={() => handleImageClick(item.id)}
        >
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.title}
              className={`w-full object-cover ${item.height}`}
            />

            {/* Artist Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {item.artist.charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">
                  {item.artist}
                </span>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
