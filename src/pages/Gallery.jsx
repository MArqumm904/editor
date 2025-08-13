import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import GalleryGrid from "../components/GalleryGrid"
import Topbar from "../components/Topbar"

const Gallery = () => {
  return (
    <div className="min-h-screen bg-darkbg">
      <Navbar />
      <Topbar />
      <main className="container mx-auto px-4 py-8 mb-48">
        <GalleryGrid />
      </main>
      <Footer />
    </div>
  )
}

export default Gallery
