import { useState, useRef, useEffect } from "react";

const MainCanvas = ({ uploadedMedia, selectedMediaIndex, onMediaReorder }) => {
  const [draggedImages, setDraggedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedImageId, setDraggedImageId] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (uploadedMedia && uploadedMedia.length > 0) {
      const newDraggedImages = uploadedMedia.map((media, index) => {
        const existingImage = draggedImages.find(img => img.originalIndex === index);
        return existingImage || {
          originalIndex: index,
          x: 100 + (index * 20),
          y: 50 + (index * 20), 
          width: media.type.startsWith('image/') ? 300 : 400,
          height: media.type.startsWith('image/') ? 200 : 250,
          zIndex: index + 1
        };
      });
      setDraggedImages(newDraggedImages);
    }
  }, [uploadedMedia]);

  useEffect(() => {
    if (uploadedMedia && uploadedMedia.length > 0) {
      setDraggedImages(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages.forEach((img, index) => {
          const mediaIndex = uploadedMedia.findIndex((_, i) => i === img.originalIndex);
          img.zIndex = mediaIndex + 1;
        });
        return updatedImages.sort((a, b) => a.zIndex - b.zIndex);
      });
    }
  }, [uploadedMedia]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || draggedImageId === null) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const bottomBoxHeight = 48; 
      const padding = 16; 
      
      let newX = e.clientX - canvasRect.left - dragOffset.x;
      let newY = e.clientY - canvasRect.top - dragOffset.y;
      
      newX = Math.max(0, Math.min(newX, canvasRect.width - 300)); 
      newY = Math.max(0, Math.min(newY, canvasRect.height - bottomBoxHeight - padding - 200)); 
      
      setDraggedImages(prevImages => 
        prevImages.map(img => 
          img.originalIndex === draggedImageId 
            ? { ...img, x: newX, y: newY }
            : img
        )
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggedImageId(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, draggedImageId, dragOffset]);

  const handleMouseDown = (e, imageIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    setDraggedImageId(imageIndex);
  };

  const DraggableImage = ({ image, media, index }) => {
    return (
      <div
        className={`absolute cursor-grab select-none transition-shadow duration-200 ${
          selectedMediaIndex === image.originalIndex ? 'ring-2 ring-blue-400 shadow-lg' : ''
        } ${isDragging && draggedImageId === image.originalIndex ? 'shadow-2xl scale-105' : 'hover:shadow-lg'}`}
        style={{
          left: image.x,
          top: image.y,
          zIndex: image.zIndex,
          width: image.width,
          height: image.height,
          userSelect: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e, image.originalIndex)}
      >
        {media.type.startsWith('image/') ? (
          <img
            src={media.preview}
            alt={media.name}
            className="w-full h-full object-cover rounded-lg pointer-events-none"
            draggable={false}
          />
        ) : media.type.startsWith('video/') ? (
          <video
            src={media.preview}
            className="w-full h-full object-cover rounded-lg pointer-events-none"
            controls
            muted
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center pointer-events-none">
            <p className="text-white text-sm">Unsupported media</p>
          </div>
        )}
        
        {/* Resize handles */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl-lg cursor-se-resize opacity-0 hover:opacity-100 transition-opacity pointer-events-auto"
          onMouseDown={(e) => {
            e.stopPropagation();
            // Handle resize logic here if needed
          }}
        />
        
        {/* Z-Index indicator */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-white text-xs font-bold">{image.zIndex}</span>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-[#121018] relative flex flex-col rounded-xl mx-2 my-2 overflow-hidden"
    >
      <div className="flex-1 relative p-4">
        {uploadedMedia && uploadedMedia.length > 0 ? (
          draggedImages.map((image, index) => {
            const media = uploadedMedia[image.originalIndex];
            return media ? (
              <DraggableImage
                key={`${image.originalIndex}-${index}`}
                image={image}
                media={media}
                index={index}
              />
            ) : null;
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center text-white opacity-50">
            <div>
              <p className="text-xl mb-2">No media selected</p>
              <p className="text-sm">Upload media from the left sidebar to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom centered element */}
      <div className="absolute bg-[#0d0b13] h-12 px-40 rounded-lg bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {/* content */}
      </div>
    </div>
  );
};

export default MainCanvas;