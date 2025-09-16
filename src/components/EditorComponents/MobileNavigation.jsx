// src/components/EditorComponents/MobileNavigation.jsx
import React from 'react';
import { Settings, Upload, Image, Sparkles } from 'lucide-react';

const MobileNavigation = ({ activePanel, setActivePanel, uploadedMediaCount }) => {
  const navItems = [
    {
      id: 'tools',
      label: 'Tools',
      icon: Settings,
      badge: null
    },
    {
      id: 'media',
      label: 'Media',
      icon: Upload,
      badge: uploadedMediaCount > 0 ? uploadedMediaCount : null
    },
    {
      id: 'canvas',
      label: 'Canvas',
      icon: Image,
      badge: null
    },
    {
      id: 'effects',
      label: 'Effects',
      icon: Sparkles,
      badge: null
    }
  ];

  return (
    <div className="bg-[#121018] border-t border-gray-800 px-4 py-2 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative ${
                isActive 
                  ? 'text-[#8088e2] bg-[#1a1a2e]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <IconComponent className="w-6 h-6" />
                {item.badge && (
                  <div className="absolute -top-2 -right-2 bg-[#8088e2] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#8088e2] rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;