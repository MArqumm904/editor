import React from 'react';
import { Circle } from 'react-konva';

const PerspectiveTransformer = ({ anchors, onAnchorDrag, imageId }) => {
  if (!anchors) return null;

  return (
    <>
      {/* Top Left Anchor */}
      <Circle
        x={anchors.topLeft.x}
        y={anchors.topLeft.y}
        radius={6}
        fill="red"
        stroke="white"
        strokeWidth={2}
        draggable
        onDragMove={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onAnchorDrag("topLeft", { x: newX, y: newY }, imageId);
        }}
      />

      {/* Top Right Anchor */}
      <Circle
        x={anchors.topRight.x}
        y={anchors.topRight.y}
        radius={6}
        fill="red"
        stroke="white"
        strokeWidth={2}
        draggable
        onDragMove={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onAnchorDrag("topRight", { x: newX, y: newY }, imageId);
        }}
      />

      {/* Bottom Left Anchor */}
      <Circle
        x={anchors.bottomLeft.x}
        y={anchors.bottomLeft.y}
        radius={6}
        fill="red"
        stroke="white"
        strokeWidth={2}
        draggable
        onDragMove={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onAnchorDrag("bottomLeft", { x: newX, y: newY }, imageId);
        }}
      />

      {/* Bottom Right Anchor */}
      <Circle
        x={anchors.bottomRight.x}
        y={anchors.bottomRight.y}
        radius={6}
        fill="red"
        stroke="white"
        strokeWidth={2}
        draggable
        onDragMove={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onAnchorDrag("bottomRight", { x: newX, y: newY }, imageId);
        }}
      />
    </>
  );
};

export default PerspectiveTransformer;