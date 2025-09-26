import React, { useState, useEffect } from 'react';

const VideoExportLoader = ({ isVisible, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Initializing video processing...",
    "Processing images and effects...",
    "Applying security checks...",
    "Rendering final video...",
    "Almost done..."
  ];

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        
        const increment = Math.random() * 3 + 5; // Random progress between 5-20%
        const newProgress = Math.min(prev + increment, 100);
        
        // Update step based on progress
        if (newProgress > 80) setCurrentStep(4);
        else if (newProgress > 60) setCurrentStep(3);
        else if (newProgress > 40) setCurrentStep(2);
        else if (newProgress > 20) setCurrentStep(1);
        else setCurrentStep(0);
        
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-[#1a1a24] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#2a2a35]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-[#8088e2] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#8088e2] rounded-full opacity-75 animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Processing Your Video</h3>
          <p className="text-gray-400 text-sm">
            Please wait while we process your video through our security system
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-[#2a2a35] rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#8088e2] to-[#6b73d1] h-full rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center mb-6">
          <div className="text-white font-medium mb-2">{steps[currentStep]}</div>
          <div className="flex justify-center space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-[#8088e2]' 
                    : 'bg-[#2a2a35]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span>Secured by CinemaGlow Protection</span>
        </div>

        {/* Estimated Time */}
        <div className="text-center mt-4 text-xs text-gray-500">
          Estimated time: {Math.max(30 - Math.round(progress * 0.3), 5)} seconds remaining
        </div>
      </div>
    </div>
  );
};

export default VideoExportLoader;