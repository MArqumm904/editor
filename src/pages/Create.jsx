// src/pages/Create.jsx
import React from 'react';
import LeftSidebar from '../components/EditorComponents/LeftSidebar';
import SecondSidebar from '../components/EditorComponents/secondSidebar';
import MainCanvas from '../components/EditorComponents/MainCanvas';
import RightSidebar from '../components/EditorComponents/RightPanel';

const Create = () => {
  return (
    <div className="h-screen bg-black flex">
      {/* Leftmost Panel - Light Gray Sidebar */}
      <LeftSidebar />
      
      {/* Second Panel - Dark Gray Sidebar */}
      <SecondSidebar />
      
      {/* Third Panel - Dark Gray Main Canvas */}
      <MainCanvas />
      
      {/* Rightmost Panel - Dark Gray with Internal Rectangles */}
      <RightSidebar />
    </div>
  );
};

export default Create;