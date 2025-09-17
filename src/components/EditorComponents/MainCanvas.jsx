import { useState, useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Line,
  Rect,
  Group,
} from "react-konva";
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  ChevronRight,
} from "lucide-react";

const MainCanvas = ({
  uploadedMedia,
  selectedMediaIndex,
  setSelectedMediaIndex,
  activeEffect,
  isMobile = false,
  onRemoveMedia,
}) => {
  // ----- UPDATED EffectOverlay (now accepts effectUrl + target) -----
  // ----- UPDATED EffectOverlay (now accepts effectUrl + target) -----
  const EffectOverlay = ({ effectUrl, target }) => {
    if (!effectUrl || !target) return null;

    // Calculate Stage offset within the centered container
    const containerRect = canvasRef.current?.getBoundingClientRect();
    const stageElement = stageRef.current?.getStage().container();
    const stageRect = stageElement?.getBoundingClientRect();
    const stageOffsetX =
      stageRect && containerRect ? stageRect.left - containerRect.left : 0;
    const stageOffsetY =
      stageRect && containerRect ? stageRect.top - containerRect.top : 0;

    // Calculate position relative to Stage position
    let effectX = target.x;
    let effectY = target.y;

    // Calculate how much of the image is visible within canvas
    const visibleWidth = Math.min(
      target.width,
      canvasSize.width - Math.max(0, effectX),
      Math.max(0, effectX + target.width) - Math.max(0, effectX)
    );

    const visibleHeight = Math.min(
      target.height,
      canvasSize.height - Math.max(0, effectY),
      Math.max(0, effectY + target.height) - Math.max(0, effectY)
    );

    // Calculate the visible portion of the effect
    const effectOffsetX = Math.max(0, -effectX);
    const effectOffsetY = Math.max(0, -effectY);

    // Convert to absolute positioning for the overlay
    const finalX = stageOffsetX + Math.max(0, effectX);
    const finalY = stageOffsetY + Math.max(0, effectY);

    // If no part of the effect is visible, don't render it
    if (visibleWidth <= 0 || visibleHeight <= 0) {
      return null;
    }

    return (
      <div
        className="absolute pointer-events-none effect-overlay"
        style={{
          left: finalX,
          top: finalY,
          width: visibleWidth,
          height: visibleHeight,
          opacity: 0.45,
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        <img
          src={effectUrl}
          alt="Effect overlay"
          className="w-full h-full object-cover"
          style={{
            pointerEvents: "none",
            userSelect: "none",
            mixBlendMode: "screen",
            marginLeft: -effectOffsetX,
            marginTop: -effectOffsetY,
          }}
        />
      </div>
    );
  };

  const [draggedImages, setDraggedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [konvaImages, setKonvaImages] = useState([]);
  const canvasRef = useRef(null);
  const stageRef = useRef();
  const transformerRef = useRef();
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] });

  // ----- NEW: state for small draggable effects on canvas -----
  const [canvasEffects, setCanvasEffects] = useState([]);
  // canvasEffects: { id, gifUrl, x, y, width:130, height:130, isDragging }

  // ----- NEW: state for drag selection -----
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [groupedImages, setGroupedImages] = useState([]);
  const groupRef = useRef();

  // ----- NEW: Context menu state -----
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetImageId: null,
  });

  const lastActiveEffectRef = useRef(null);

  const exportCanvasAsImage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // Hide transformer temporarily during export
    const transformer = transformerRef.current;
    const wasVisible = transformer && transformer.visible();

    if (transformer) {
      transformer.visible(false);
      transformer.getLayer()?.batchDraw();
    }

    setTimeout(() => {
      const dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
      });

      if (transformer && wasVisible) {
        transformer.visible(true);
        transformer.getLayer()?.batchDraw();
      }

      const link = document.createElement("a");
      link.download = "cinemaglow.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  };

  useEffect(() => {
    const handleExportEvent = (e) => {
      if (e.detail?.format === "image" && !e.detail?.processed) {
        e.detail.processed = true; // Mark as processed
        exportCanvasAsImage();
      }
    };

    window.addEventListener("exportCanvas", handleExportEvent, { once: false });

    return () => {
      window.removeEventListener("exportCanvas", handleExportEvent);
    };
  }, []);

  // Arrow key navigation ke liye ye useEffect add karein
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle arrow keys when an image is selected (not base image)
      if (!selectedMediaIndex || selectedMediaIndex === 0) return;

      // Check if any input/textarea is focused to avoid conflicts
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;

      const moveDistance = e.shiftKey ? 10 : 1;
      let newX, newY;

      // Get current position from konvaImages
      const currentImage = konvaImages.find(
        (img) => img.id === selectedMediaIndex
      );
      if (!currentImage) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newY = Math.max(0, currentImage.y - moveDistance);
          updateImagePosition(selectedMediaIndex, currentImage.x, newY);
          break;
        case "ArrowDown":
          e.preventDefault();
          newY = Math.min(
            canvasSize.height - currentImage.height,
            currentImage.y + moveDistance
          );
          updateImagePosition(selectedMediaIndex, currentImage.x, newY);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newX = Math.max(0, currentImage.x - moveDistance);
          updateImagePosition(selectedMediaIndex, newX, currentImage.y);
          break;
        case "ArrowRight":
          e.preventDefault();
          newX = Math.min(
            canvasSize.width - currentImage.width,
            currentImage.x + moveDistance
          );
          updateImagePosition(selectedMediaIndex, newX, currentImage.y);
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMediaIndex, konvaImages, canvasSize]);

  // Helper function to update image position
  const updateImagePosition = (imageId, newX, newY) => {
    // Update konvaImages state
    setKonvaImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, x: newX, y: newY } : img
      )
    );

    // Update draggedImages state for consistency
    setDraggedImages((prev) =>
      prev.map((img) =>
        img.originalIndex === imageId ? { ...img, x: newX, y: newY } : img
      )
    );

    // Update the actual Konva node position
    const stage = stageRef.current;
    if (stage) {
      const layer = stage.getLayers()[1];
      const node = layer?.findOne(`#image-${imageId}`);
      if (node) {
        node.position({ x: newX, y: newY });
        layer.batchDraw();
      }
    }
  };

  // ----- UPDATED: Context menu functions using Konva's built-in layering -----
  const handleContextMenuAction = (action) => {
    const targetId = contextMenu.targetImageId;
    if (!targetId) return;

    const stage = stageRef.current;
    const layer = stage?.getLayers()[1]; // editable layer
    if (!layer) return;

    const targetNode = layer.findOne(`#image-${targetId}`);
    if (!targetNode) return;

    switch (action) {
      case "duplicate":
        // Find the image to duplicate
        const imageToDuplicate = konvaImages.find((img) => img.id === targetId);
        const draggedImageToDuplicate = draggedImages.find(
          (img) => img.originalIndex === targetId
        );

        if (imageToDuplicate && draggedImageToDuplicate) {
          const newId = Math.max(...konvaImages.map((img) => img.id)) + 1;

          // Create new konva image
          const newKonvaImage = {
            ...imageToDuplicate,
            id: newId,
            x: imageToDuplicate.x + 20,
            y: imageToDuplicate.y + 20,
          };

          // Create new dragged image
          const newDraggedImage = {
            ...draggedImageToDuplicate,
            originalIndex: newId,
            x: draggedImageToDuplicate.x + 20,
            y: draggedImageToDuplicate.y + 20,
          };

          setKonvaImages((prev) => [...prev, newKonvaImage]);
          setDraggedImages((prev) => [...prev, newDraggedImage]);
        }
        break;

      case "remove":
        setKonvaImages((prev) => prev.filter((img) => img.id !== targetId));
        setDraggedImages((prev) =>
          prev.filter((img) => img.originalIndex !== targetId)
        );
        if (onRemoveMedia) {
          onRemoveMedia(targetId);
        }
        if (selectedMediaIndex === targetId) {
          setSelectedMediaIndex(null);
        }
        break;

      case "lock":
        // Toggle lock state
        setKonvaImages((prev) =>
          prev.map((img) =>
            img.id === targetId ? { ...img, locked: !img.locked } : img
          )
        );
        break;

      case "to-front":
        moveToFront(targetNode, layer);
        break;

      case "to-back":
        moveToBack(targetNode, layer);
        break;

      case "forward":
        moveForward(targetNode, layer);
        break;

      case "backward":
        moveBackward(targetNode, layer);
        break;
    }

    setContextMenu({ visible: false, x: 0, y: 0, targetImageId: null });
  };

  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, targetImageId: null });
  };

  // Auto-correct effects that are outside canvas boundaries
  useEffect(() => {
    setCanvasEffects((prev) =>
      prev.map((ef) => {
        const minMargin = 5; // Minimum margin from edges
        const clampedX = Math.max(
          minMargin,
          Math.min(ef.x, canvasSize.width - ef.width - minMargin)
        );
        const clampedY = Math.max(
          minMargin,
          Math.min(ef.y, canvasSize.height - ef.height - minMargin)
        );

        if (ef.x !== clampedX || ef.y !== clampedY) {
          console.log(
            `Auto-correcting effect ${ef.id} from (${ef.x}, ${ef.y}) to (${clampedX}, ${clampedY})`
          );
          return { ...ef, x: clampedX, y: clampedY };
        }
        return ef;
      })
    );
  }, [canvasSize.width, canvasSize.height]);

  // Utility: rectangle intersection
  const rectsIntersect = (a, b) => {
    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  };

  // Add effect icon to canvas (130x130)
  const addEffectToCanvas = (effect) => {
    if (!effect) return;
    const gifUrl = effect.gif || effect.gifUrl || effect.url || null;
    if (!gifUrl) return;
    const id = `ef-${Date.now()}`;

    // Ensure effect is positioned within canvas boundaries
    const effectWidth = 130;
    const effectHeight = 130;
    const minMargin = 5; // Minimum margin from edges
    const startX = Math.max(
      minMargin,
      Math.min(
        (canvasSize.width - effectWidth) / 2,
        canvasSize.width - effectWidth - minMargin
      )
    );
    const startY = Math.max(
      minMargin,
      Math.min(
        (canvasSize.height - effectHeight) / 2,
        canvasSize.height - effectHeight - minMargin
      )
    );

    const newEf = {
      id,
      gifUrl,
      x: startX,
      y: startY,
      width: effectWidth,
      height: effectHeight,
      isDragging: false,
    };
    setCanvasEffects((prev) => [...prev, newEf]);
  };

  // If activeEffect prop changes, add it to canvas once (prevents duplicates)
  useEffect(() => {
    if (!activeEffect) return;
    const gifUrl =
      activeEffect.gif || activeEffect.gifUrl || activeEffect.url || null;
    if (!gifUrl) return;
    if (lastActiveEffectRef.current === gifUrl) {
      // already added this exact gif recently; skip
      return;
    }
    addEffectToCanvas(activeEffect);
    lastActiveEffectRef.current = gifUrl;
    // reset ref after short delay so user can add same effect again if they click again
    const t = setTimeout(() => {
      lastActiveEffectRef.current = null;
    }, 800);
    return () => clearTimeout(t);
  }, [activeEffect, canvasSize]);

  // Compute snapping for a rect against candidate guide positions
  const getSnapAdjustment = (rect, candidates, axis) => {
    const threshold = 8;

    // offsets between visual rect and node position
    // used to convert snapped visual rect coordinate back to node position
    const offsetX = rect.x - rect.nodeX;
    const offsetY = rect.y - rect.nodeY;

    let best = { dist: Infinity, snapLine: null, newPos: null };

    if (axis === "x") {
      const points = [
        { at: rect.x, mode: "left" },
        { at: rect.x + rect.width / 2, mode: "center" },
        { at: rect.x + rect.width, mode: "right" },
      ];
      candidates.forEach((c) => {
        points.forEach((p) => {
          const dist = Math.abs(c - p.at);
          if (dist < best.dist && dist <= threshold) {
            let nx = rect.nodeX;
            if (p.mode === "left") nx = c - 0 - offsetX;
            if (p.mode === "center") nx = c - rect.width / 2 - offsetX;
            if (p.mode === "right") nx = c - rect.width - offsetX;
            best = { dist, snapLine: c, newPos: { x: nx } };
          }
        });
      });
    } else {
      const points = [
        { at: rect.y, mode: "top" },
        { at: rect.y + rect.height / 2, mode: "middle" },
        { at: rect.y + rect.height, mode: "bottom" },
      ];
      candidates.forEach((c) => {
        points.forEach((p) => {
          const dist = Math.abs(c - p.at);
          if (dist < best.dist && dist <= threshold) {
            let ny = rect.nodeY;
            if (p.mode === "top") ny = c - 0 - offsetY;
            if (p.mode === "middle") ny = c - rect.height / 2 - offsetY;
            if (p.mode === "bottom") ny = c - rect.height - offsetY;
            best = { dist, snapLine: c, newPos: { y: ny } };
          }
        });
      });
    }

    if (best.dist === Infinity) return null;
    return best;
  };

  useEffect(() => {
    if (uploadedMedia && uploadedMedia.length > 0) {
      const firstImage = uploadedMedia[0];
      if (firstImage.type.startsWith("image/")) {
        const img = new window.Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > 600 || height > 600) {
            const scale = Math.min(600 / width, 650 / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          setCanvasSize({ width, height });

          // Only create new draggedImages for new uploads, preserve existing positions
          setDraggedImages((prevImages) => {
            const newDraggedImages = uploadedMedia.map((media, index) => {
              // Check if this image already exists in previous state
              const existingImage = prevImages.find(
                (img) => img.originalIndex === index
              );

              if (existingImage) {
                // Keep existing position and properties
                return {
                  ...existingImage,
                  // Update dimensions only for base image if needed
                  width: index === 0 ? width : existingImage.width,
                  height: index === 0 ? height : existingImage.height,
                };
              } else {
                // New image - set default position
                return {
                  originalIndex: index,
                  x: index === 0 ? 0 : 50, // Base image at 0,0, others at 50,50
                  y: index === 0 ? 0 : 50,
                  width: index === 0 ? width : 150,
                  height: index === 0 ? height : 150,
                  rotation: 0,
                };
              }
            });

            return newDraggedImages;
          });

          // Create konva images for transformer functionality
          setKonvaImages((prevKonvaImages) => {
            const images = uploadedMedia.map((media, idx) => {
              // Check if this konva image already exists
              const existingKonvaImage = prevKonvaImages.find(
                (img) => img.id === idx
              );

              if (existingKonvaImage) {
                // Keep existing konva image but update media if needed
                return {
                  ...existingKonvaImage,
                  media,
                  // Update dimensions only for base image
                  width: idx === 0 ? width : existingKonvaImage.width,
                  height: idx === 0 ? height : existingKonvaImage.height,
                };
              } else {
                // New konva image
                const isBase = idx === 0;
                return {
                  id: idx,
                  media,
                  konvaImg: null,
                  x: isBase ? 0 : 50,
                  y: isBase ? 0 : 50,
                  width: isBase ? width : 150,
                  height: isBase ? height : 150,
                  rotation: 0,
                  isDragging: false,
                };
              }
            });

            // Load images for new konva items only
            images.forEach((item, i) => {
              if (!item.konvaImg) {
                const imgObj = new window.Image();
                imgObj.src = item.media.preview;
                imgObj.onload = () => {
                  setKonvaImages((prev) => {
                    const updated = [...prev];
                    if (updated[i]) {
                      updated[i].konvaImg = imgObj;
                    }
                    return updated;
                  });
                };
              }
            });

            return images;
          });
        };
        img.src = firstImage.preview;
      }
    }
  }, [uploadedMedia]);

  // REMOVED: Manual zIndex sorting - Konva handles layering automatically

  // Attach/clear Transformer based on selection (non-base images only)
  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const layer = stage.getLayers()[1];
    if (!layer) return;

    // If we have a group, attach transformer to the group
    if (groupedImages.length > 0) {
      const groupNode = layer.findOne("#image-group");
      if (groupNode) {
        transformerRef.current.nodes([groupNode]);
        transformerRef.current.getLayer().batchDraw();
        return;
      }
    }

    // If we have individual selection (not base image)
    if (selectedMediaIndex != null && selectedMediaIndex !== 0) {
      const selectedNode = layer.findOne(`#image-${selectedMediaIndex}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
        return;
      }
    }

    // Clear transformer when no selection
    transformerRef.current.nodes([]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedMediaIndex, groupedImages, konvaImages]);

  // Mouse/Touch event handlers (UPDATED to handle canvasEffects drag & drop)
  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging || draggedImageId === null) return;

      e.preventDefault();

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const stageElement = stageRef.current?.getStage().container();
      const stageRect = stageElement?.getBoundingClientRect();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = clientX - (stageRect?.left || 0) - dragOffset.x;
      let newY = clientY - (stageRect?.top || 0) - dragOffset.y;

      // If dragging an effect from canvasEffects
      const effectIndex = canvasEffects.findIndex(
        (ef) => ef.id === draggedImageId
      );
      if (effectIndex !== -1) {
        // Boundaries for effect icon
        const ef = canvasEffects[effectIndex];
        const minMargin = 5;
        newX = Math.max(
          minMargin,
          Math.min(newX, canvasSize.width - ef.width - minMargin)
        );
        newY = Math.max(
          minMargin,
          Math.min(newY, canvasSize.height - ef.height - minMargin)
        );

        setCanvasEffects((prev) => {
          const updated = [...prev];
          updated[effectIndex] = {
            ...updated[effectIndex],
            x: newX,
            y: newY,
            isDragging: true,
          };
          return updated;
        });
        return;
      }

      // Otherwise, it's a dragged uploaded image
      const currentImage = draggedImages.find(
        (img) => img.originalIndex === draggedImageId
      );
      const imageWidth = currentImage?.width || 100;
      const imageHeight = currentImage?.height || 100;

      newX = Math.max(0, Math.min(newX, canvasSize.width - imageWidth));
      newY = Math.max(0, Math.min(newY, canvasSize.height - imageHeight));

      // Update image position
      setDraggedImages((prevImages) =>
        prevImages.map((img) =>
          img.originalIndex === draggedImageId
            ? { ...img, x: newX, y: newY }
            : img
        )
      );

      // Also update konva images
      setKonvaImages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((u) => u.id === draggedImageId);
        if (idx !== -1) {
          updated[idx].x = newX;
          updated[idx].y = newY;
        }
        return updated;
      });
    };

    const handleEnd = () => {
      // If effect was being dragged, check drop on any uploaded image
      if (draggedImageId != null) {
        const effectIndex = canvasEffects.findIndex(
          (ef) => ef.id === draggedImageId
        );
        if (effectIndex !== -1) {
          const ef = canvasEffects[effectIndex];

          // Build list of target images (uploaded images) with positions from draggedImages
          const targets = draggedImages
            .filter((d) => d.originalIndex !== 0) // skip base canvas image
            .map((d) => ({
              originalIndex: d.originalIndex,
              x: d.x,
              y: d.y,
              width: d.width,
              height: d.height,
            }));

          // Find first target where effect intersects
          const hit = targets.find((t) => rectsIntersect(ef, t));
          if (hit) {
            const targetImage = uploadedMedia[hit.originalIndex];
            if (targetImage?.name) {
              console.log("Effect dropped on image:", targetImage.name);
            }
            // Apply effect URL to that uploaded image (store appliedEffect on draggedImages)
            setDraggedImages((prev) =>
              prev.map((img) =>
                img.originalIndex === hit.originalIndex
                  ? { ...img, appliedEffect: ef.gifUrl }
                  : img
              )
            );

            // Also sync into konvaImages if needed (so konva-layer images also know)
            setKonvaImages((prev) =>
              prev.map((k) =>
                k.id === hit.originalIndex
                  ? { ...k, appliedEffect: ef.gifUrl }
                  : k
              )
            );

            // Remove the small effect icon from canvas (if you want to keep it, change this)
            setCanvasEffects((prev) => prev.filter((x) => x.id !== ef.id));
          } else {
            // If not dropped on a target, just clear isDragging
            setCanvasEffects((prev) =>
              prev.map((x) =>
                x.id === ef.id ? { ...x, isDragging: false } : x
              )
            );
          }
        }
      }

      setIsDragging(false);
      setDraggedImageId(null);
    };

    if (isDragging) {
      if (isMobile) {
        document.addEventListener("touchmove", handleMove, { passive: false });
        document.addEventListener("touchend", handleEnd, { passive: false });
        return () => {
          document.removeEventListener("touchmove", handleMove);
          document.removeEventListener("touchend", handleEnd);
        };
      } else {
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
        return () => {
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleEnd);
        };
      }
    }
  }, [
    isDragging,
    draggedImageId,
    dragOffset,
    isMobile,
    draggedImages,
    canvasEffects,
    canvasSize,
  ]);

  // Handle context menu hiding when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        hideContextMenu();
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu.visible]);

  const handleStart = (e, imageIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    // Get coordinates from mouse or touch event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });

    setIsDragging(true);
    setDraggedImageId(imageIndex);

    // CORRECTED: Use proper Konva layering instead of zIndex
    const stage = stageRef.current;
    const layer = stage?.getLayers()[1]; // editable layer
    const targetNode = layer?.findOne(`#image-${imageIndex}`);
    if (targetNode) {
      // Move to front when starting drag
      moveToFront(targetNode, layer);
    }
  };
  const moveToFront = (node, layer) => {
    node.moveToTop();
    layer.batchDraw();
  };

  const moveToBack = (node, layer) => {
    node.moveToBottom();
    layer.batchDraw();
  };

  const moveForward = (node, layer) => {
    node.moveUp();
    layer.batchDraw();
  };

  const moveBackward = (node, layer) => {
    node.moveDown();
    layer.batchDraw();
  };

  // Handle click outside to deselect
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedMediaIndex(null);
      setSelectedImages([]);
      setGroupedImages([]);
    }
    hideContextMenu();
  };

  // Handle drag selection start
  const handleSelectionStart = (e) => {
    // Only start selection if clicking on empty stage area AND within canvas boundaries AND base image exists
    if (e.target === e.target.getStage() && konvaImages[0]?.konvaImg) {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();

      // Check if click is within canvas boundaries (base image area)
      if (
        pos.x >= 0 &&
        pos.x <= canvasSize.width &&
        pos.y >= 0 &&
        pos.y <= canvasSize.height
      ) {
        setIsSelecting(true);
        setSelectionRect({
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
        });
        setSelectedImages([]);
      }
    }
  };

  // Handle drag selection move
  const handleSelectionMove = (e) => {
    if (!isSelecting) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const startX = selectionRect.x;
    const startY = selectionRect.y;

    // Constrain selection rectangle within canvas boundaries
    const constrainedX = Math.max(0, Math.min(pos.x, canvasSize.width));
    const constrainedY = Math.max(0, Math.min(pos.y, canvasSize.height));

    setSelectionRect({
      x: Math.min(startX, constrainedX),
      y: Math.min(startY, constrainedY),
      width: Math.abs(constrainedX - startX),
      height: Math.abs(constrainedY - startY),
    });

    // Check which images intersect with selection rectangle
    const currentRect = {
      x: Math.min(startX, constrainedX),
      y: Math.min(startY, constrainedY),
      width: Math.abs(constrainedX - startX),
      height: Math.abs(constrainedY - startY),
    };

    const intersectingImages = konvaImages
      .slice(1) // Skip base image
      .filter((item) => {
        if (!item.konvaImg) return false;
        return rectsIntersect(currentRect, {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
        });
      })
      .map((item) => item.id);

    setSelectedImages(intersectingImages);
  };

  // Handle drag selection end
  const handleSelectionEnd = (e) => {
    if (!isSelecting) return;

    setIsSelecting(false);
    setSelectionRect({ x: 0, y: 0, width: 0, height: 0 });

    // If multiple images selected, create a group
    if (selectedImages.length > 1) {
      setGroupedImages(selectedImages);
      setSelectedMediaIndex(null); // Clear individual selection
    } else if (selectedImages.length === 1) {
      setSelectedMediaIndex(selectedImages[0]);
      setGroupedImages([]); // Clear group
    } else {
      setSelectedMediaIndex(null);
      setGroupedImages([]);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`flex-1 bg-[#121018] relative flex flex-col rounded-xl overflow-hidden ${
        isMobile ? "mx-0 my-0 min-h-0" : "mx-2 my-2"
      }`}
      style={
        isMobile
          ? {
              height: "calc(100vh - 120px)",
              maxHeight: "calc(100vh - 120px)",
            }
          : {}
      }
    >
      <div className="flex-1 bg-[#121018] flex items-center justify-center relative rounded-xl overflow-hidden">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onMouseDown={handleSelectionStart}
          onTouchStart={handleSelectionStart}
          onMouseMove={handleSelectionMove}
          onTouchMove={handleSelectionMove}
          onMouseUp={handleSelectionEnd}
          onTouchEnd={handleSelectionEnd}
        >
          {/* Fixed Background Layer - Base Image */}
          <Layer>
            {konvaImages[0]?.konvaImg && (
              <KonvaImage
                image={konvaImages[0].konvaImg}
                x={0}
                y={0}
                width={konvaImages[0].width}
                height={konvaImages[0].height}
                listening={false}
              />
            )}
          </Layer>

          {/* Editable Layers - Other Images with Transformer */}
          <Layer>
            {/* Render grouped images */}
            {groupedImages.length > 0 && (
              <Group
                id="image-group"
                draggable
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();
                  setKonvaImages((prev) => {
                    const updated = [...prev];
                    groupedImages.forEach((imageId) => {
                      const idx = updated.findIndex(
                        (img) => img.id === imageId
                      );
                      if (idx !== -1) {
                        updated[idx].x += x;
                        updated[idx].y += y;
                      }
                    });
                    return updated;
                  });
                  setDraggedImages((prev) =>
                    prev.map((img) => {
                      if (groupedImages.includes(img.originalIndex)) {
                        return { ...img, x: img.x + x, y: img.y + y };
                      }
                      return img;
                    })
                  );
                  e.target.position({ x: 0, y: 0 });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();

                  // Get the transformation matrix to properly calculate new positions
                  const transform = node.getTransform().copy();

                  // Reset node transformations
                  node.scaleX(1);
                  node.scaleY(1);
                  node.rotation(0);
                  node.x(0);
                  node.y(0);

                  // Update both state arrays with proper transformations
                  setKonvaImages((prev) => {
                    const updated = [...prev];
                    groupedImages.forEach((imageId) => {
                      const idx = updated.findIndex(
                        (img) => img.id === imageId
                      );
                      if (idx !== -1) {
                        const item = updated[idx];

                        // Apply transformation to the original position
                        const point = transform.point({ x: item.x, y: item.y });

                        updated[idx] = {
                          ...item,
                          x: point.x,
                          y: point.y,
                          width: Math.max(5, item.width * scaleX),
                          height: Math.max(5, item.height * scaleY),
                          rotation: item.rotation + rotation,
                        };
                      }
                    });
                    return updated;
                  });

                  setDraggedImages((prev) =>
                    prev.map((img) => {
                      if (groupedImages.includes(img.originalIndex)) {
                        // Apply transformation to the original position
                        const point = transform.point({ x: img.x, y: img.y });

                        return {
                          ...img,
                          x: point.x,
                          y: point.y,
                          width: Math.max(5, img.width * scaleX),
                          height: Math.max(5, img.height * scaleY),
                          rotation: img.rotation + rotation,
                        };
                      }
                      return img;
                    })
                  );
                }}
              >
                {groupedImages.map((imageId) => {
                  const item = konvaImages.find((img) => img.id === imageId);
                  if (!item || !item.konvaImg) return null;
                  return (
                    <KonvaImage
                      key={imageId}
                      id={`image-${imageId}`}
                      image={item.konvaImg}
                      x={item.x}
                      y={item.y}
                      width={item.width}
                      height={item.height}
                      rotation={item.rotation}
                      stroke="#4f46e5"
                      strokeWidth={3}
                    />
                  );
                })}
              </Group>
            )}

            {/* Render non-grouped images - UPDATED: Set initial zIndex for new images */}
            {konvaImages.slice(1).map((item, index) => {
              const actualIndex = index + 1;
              const isSelected =
                selectedMediaIndex === actualIndex ||
                selectedImages.includes(actualIndex);
              const isGrouped = groupedImages.includes(actualIndex);

              // Don't render if it's part of a group
              if (isGrouped) return null;

              return (
                <KonvaImage
                  key={actualIndex}
                  id={`image-${actualIndex}`}
                  image={item.konvaImg}
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  rotation={item.rotation}
                  onClick={() => setSelectedMediaIndex(actualIndex)}
                  onTap={() => setSelectedMediaIndex(actualIndex)}
                  onDragStart={() => setSelectedMediaIndex(actualIndex)}
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    const pointerPosition = stage.getPointerPosition();
                    setContextMenu({
                      visible: true,
                      x: pointerPosition.x,
                      y: pointerPosition.y,
                      targetImageId: actualIndex,
                    });
                  }}
                  draggable={
                    !konvaImages.find((img) => img.id === actualIndex)?.locked
                  }
                  onDragMove={(e) => {
                    const node = e.target;
                    const newX = node.x();
                    const newY = node.y();
                    setDraggedImages((prev) =>
                      prev.map((img) =>
                        img.originalIndex === actualIndex
                          ? { ...img, x: newX, y: newY }
                          : img
                      )
                    );
                    const rectKonva = node.getClientRect({
                      skipTransform: false,
                    });

                    const rect = {
                      x: rectKonva.x,
                      y: rectKonva.y,
                      width: rectKonva.width,
                      height: rectKonva.height,
                      nodeX: node.x(),
                      nodeY: node.y(),
                    };

                    // Candidate vertical and horizontal lines
                    const canvasVertical = [
                      0,
                      canvasSize.width / 2,
                      canvasSize.width,
                    ];
                    const canvasHorizontal = [
                      0,
                      canvasSize.height / 2,
                      canvasSize.height,
                    ];

                    // Other images' edges/centers
                    const otherRects = konvaImages
                      .slice(1)
                      .filter((_, i) => i + 1 !== actualIndex)
                      .map((it) => {
                        if (!it.konvaImg) return null;
                        return {
                          x: it.x,
                          y: it.y,
                          width: it.width,
                          height: it.height,
                        };
                      })
                      .filter(Boolean);

                    const otherVertical = [];
                    const otherHorizontal = [];
                    otherRects.forEach((r) => {
                      otherVertical.push(r.x, r.x + r.width / 2, r.x + r.width);
                      otherHorizontal.push(
                        r.y,
                        r.y + r.height / 2,
                        r.y + r.height
                      );
                    });

                    const verticalCandidates = [
                      ...canvasVertical,
                      ...otherVertical,
                    ];
                    const horizontalCandidates = [
                      ...canvasHorizontal,
                      ...otherHorizontal,
                    ];

                    const snapX = getSnapAdjustment(
                      rect,
                      verticalCandidates,
                      "x"
                    );
                    const snapY = getSnapAdjustment(
                      rect,
                      horizontalCandidates,
                      "y"
                    );

                    const newGuides = { vertical: [], horizontal: [] };
                    const newPos = { x: node.x(), y: node.y() };

                    if (snapX) {
                      newGuides.vertical.push(snapX.snapLine);
                      newPos.x = snapX.newPos.x;
                    }
                    if (snapY) {
                      newGuides.horizontal.push(snapY.snapLine);

                      newPos.y = snapY.newPos.y;
                    }

                    setGuides(newGuides);
                    node.position(newPos);
                  }}
                  onDragEnd={(e) => {
                    const { x, y } = e.target.position();
                    setGuides({ vertical: [], horizontal: [] });
                    setKonvaImages((prev) => {
                      const updated = [...prev];
                      updated[actualIndex].x = x;
                      updated[actualIndex].y = y;
                      return updated;
                    });
                    // Sync with draggedImages
                    setDraggedImages((prev) =>
                      prev.map((img) =>
                        img.originalIndex === actualIndex
                          ? { ...img, x, y }
                          : img
                      )
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    node.scaleX(1);
                    node.scaleY(1);

                    setKonvaImages((prev) => {
                      const updated = [...prev];
                      updated[actualIndex] = {
                        ...updated[actualIndex],
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY),
                        rotation,
                      };
                      return updated;
                    });

                    // Sync with draggedImages
                    setDraggedImages((prev) =>
                      prev.map((img) =>
                        img.originalIndex === actualIndex
                          ? {
                              ...img,
                              x: node.x(),
                              y: node.y(),
                              width: Math.max(5, node.width() * scaleX),
                              height: Math.max(5, node.height() * scaleY),
                              rotation,
                            }
                          : img
                      )
                    );
                  }}
                />
              );
            })}
          </Layer>

          <Layer>
            {/* Transformer for selected images */}
            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
                "top-center",
                "bottom-center",
              ]}
              borderStroke="#8088e2"
              borderStrokeWidth={2}
              anchorFill="#8088e2"
              anchorCornerRadius={4}
              anchorStroke="#8088e2"
              anchorSize={9}
              rotationSnaps={[0, 90, 180, 270]}
              rotateLineVisible={false}
              rotateAnchorOffset={15}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
          {/* Guides Layer - drawn on top when dragging */}
          <Layer listening={false}>
            {guides.vertical.map((x) => (
              <Line
                key={`v-${x}`}
                points={[x, 0, x, canvasSize.height]}
                stroke="#4f46e5"
                strokeWidth={1}
              />
            ))}
            {guides.horizontal.map((y) => (
              <Line
                key={`h-${y}`}
                points={[0, y, canvasSize.width, y]}
                stroke="#4f46e5"
                strokeWidth={1}
              />
            ))}

            {/* Selection Rectangle */}
            {isSelecting &&
              selectionRect.width > 0 &&
              selectionRect.height > 0 && (
                <Rect
                  x={selectionRect.x}
                  y={selectionRect.y}
                  width={selectionRect.width}
                  height={selectionRect.height}
                  fill="rgba(79, 70, 229, 0.1)"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              )}
          </Layer>
        </Stage>

        {/* Render small draggable effect icons (HTML) */}
        {canvasEffects.map((ef) => {
          // Force effect to stay within canvas boundaries with minimum margin
          const minMargin = 5; // Minimum margin from edges
          const clampedX = Math.max(
            minMargin,
            Math.min(ef.x, canvasSize.width - ef.width - minMargin)
          );
          const clampedY = Math.max(
            minMargin,
            Math.min(ef.y, canvasSize.height - ef.height - minMargin)
          );

          // Calculate Stage offset within the centered container
          const containerRect = canvasRef.current?.getBoundingClientRect();
          const stageElement = stageRef.current?.getStage().container();
          const stageRect = stageElement?.getBoundingClientRect();
          const stageOffsetX =
            stageRect && containerRect
              ? stageRect.left - containerRect.left
              : 0;
          const stageOffsetY =
            stageRect && containerRect ? stageRect.top - containerRect.top : 0;

          // Position effect relative to Stage position
          const finalX = stageOffsetX + clampedX;
          const finalY = stageOffsetY + clampedY;

          // Debug logging
          if (ef.x !== clampedX || ef.y !== clampedY) {
            console.log(
              `Effect ${ef.id} clamped from (${ef.x}, ${ef.y}) to (${clampedX}, ${clampedY})`
            );
            console.log(
              `Stage offset: (${stageOffsetX}, ${stageOffsetY}), Final position: (${finalX}, ${finalY})`
            );
          }

          return (
            <div
              key={ef.id}
              className={`absolute rounded-lg overflow-hidden shadow-lg transition-transform ${
                ef.isDragging ? "scale-105 z-50" : "z-40"
              }`}
              style={{
                left: finalX,
                top: finalY,
                width: ef.width,
                height: ef.height,
                pointerEvents: "auto",
                touchAction: "none",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const canvasRect = canvasRef.current.getBoundingClientRect();
                const stageElement = stageRef.current?.getStage().container();
                const stageRect = stageElement?.getBoundingClientRect();

                setDragOffset({
                  x: e.clientX - ef.x - (stageRect?.left || 0),
                  y: e.clientY - ef.y - (stageRect?.top || 0),
                });
                setIsDragging(true);
                setDraggedImageId(ef.id);
                setCanvasEffects((prev) =>
                  prev.map((x) =>
                    x.id === ef.id ? { ...x, isDragging: true } : x
                  )
                );
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const clientX = e.touches[0].clientX;
                const clientY = e.touches[0].clientY;
                const canvasRect = canvasRef.current.getBoundingClientRect();
                const stageElement = stageRef.current?.getStage().container();
                const stageRect = stageElement?.getBoundingClientRect();

                setDragOffset({
                  x: clientX - ef.x - (stageRect?.left || 0),
                  y: clientY - ef.y - (stageRect?.top || 0),
                });
                setIsDragging(true);
                setDraggedImageId(ef.id);
                setCanvasEffects((prev) =>
                  prev.map((x) =>
                    x.id === ef.id ? { ...x, isDragging: true } : x
                  )
                );
              }}
            >
              <img
                src={ef.gifUrl}
                alt="ef"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
          );
        })}

        {/* Render applied effects for images (if any) */}
        {draggedImages.map((img) => {
          if (!img.appliedEffect) return null;
          return (
            <EffectOverlay
              key={`applied-${img.originalIndex}`}
              effectUrl={img.appliedEffect}
              target={img}
            />
          );
        })}

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            className="absolute bg-white rounded-sm shadow-lg border border-gray-200 py-1 min-w-[10px] z-[9999]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onMouseLeave={hideContextMenu}
          >
            {/* Main Actions */}
            <div>
              <button
                className="flex items-center w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
                onClick={() => handleContextMenuAction("lock")}
              >
                {konvaImages.find((img) => img.id === contextMenu.targetImageId)
                  ?.locked ? (
                  <Unlock className="w-4 h-4 text-gray-600 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600 mr-2" />
                )}
                <span>
                  {konvaImages.find(
                    (img) => img.id === contextMenu.targetImageId
                  )?.locked
                    ? "Unlock"
                    : "Lock"}
                </span>
              </button>

              <button
                className="flex items-center w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
                onClick={() => handleContextMenuAction("duplicate")}
              >
                <Copy className="w-4 h-4 text-gray-600 mr-2" />
                <span>Duplicate</span>
              </button>

              <button
                className="flex items-center w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
                onClick={() => handleContextMenuAction("remove")}
              >
                <Trash2 className="w-4 h-4 text-gray-600 mr-2" />
                <span>Remove</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-1 mx-1"></div>

            {/* Layering Section */}
            <div>
              <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded cursor-pointer">
                <div className="flex items-center">
                  <Layers className="w-4 h-4 text-gray-600 mr-2" />
                  <span>Layering</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </div>

              <div className="ml-6 space-y-0.5">
                <button
                  className="flex items-center w-full px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors rounded"
                  onClick={() => handleContextMenuAction("to-front")}
                >
                  <ChevronsUp className="w-3 h-3 text-gray-500 mr-2" />
                  <span>To Front</span>
                </button>

                <button
                  className="flex items-center w-full px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors rounded"
                  onClick={() => handleContextMenuAction("forward")}
                >
                  <ChevronUp className="w-3 h-3 text-gray-500 mr-2" />
                  <span>Forward</span>
                </button>

                <button
                  className="flex items-center w-full px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors rounded"
                  onClick={() => handleContextMenuAction("backward")}
                >
                  <ChevronDown className="w-3 h-3 text-gray-500 mr-2" />
                  <span>Backward</span>
                </button>

                <button
                  className="flex items-center w-full px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors rounded"
                  onClick={() => handleContextMenuAction("to-back")}
                >
                  <ChevronsDown className="w-3 h-3 text-gray-500 mr-2" />
                  <span>To back</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom centered element - Only show on desktop */}
      {!isMobile && (
        <div className="absolute bg-[#0d0b13] h-12 px-40 rounded-lg bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          {/* Timeline or other controls can go here */}
        </div>
      )}
    </div>
  );
};

export default MainCanvas;
