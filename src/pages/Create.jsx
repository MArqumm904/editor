// src/pages/Create.jsx
import React, { useState, useEffect } from 'react';
import LeftSidebar from '../components/EditorComponents/LeftSidebar';
import SecondSidebar from '../components/EditorComponents/SecondSidebar';
import MainCanvas from '../components/EditorComponents/MainCanvas';
import RightSidebar from '../components/EditorComponents/RightPanel';

const Create = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  const handleMediaUpload = (files) => {
    try {
      const mediaWithPreviews = files.map(file => {
        if (!file || !file.type) {
          console.warn("Invalid file object:", file);
          return null;
        }
        
        return {
          ...file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random(),
          type: file.type,
          name: file.name || 'Unknown File'
        };
      }).filter(Boolean); // Remove any null entries
      
      if (mediaWithPreviews.length > 0) {
        setUploadedMedia(prev => [...prev, ...mediaWithPreviews]);
        setSelectedMediaIndex(uploadedMedia.length); // Select the first new media
      }
    } catch (error) {
      console.error("Error processing media upload:", error);
    }
  };

  const handleMediaSelect = (index) => {
    setSelectedMediaIndex(index);
  };

  const handleMediaReorder = (newMediaOrder) => {
    setUploadedMedia(newMediaOrder);
    // Update selected index if needed
    if (selectedMediaIndex !== null) {
      const newIndex = newMediaOrder.findIndex(media => 
        media.id === uploadedMedia[selectedMediaIndex]?.id
      );
      setSelectedMediaIndex(newIndex >= 0 ? newIndex : null);
    }
  };

  // Cleanup file URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedMedia.forEach(media => {
        if (media.preview) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, []);

  return (
    <div className="h-screen bg-black flex">
      {/* Leftmost Panel - Light Gray Sidebar */}
      <LeftSidebar />
      
      {/* Second Panel - Dark Gray Sidebar */}
      <SecondSidebar 
        onMediaUpload={handleMediaUpload}
        uploadedMedia={uploadedMedia}
        onMediaSelect={handleMediaSelect}
        onMediaReorder={handleMediaReorder}
      />
      
      {/* Third Panel - Dark Gray Main Canvas */}
      <MainCanvas 
        uploadedMedia={uploadedMedia}
        selectedMediaIndex={selectedMediaIndex}
        onMediaReorder={handleMediaReorder}
      />
      
      {/* Rightmost Panel - Dark Gray with Internal Rectangles */}
      <RightSidebar />
    </div>
  );
};

export default Create;