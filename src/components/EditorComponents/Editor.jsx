// src/components/EditorComponents/Editor.jsx
import React, { useState } from "react";
import SecondSidebar from "./secondSidebar";
import MainCanvas from "./MainCanvas";

const Editor = () => {
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  const handleMediaUpload = (files) => {
    const newMediaFiles = files.map((file, index) => ({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
      id: Date.now() + index // Simple ID generation
    }));

    // Add new media to existing media (new ones go on top)
    setUploadedMedia(prev => [...newMediaFiles, ...prev]);
    
    // Auto-select the first newly uploaded media
    if (newMediaFiles.length > 0) {
      setSelectedMediaIndex(0);
    }
  };

  const handleMediaSelect = (index) => {
    setSelectedMediaIndex(index);
  };

  const handleMediaReorder = (fromIndex, toIndex) => {
    const newMediaArray = [...uploadedMedia];
    const [movedItem] = newMediaArray.splice(fromIndex, 1);
    newMediaArray.splice(toIndex, 0, movedItem);
    
    setUploadedMedia(newMediaArray);
    
    // Update selected index if needed
    if (selectedMediaIndex === fromIndex) {
      setSelectedMediaIndex(toIndex);
    } else if (selectedMediaIndex > fromIndex && selectedMediaIndex <= toIndex) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    } else if (selectedMediaIndex < fromIndex && selectedMediaIndex >= toIndex) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <SecondSidebar
        onMediaUpload={handleMediaUpload}
        uploadedMedia={uploadedMedia}
        onMediaSelect={handleMediaSelect}
        selectedMediaIndex={selectedMediaIndex}
        onMediaReorder={handleMediaReorder}
      />
      <MainCanvas
        uploadedMedia={uploadedMedia}
        selectedMediaIndex={selectedMediaIndex}
        onMediaReorder={handleMediaReorder}
      />
    </div>
  );
};

export default Editor;