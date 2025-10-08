import React, { useState, useEffect, useCallback } from "react";
import LeftSidebar from "../components/EditorComponents/leftSidebar";
import SecondSidebar from "../components/EditorComponents/SecondSidebar";
import MainCanvas from "../components/EditorComponents/MainCanvas";
import RightSidebar from "../components/EditorComponents/RightPanel";
import MobileNavigation from "../components/EditorComponents/MobileNavigation";
import { Upload, X, User, Mail, Sparkles } from "lucide-react";

const Create = () => {
  // Welcome Modal States
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user has already filled the form
    const savedProfile = localStorage.getItem('userProfile');
    if (!savedProfile) {
      setShowWelcomeModal(true);
    }
  }, []);

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState("canvas");
  const [activeEffect, setActiveEffect] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [activeTab, setActiveTab] = useState("Upload");
  const [animationOverlays, setAnimationOverlays] = useState([]);

  // Welcome Form Handlers
  const handleImageUploadWelcome = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWelcomeSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        const profileData = {
          name: formData.name,
          email: formData.email,
          imagePreview: imagePreview,
          timestamp: Date.now()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        setShowWelcomeModal(false);
        setIsSubmitting(false);
      }, 800);
    }
  };

  // Original Handlers
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
        appliedEffect: null,
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
    if (activeTool && tabName !== "Layer") {
      setActiveTool(null);
    }
    if (tabName === "Upload") {
      setActiveTool(null);
    }
  };

  const handleToolSelect = (toolName) => {
    setActiveTool(toolName);
    if (toolName === "Overlay") {
      setActiveTab("Layer");
    }
  };

  const handleExport = (format, settings) => {
    if (format === "image") {
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

  const handleEffectSelect = (effect, selectedIndex) => {
    setActiveEffect(effect);
    if (window.innerWidth < 768) {
      setActiveMobilePanel("canvas");
    }
  };

  useEffect(() => {
    return () => {
      uploadedMedia.forEach((media) => {
        if (media.preview) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, []);

  const handleRemoveMedia = useCallback((indexToRemove) => {
    setUploadedMedia((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleImageEffectChange = useCallback((index, effectUrl) => {
    setUploadedMedia((prev) =>
      prev.map((media, idx) => {
        if (idx !== index) return media;
        if (media.appliedEffect === effectUrl) return media;
        return { ...media, appliedEffect: effectUrl };
      })
    );
  }, []);

  const handleEffectRemove = useCallback((index) => {
    setUploadedMedia((prev) =>
      prev.map((media, idx) =>
        idx === index ? { ...media, appliedEffect: null } : media
      )
    );
  }, []);

  const handleAnimationOverlaySelect = (overlayId) => {
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

  const handleEffectSelectWithOverlay = (effect, selectedIndex) => {
    setActiveEffect(effect);
    if (window.innerWidth < 768) {
      setActiveMobilePanel("canvas");
    }
  };

  return (
    <div className="h-screen bg-black">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121018] rounded-xl shadow-2xl max-w-lg w-full border border-[#2d2640] relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5e68db]/5 via-transparent to-blue-600/5 pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative p-8 pb-6 border-b border-[#2d2640]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5e68db] to-[#959adb] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome to Cinemaglow 🎬
                </h2>
              </div>
              <p className="text-gray-400 text-sm">Let's set up your profile to get started</p>
            </div>

            {/* Form */}
            <div className="p-5 space-y-5 relative">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#5e68db]/50"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-[#1a1625] border-2 border-dashed border-[#2d2640] hover:border-[#5e68db]/50 flex flex-col items-center justify-center transition-all group-hover:bg-[#1f1a2e]">
                      <Upload size={20} className="text-gray-500 group-hover:text-[#5e68db] transition-colors" />
                      <span className="text-xs text-gray-500 mt-1">Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadWelcome}
                      className="hidden"
                    />
                  </label>
                )}
                {formErrors.image && (
                  <p className="text-red-400 text-xs mt-2">{formErrors.image}</p>
                )}
                <p className="text-gray-600 text-xs mt-2">Optional</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <User size={14} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full bg-[#1a1625] border ${
                    formErrors.name ? 'border-red-500/50' : 'border-[#2d2640]'
                  } rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#5e68db]/50 transition-colors`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1.5">{formErrors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Mail size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full bg-[#1a1625] border ${
                    formErrors.email ? 'border-red-500/50' : 'border-[#2d2640]'
                  } rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#5e68db]/50 transition-colors`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{formErrors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleWelcomeSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#5e68db] to-[#959adb] text-white font-medium py-2.5 rounded-lg hover:from-[#959adb] hover:to-[#5e68db] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Get Started</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
          onLayerRemove={handleRemoveMedia}
          onEffectRemove={handleEffectRemove}
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
          onImageEffectChange={handleImageEffectChange}
          animationOverlays={animationOverlays}
          onAnimationOverlayRemove={handleAnimationOverlayRemove}
          onAnimationOverlayAdd={(overlay) =>
            setAnimationOverlays((prev) => [...prev, overlay])
          }
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
                onLayerRemove={handleRemoveMedia}
                onEffectRemove={handleEffectRemove}
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
                activeEffect={activeEffect}
                isMobile={true}
                onRemoveMedia={handleRemoveMedia}
                onImageEffectChange={handleImageEffectChange}
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
                onEffectSelect={handleEffectSelectWithOverlay}
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