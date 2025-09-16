// src/components/EditorComponents/Editor.jsx
import { useState } from "react";
import SecondSidebar from "./SecondSidebar";
import MainCanvas from "./MainCanvas";
import MobileNavigation from "./MobileNavigation";

const Editor = () => {
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState('media');

  const handleMediaUpload = (files) => {
    const newMediaFiles = files.map((file, index) => ({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
      id: Date.now() + index
    }));

    setUploadedMedia(prev => [...newMediaFiles, ...prev]);
    
    if (newMediaFiles.length > 0) {
      setSelectedMediaIndex(0);
      // On mobile, switch to canvas after upload
      if (window.innerWidth < 768) {
        setActiveMobilePanel('canvas');
      }
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
    
    if (selectedMediaIndex === fromIndex) {
      setSelectedMediaIndex(toIndex);
    } else if (selectedMediaIndex > fromIndex && selectedMediaIndex <= toIndex) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    } else if (selectedMediaIndex < fromIndex && selectedMediaIndex >= toIndex) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
  };

  return (
    <div className="h-screen bg-gray-900">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
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
          setSelectedMediaIndex={setSelectedMediaIndex}
          onMediaReorder={handleMediaReorder}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        {/* Mobile Header */}
        <div className="bg-[#121018] p-4 flex items-center justify-between border-b border-gray-800">
          <h1 className="text-white text-lg font-bold">Editor</h1>
          <div className="text-white text-sm">
            {uploadedMedia.length} files
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {activeMobilePanel === 'media' && (
            <SecondSidebar
              onMediaUpload={handleMediaUpload}
              uploadedMedia={uploadedMedia}
              onMediaSelect={handleMediaSelect}
              selectedMediaIndex={selectedMediaIndex}
              onMediaReorder={handleMediaReorder}
              isMobile={true}
            />
          )}

          {activeMobilePanel === 'canvas' && (
            <MainCanvas
              uploadedMedia={uploadedMedia}
              selectedMediaIndex={selectedMediaIndex}
              setSelectedMediaIndex={setSelectedMediaIndex}
              onMediaReorder={handleMediaReorder}
              isMobile={true}
            />
          )}
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation 
          activePanel={activeMobilePanel}
          setActivePanel={setActiveMobilePanel}
          uploadedMediaCount={uploadedMedia.length}
        />
      </div>
    </div>
  );
};

export default Editor;