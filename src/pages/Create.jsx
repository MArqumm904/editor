import React, { useState, useEffect } from "react";
import LeftSidebar from "../components/EditorComponents/leftSidebar";
import SecondSidebar from "../components/EditorComponents/SecondSidebar";
import MainCanvas from "../components/EditorComponents/MainCanvas";
import RightSidebar from "../components/EditorComponents/RightPanel";
import MobileNavigation from "../components/EditorComponents/MobileNavigation";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState("canvas");
  const [activeEffect, setActiveEffect] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  // 2. New state add karein activeTab ke liye
  const [activeTab, setActiveTab] = useState("Upload");
  // Animation overlay state
  const [animationOverlays, setAnimationOverlays] = useState([]);

  const handleMediaUpload = (files) => {
    try {
      const mediaWithPreviews = files
        .map((file) => {
          if (!file || !file.type) {
            console.warn("Invalid file object:", file);
            return null;
          }

          return {
            ...file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
            type: file.type,
            name: file.name || "Unknown File",
          };
        })
        .filter(Boolean);

      if (mediaWithPreviews.length > 0) {
        setUploadedMedia((prev) => [...prev, ...mediaWithPreviews]);
        setSelectedMediaIndex(uploadedMedia.length);
        if (window.innerWidth < 768) {
          setActiveMobilePanel("canvas");
        }
      }
    } catch (error) {
      console.error("Error processing media upload:", error);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Agar manually tab change kia hai to tool ko deactivate kar do
    if (activeTool && tabName !== "Layer") {
      setActiveTool(null);
    }
    // Agar Upload tab par gaye hain to bhi tool deactivate kar do
    if (tabName === "Upload") {
      setActiveTool(null);
    }
  };

  const handleToolSelect = (toolName) => {
    setActiveTool(toolName);
    if (toolName === "Overlay") {
      setActiveTab("Layer"); // Automatically switch to Layer tab
    }
  };

  // Create.jsx me ye function add karein
  const handleExport = (format, settings) => {
    if (format === "image") {
      // Custom event dispatch karte hain MainCanvas ke liye
      window.dispatchEvent(
        new CustomEvent("exportCanvas", {
          detail: { format, settings },
        })
      );
    }
  };

  const handleMediaSelect = (index) => {
    setSelectedMediaIndex(index);
  };

  const handleMediaReorder = (newMediaOrder) => {
    setUploadedMedia(newMediaOrder);
    if (selectedMediaIndex !== null) {
      const newIndex = newMediaOrder.findIndex(
        (media) => media.id === uploadedMedia[selectedMediaIndex]?.id
      );
      setSelectedMediaIndex(newIndex >= 0 ? newIndex : null);
    }
  };

  // 🔥 KEY CHANGE: Handle effect selection for mobile
  const handleEffectSelect = (effect, selectedIndex) => {
    setActiveEffect(effect);
    // Auto-switch to canvas after selecting effect on mobile
    if (window.innerWidth < 768) {
      setActiveMobilePanel("canvas");
    }
  };

  // Cleanup file URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedMedia.forEach((media) => {
        if (media.preview) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, []);

  const handleRemoveMedia = (indexToRemove) => {
    setUploadedMedia((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Animation overlay handlers
  const handleAnimationOverlaySelect = (overlayId) => {
    // Handle animation overlay selection if needed
    console.log("Selected animation overlay:", overlayId);
  };

  const handleAnimationOverlayReorder = (newAnimationOrder) => {
    setAnimationOverlays(newAnimationOrder);
  };

  const handleAnimationOverlayRemove = (overlayId) => {
    setAnimationOverlays((prev) =>
      prev.filter((overlay) => overlay.id !== overlayId)
    );
  };

  // Listen for animation overlay additions from MainCanvas
  // useEffect(() => {
  //   const handleAnimationOverlayAdded = (event) => {
  //     const { overlay } = event.detail;
  //     if (overlay) {
  //       // Only add if it doesn't already exist
  //       setAnimationOverlays((prev) => {
  //         const exists = prev.some((item) => item.id === overlay.id);
  //         if (!exists) {
  //           return [...prev, overlay];
  //         }
  //         return prev;
  //       });
  //     }
  //   };

  //   window.addEventListener(
  //     "animationOverlayAdded",
  //     handleAnimationOverlayAdded
  //   );
  //   return () => {
  //     window.removeEventListener(
  //       "animationOverlayAdded",
  //       handleAnimationOverlayAdded
  //     );
  //   };
  // }, []);

  // Handle effect selection for animation overlays
  // const handleEffectSelectWithOverlay = (effect, selectedIndex) => {
  //   setActiveEffect(effect);

  //   // Only add to animation overlays list if no image is selected
  //   // When an image is selected, the MainCanvas component will handle it
  //   if (effect && effect.gif && (selectedMediaIndex === null || selectedMediaIndex === 0)) {
  //     const newOverlay = {
  //       id: Date.now() + Math.random(),
  //       name: effect.name || 'Animation Overlay',
  //       gifUrl: effect.gif,
  //       url: effect.gif,
  //       type: 'animation'
  //     };
  //     setAnimationOverlays(prev => [...prev, newOverlay]);
  //   }

  //   // Auto-switch to canvas after selecting effect on mobile
  //   if (window.innerWidth < 768) {
  //     setActiveMobilePanel("canvas");
  //   }
  // };
  const handleEffectSelectWithOverlay = (effect, selectedIndex) => {
    setActiveEffect(effect);

    // Auto-switch to canvas after selecting effect on mobile
    if (window.innerWidth < 768) {
      setActiveMobilePanel("canvas");
    }
  };
  return (
    <div className="h-screen bg-black">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <LeftSidebar
          onMediaUpload={handleMediaUpload}
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
        />
        <SecondSidebar
          onMediaUpload={handleMediaUpload}
          uploadedMedia={uploadedMedia}
          onMediaSelect={handleMediaSelect}
          onMediaReorder={handleMediaReorder}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          animationOverlays={animationOverlays}
          onAnimationOverlaySelect={handleAnimationOverlaySelect}
          onAnimationOverlayReorder={handleAnimationOverlayReorder}
          onAnimationOverlayRemove={handleAnimationOverlayRemove}
        />
        <MainCanvas
          uploadedMedia={uploadedMedia}
          selectedMediaIndex={selectedMediaIndex}
          setSelectedMediaIndex={setSelectedMediaIndex}
          onMediaReorder={handleMediaReorder}
          activeEffect={activeEffect}
          onRemoveMedia={handleRemoveMedia}
          animationOverlays={animationOverlays}
          onAnimationOverlayRemove={handleAnimationOverlayRemove}
          onAnimationOverlayAdd={(overlay) =>
            setAnimationOverlays((prev) => [...prev, overlay])
          } // ADD THIS
        />
        <RightSidebar
          onExport={handleExport}
          onEffectSelect={handleEffectSelectWithOverlay}
          selectedMediaIndex={selectedMediaIndex}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        {/* Mobile Header */}
        <div className="bg-[#121018] p-4 flex items-center justify-between border-b border-gray-800">
          <h1 className="text-white text-lg font-bold">Cinemaglow</h1>
          <div className="text-white text-sm">
            {uploadedMedia.length} media files
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeMobilePanel === "tools" && (
            <div className="h-full p-4 bg-[#121018]">
              <LeftSidebar
                onMediaUpload={handleMediaUpload}
                activeTool={activeTool}
                onToolSelect={handleToolSelect}
              />
            </div>
          )}

          {activeMobilePanel === "media" && (
            <div className="h-full bg-[#121018]">
              <SecondSidebar
                onMediaUpload={handleMediaUpload}
                uploadedMedia={uploadedMedia}
                onMediaSelect={handleMediaSelect}
                onMediaReorder={handleMediaReorder}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isMobile={true}
                animationOverlays={animationOverlays}
                onAnimationOverlaySelect={handleAnimationOverlaySelect}
                onAnimationOverlayReorder={handleAnimationOverlayReorder}
                onAnimationOverlayRemove={handleAnimationOverlayRemove}
              />
            </div>
          )}

          {activeMobilePanel === "canvas" && (
            <div className="h-full">
              <MainCanvas
                uploadedMedia={uploadedMedia}
                selectedMediaIndex={selectedMediaIndex}
                setSelectedMediaIndex={setSelectedMediaIndex}
                onMediaReorder={handleMediaReorder}
                activeEffect={activeEffect} // 🔥 KEY CHANGE: Pass activeEffect to mobile canvas
                isMobile={true}
                animationOverlays={animationOverlays}
                onAnimationOverlayRemove={handleAnimationOverlayRemove}
              />
              <RightSidebar
                isMobile={true}
                onExport={handleExport}
                onEffectSelect={handleEffectSelectWithOverlay}
                selectedMediaIndex={selectedMediaIndex}
              />
            </div>
          )}

          {activeMobilePanel === "effects" && (
            <div className="h-full bg-[#121018] p-4">
              <RightSidebar
                isMobile={true}
                onExport={handleExport}
                onEffectSelect={handleEffectSelectWithOverlay} // 🔥 KEY CHANGE: Use handleEffectSelectWithOverlay
              />
            </div>
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

export default Create;
