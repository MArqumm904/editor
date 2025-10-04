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
  X,
} from "lucide-react";
import VideoExportLoader from "./VideoExportLoader"; // Adjust path as needed

const MainCanvas = ({
  uploadedMedia,
  selectedMediaIndex,
  setSelectedMediaIndex,
  activeEffect,
  isMobile = false,
  onRemoveMedia,
  onImageEffectChange,
  animationOverlays = [],
  onAnimationOverlayRemove,
  onAnimationOverlayAdd,
}) => {
  const getAbsXY = (node) => {
    if (!node) return { x: 0, y: 0 };
    // Konva compatibility (old/new)
    const p =
      typeof node.getAbsolutePosition === "function"
        ? node.getAbsolutePosition()
        : node.absolutePosition(); // getter
    return { x: Math.round(p.x), y: Math.round(p.y) };
  };

  // ----- UPDATED EffectOverlay (now accepts effectUrl + target) -----
  const EffectOverlay = ({ effectUrl, target }) => {
    if (!effectUrl || !target) return null;
    const isStaticImage =
      effectUrl &&
      !effectUrl.includes(".gif") &&
      !effectUrl.includes("giphy.com");

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
          opacity: isStaticImage ? 0.7 : 0.45,
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
            mixBlendMode: isStaticImage ? "normal" : "screen",
            marginLeft: -effectOffsetX,
            marginTop: -effectOffsetY,
          }}
        />
      </div>
    );
  };

  const [draggedImages, setDraggedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [konvaImages, setKonvaImages] = useState([]);
  const canvasRef = useRef(null);
  const stageRef = useRef();
  const transformerRef = useRef();
  const [guides, setGuides] = useState({ vertical: [], horizontal: [] });
  // === NEW: Eraser functionality ===
  const [eraserMode, setEraserMode] = useState({
    active: false,
    targetId: null,
  });
  const [eraserBrushSize, setEraserBrushSize] = useState(20);
  const [isErasing, setIsErasing] = useState(false);
  const eraserCanvasRef = useRef(null);
  const eraserCtxRef = useRef(null);
  const [canvasEffects, setCanvasEffects] = useState([]);
  const [showEffectHint, setShowEffectHint] = useState(false);
  const [warpMode, setWarpMode] = useState({ active: false, targetId: null });
  const [warpCorners, setWarpCorners] = useState([]); // [{x,y} * 4]
  const [warpDragIndex, setWarpDragIndex] = useState(null);
  const warpCanvasRef = useRef(null);
  const [zoomMode, setZoomMode] = useState(null); // 'zoom-in' or 'zoom-out'
  const [imageZoomLevels, setImageZoomLevels] = useState({}); // {imageId: {scale: 1, offsetX: 0, offsetY: 0}}
  const [exportLoading, setExportLoading] = useState(false);
  const [copiedImageData, setCopiedImageData] = useState(null);
  const A4_WIDTH = 1123;
  const A4_HEIGHT = 794;

  const exitWarpMode = useCallback(() => {
    setWarpMode({ active: false, targetId: null });
    setWarpCorners([]);
    setWarpDragIndex(null);
  }, []);

  // === NEW: Eraser mode functions ===
  // === NEW: Eraser mode functions ===
  const enterEraserMode = useCallback(() => {
    const targetId = selectedMediaIndex;
    if (targetId === null || targetId === undefined) return; // must have a selected image

    const target = konvaImages.find((img) => img.id === targetId);
    if (!target || !target.konvaImg) return;

    setEraserMode({ active: true, targetId });

    // Initialize eraser canvas on next frame to ensure DOM is ready
    setTimeout(() => {
      const canvas = eraserCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      canvas.width = target.width;
      canvas.height = target.height;

      // Draw the original image onto the eraser canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(target.konvaImg, 0, 0, canvas.width, canvas.height);

      eraserCtxRef.current = ctx;
    }, 0);
  }, [selectedMediaIndex, konvaImages]);

  const exitEraserMode = useCallback(() => {
    setEraserMode({ active: false, targetId: null });
    setIsErasing(false);
    eraserCtxRef.current = null;
  }, []);

  const applyEraser = useCallback(() => {
    if (!eraserMode.active || !eraserMode.targetId || !eraserCanvasRef.current)
      return;

    const canvas = eraserCanvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");

    const newImg = new window.Image();
    newImg.onload = () => {
      // Update konvaImages with erased version
      setKonvaImages((prev) =>
        prev.map((img) =>
          img.id === eraserMode.targetId ? { ...img, konvaImg: newImg } : img
        )
      );

      // **YEH ADD KARO** - Force layer redraw
      setTimeout(() => {
        const stage = stageRef.current;
        if (stage) {
          const layer = stage.getLayers()[1]; // editable layer
          if (layer) {
            layer.batchDraw(); // Force redraw with new image
          }
        }
      }, 100);

      exitEraserMode();
    };
    newImg.src = dataUrl;
  }, [eraserMode, exitEraserMode]);

  const startErasing = useCallback(
    (e) => {
      if (!eraserMode.active || !eraserCtxRef.current) return;

      setIsErasing(true);

      const canvas = eraserCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = eraserCtxRef.current;

      const getCoords = (event) => {
        const clientX = event.touches
          ? event.touches[0].clientX
          : event.clientX;
        const clientY = event.touches
          ? event.touches[0].clientY
          : event.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      };

      const coords = getCoords(e);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, eraserBrushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    },
    [eraserMode.active, eraserBrushSize]
  );

  const continueErasing = useCallback(
    (e) => {
      if (!isErasing || !eraserCtxRef.current) return;

      const canvas = eraserCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = eraserCtxRef.current;

      const getCoords = (event) => {
        const clientX = event.touches
          ? event.touches[0].clientX
          : event.clientX;
        const clientY = event.touches
          ? event.touches[0].clientY
          : event.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      };

      const coords = getCoords(e);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, eraserBrushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    },
    [isErasing, eraserBrushSize]
  );

  const stopErasing = useCallback(() => {
    setIsErasing(false);
  }, []);

  // Zoom functionality - zooms within image boundaries without changing container size
  const handleZoomClick = useCallback(
    (imageId, clickX, clickY) => {
      if (
        !zoomMode ||
        selectedMediaIndex === null ||
        selectedMediaIndex === undefined
      ) {
        return;
      }

      const currentZoom = imageZoomLevels[imageId] || {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      };
      const zoomFactor = zoomMode === "zoom-in" ? 1.2 : 0.8;
      const newScale = Math.max(1, Math.min(5, currentZoom.scale * zoomFactor)); // Don't go below 1

      // If zoom out and already at scale 1, don't do anything
      if (zoomMode === "zoom-out" && currentZoom.scale <= 1) return;

      // Calculate the click position relative to the image
      const image = konvaImages.find((img) => img.id === imageId);
      if (!image || !image.konvaImg) return;

      // Calculate relative position within the image (0 to 1)
      const relativeX = (clickX - image.x) / image.width;
      const relativeY = (clickY - image.y) / image.height;

      // Calculate the source image dimensions
      const sourceWidth = image.konvaImg.width;
      const sourceHeight = image.konvaImg.height;

      // Calculate how much the crop area should move based on the click position
      const currentCropWidth = sourceWidth / currentZoom.scale;
      const currentCropHeight = sourceHeight / currentZoom.scale;
      const newCropWidth = sourceWidth / newScale;
      const newCropHeight = sourceHeight / newScale;

      // Calculate the difference in crop size
      const cropWidthDiff = newCropWidth - currentCropWidth;
      const cropHeightDiff = newCropHeight - currentCropHeight;

      // Calculate new offset based on click position (inverted for proper direction)
      const newOffsetX =
        currentZoom.offsetX - (relativeX - 0.5) * cropWidthDiff;
      const newOffsetY =
        currentZoom.offsetY - (relativeY - 0.5) * cropHeightDiff;

      setImageZoomLevels((prev) => ({
        ...prev,
        [imageId]: {
          scale: newScale,
          offsetX: newOffsetX,
          offsetY: newOffsetY,
        },
      }));
    },
    [zoomMode, selectedMediaIndex, imageZoomLevels, konvaImages]
  );

  const exitZoomMode = useCallback(() => {
    setZoomMode(null);
  }, []);

  const applyWarp = useCallback(() => {
    if (!warpMode.active || warpMode.targetId == null) return;
    const target = konvaImages.find((img) => img.id === warpMode.targetId);
    if (!target || !target.konvaImg) return;

    // Compute bounding box of the warped quad
    const minX = Math.floor(Math.min(...warpCorners.map((c) => c.x)));
    const minY = Math.floor(Math.min(...warpCorners.map((c) => c.y)));
    const maxX = Math.ceil(Math.max(...warpCorners.map((c) => c.x)));
    const maxY = Math.ceil(Math.max(...warpCorners.map((c) => c.y)));
    const outW = Math.max(1, maxX - minX);
    const outH = Math.max(1, maxY - minY);

    const img = target.konvaImg;
    const sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;

    const off = document.createElement("canvas");
    off.width = outW;
    off.height = outH;
    const ctx = off.getContext("2d");
    ctx.clearRect(0, 0, outW, outH);

    const p0 = { x: warpCorners[0].x - minX, y: warpCorners[0].y - minY };
    const p1 = { x: warpCorners[1].x - minX, y: warpCorners[1].y - minY };
    const p2 = { x: warpCorners[2].x - minX, y: warpCorners[2].y - minY };
    const p3 = { x: warpCorners[3].x - minX, y: warpCorners[3].y - minY };

    const drawTriangle = (pA, pB, pC, srcTri) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.closePath();
      ctx.clip();

      const denom =
        srcTri[0] * (srcTri[3] - srcTri[5]) +
        srcTri[2] * (srcTri[5] - srcTri[1]) +
        srcTri[4] * (srcTri[1] - srcTri[3]);
      if (denom === 0) {
        ctx.restore();
        return;
      }

      const a =
        (pA.x * (srcTri[3] - srcTri[5]) +
          pB.x * (srcTri[5] - srcTri[1]) +
          pC.x * (srcTri[1] - srcTri[3])) /
        denom;
      const b =
        (pA.x * (srcTri[4] - srcTri[2]) +
          pB.x * (srcTri[0] - srcTri[4]) +
          pC.x * (srcTri[2] - srcTri[0])) /
        denom;
      const c =
        (pA.x * (srcTri[2] * srcTri[5] - srcTri[4] * srcTri[3]) +
          pB.x * (srcTri[4] * srcTri[1] - srcTri[0] * srcTri[5]) +
          pC.x * (srcTri[0] * srcTri[3] - srcTri[2] * srcTri[1])) /
        denom;
      const d =
        (pA.y * (srcTri[3] - srcTri[5]) +
          pB.y * (srcTri[5] - srcTri[1]) +
          pC.y * (srcTri[1] - srcTri[3])) /
        denom;
      const e =
        (pA.y * (srcTri[4] - srcTri[2]) +
          pB.y * (srcTri[0] - srcTri[4]) +
          pC.y * (srcTri[2] - srcTri[0])) /
        denom;
      const f =
        (pA.y * (srcTri[2] * srcTri[5] - srcTri[4] * srcTri[3]) +
          pB.y * (srcTri[4] * srcTri[1] - srcTri[0] * srcTri[5]) +
          pC.y * (srcTri[0] * srcTri[3] - srcTri[2] * srcTri[1])) /
        denom;

      ctx.setTransform(a, d, b, e, c, f);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      ctx.restore();
    };

    drawTriangle(p0, p1, p2, [0, 0, sw, 0, sw, sh]);
    drawTriangle(p0, p2, p3, [0, 0, sw, sh, 0, sh]);

    const dataUrl = off.toDataURL("image/png");
    const newImg = new window.Image();
    newImg.onload = () => {
      setKonvaImages((prev) =>
        prev.map((k) =>
          k.id === warpMode.targetId
            ? {
                ...k,
                konvaImg: newImg,
                x: minX,
                y: minY,
                width: outW,
                height: outH,
                rotation: 0,
              }
            : k
        )
      );

      setDraggedImages((prev) =>
        prev.map((d) =>
          d.originalIndex === warpMode.targetId
            ? { ...d, x: minX, y: minY, width: outW, height: outH, rotation: 0 }
            : d
        )
      );

      setSelectedMediaIndex(warpMode.targetId);
      exitWarpMode();
    };
    newImg.src = dataUrl;
  }, [warpMode, warpCorners, konvaImages, exitWarpMode, setSelectedMediaIndex]);

  // Enter eraser mode from external trigger (e.g., LeftSidebar Eraser icon)
  useEffect(() => {
    const handleEnterEraser = () => {
      if (eraserMode.active) return;
      enterEraserMode();
    };

    window.addEventListener("enterEraserMode", handleEnterEraser);
    return () =>
      window.removeEventListener("enterEraserMode", handleEnterEraser);
  }, [eraserMode.active, enterEraserMode]);

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

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetImageId: null,
  });

  const lastActiveEffectRef = useRef(null);

  // --- VIDEO EXPORT FUNCTION ---
  // === Data URL helpers (put at module scope) ===
  const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
  const isBlobUrl = (s) => typeof s === "string" && s.startsWith("blob:");

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  const estimateSizeFromDataURL = (dataUrl) => {
    const i = dataUrl.indexOf(",");
    if (i === -1) return 0;
    const base64 = dataUrl.slice(i + 1);
    return Math.floor((base64.length * 3) / 4);
  };

  async function urlToDataPayload(url) {
    if (!url) return { dataUrl: null, size: 0, type: "", success: false };

    if (isDataUrl(url)) {
      return {
        dataUrl: url,
        size: estimateSizeFromDataURL(url),
        type: "",
        success: true,
      };
    }

    if (isBlobUrl(url)) {
      try {
        console.log(`Converting blob URL: ${url}`);
        const resp = await fetch(url);
        if (!resp.ok) {
          console.warn(`Failed to fetch blob ${url}: ${resp.status}`);
          return { dataUrl: null, size: 0, type: "", success: false };
        }
        const blob = await resp.blob();
        const dataUrl = await blobToDataURL(blob);
        console.log(
          `Successfully converted blob URL to data URL (size: ${blob.size})`
        );
        return {
          dataUrl,
          size: blob.size,
          type: blob.type || "",
          success: true,
        };
      } catch (error) {
        console.error(`Error converting blob URL ${url}:`, error);
        return { dataUrl: null, size: 0, type: "", success: false };
      }
    }

    // Handle HTTP/HTTPS URLs
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`Failed to fetch ${url}: ${resp.status}`);
        return { dataUrl: null, size: 0, type: "", success: false };
      }
      const blob = await resp.blob();
      const dataUrl = await blobToDataURL(blob);
      return {
        dataUrl,
        size: blob.size,
        type: blob.type || "",
        success: true,
      };
    } catch (error) {
      console.warn(`Error fetching ${url}:`, error.message);
      return { dataUrl: null, size: 0, type: "", success: false };
    }
  }

  async function convertExportUrlsToData(exportData) {
    const tasks = [];
    const failedConversions = [];

    // Background image
    if (exportData.backgroundImage?.media?.preview) {
      tasks.push(
        (async () => {
          const p = await urlToDataPayload(
            exportData.backgroundImage.media.preview
          );
          if (p.success && p.dataUrl) {
            exportData.backgroundImage.media.preview = p.dataUrl;
            if (!exportData.backgroundImage.media.type && p.type)
              exportData.backgroundImage.media.type = p.type;
            if (!exportData.backgroundImage.media.size)
              exportData.backgroundImage.media.size = p.size;
          } else {
            failedConversions.push(
              `background image: ${exportData.backgroundImage.media.preview}`
            );
            console.error("Failed to convert background image URL to data URL");
          }
        })()
      );
    }

    // Overlay images
    for (const img of exportData.overlayImages || []) {
      if (img?.media?.preview) {
        tasks.push(
          (async () => {
            const p = await urlToDataPayload(img.media.preview);
            if (p.success && p.dataUrl) {
              img.media.preview = p.dataUrl;
              if (!img.media.type && p.type) img.media.type = p.type;
              if (!img.media.size) img.media.size = p.size;
            } else {
              failedConversions.push(
                `overlay image ${img.id}: ${img.media.preview}`
              );
              console.error(
                `Failed to convert overlay image ${img.id} URL to data URL`
              );
            }
          })()
        );
      }
    }

    // Canvas effects (gifUrl)
    for (const eff of exportData.canvasEffects || []) {
      if (eff?.gifUrl) {
        tasks.push(
          (async () => {
            const p = await urlToDataPayload(eff.gifUrl);
            if (p.success && p.dataUrl) {
              eff.gifUrl = p.dataUrl;
            } else {
              failedConversions.push(`canvas effect ${eff.id}: ${eff.gifUrl}`);
              console.error(
                `Failed to convert canvas effect ${eff.id} URL to data URL`
              );
              // Mark for removal
              eff._shouldRemove = true;
            }
          })()
        );
      }
    }

    // Image effects (effectUrl)
    for (const ie of exportData.imageEffects || []) {
      if (ie?.effectUrl) {
        tasks.push(
          (async () => {
            const p = await urlToDataPayload(ie.effectUrl);
            if (p.success && p.dataUrl) {
              ie.effectUrl = p.dataUrl;
            } else {
              failedConversions.push(
                `image effect ${ie.targetImageId}: ${ie.effectUrl}`
              );
              console.error(
                `Failed to convert image effect ${ie.targetImageId} URL to data URL`
              );
              // Mark for removal
              ie._shouldRemove = true;
            }
          })()
        );
      }
    }

    await Promise.all(tasks);

    // Remove failed conversions
    exportData.canvasEffects = (exportData.canvasEffects || []).filter(
      (eff) => !eff._shouldRemove
    );
    exportData.imageEffects = (exportData.imageEffects || []).filter(
      (ie) => !ie._shouldRemove
    );

    // Log failed conversions
    if (failedConversions.length > 0) {
      console.warn("Failed to convert the following URLs:", failedConversions);
    }

    return exportData;
  }

  const getDurationInMs = () => {
    const durationEvent = new CustomEvent("getDuration");
    window.dispatchEvent(durationEvent);
    return window.selectedDuration || 5000;
  };

  const exportCanvasAsVideo = async () => {
    const stage = stageRef.current;
    if (!stage) {
      console.error("Stage not available");
      return;
    }

    setExportLoading(true);

    try {
      const exportData = {
        canvasSize: {
          width: canvasSize.width,
          height: canvasSize.height,
        },
        backgroundImage: konvaImages[0]
          ? {
              id: konvaImages[0].id,
              media: {
                name: konvaImages[0].media?.name || "background",
                type: konvaImages[0].media?.type || "image/jpeg",
                preview: konvaImages[0].media?.preview,
                size: konvaImages[0].media?.size || 0,
              },
              position: {
                x: konvaImages[0].x || 0,
                y: konvaImages[0].y || 0,
              },
              dimensions: {
                width: konvaImages[0].width,
                height: konvaImages[0].height,
              },
              rotation: konvaImages[0].rotation || 0,
            }
          : null,
        overlayImages: konvaImages.slice(1).map((img, index) => {
          const draggedImg = draggedImages.find(
            (d) => d.originalIndex === img.id
          );
          let pos = { x: img.x, y: img.y };
          try {
            const stage = stageRef.current;
            const layer = stage?.getLayers()[1];
            const node = layer?.findOne(`#image-${img.id}`);
            if (node) pos = getAbsXY(node);
          } catch (_) {}

          return {
            id: img.id,
            originalIndex: img.id,
            layerIndex: index + 1, // Layer order
            media: {
              name: img.media?.name || `image-${img.id}`,
              type: img.media?.type || "image/jpeg",
              preview: img.media?.preview,
              size: img.media?.size || 0,
            },
            position: pos,
            dimensions: {
              width: img.width,
              height: img.height,
            },
            rotation: img.rotation || 0,
            transform: {
              scaleX: 1,
              scaleY: 1,
            },
            zoom: imageZoomLevels[img.id] || {
              scale: 1,
              offsetX: 0,
              offsetY: 0,
            },
            appliedEffect: draggedImg?.appliedEffect || null,
            locked: img.locked || false,
          };
        }),
        canvasEffects: canvasEffects.map((effect) => ({
          id: effect.id,
          gifUrl: effect.gifUrl,
          position: {
            x: effect.x,
            y: effect.y,
          },
          dimensions: {
            width: effect.width,
            height: effect.height,
          },
          isDragging: effect.isDragging,
        })),
        imageEffects: draggedImages
          .filter((img) => img.appliedEffect)
          .map((img) => {
            const konvaImg = konvaImages.find(
              (k) => k.id === img.originalIndex
            );
            const isStaticImage =
              img.appliedEffect &&
              !img.appliedEffect.includes(".gif") &&
              !img.appliedEffect.includes("giphy.com");

            return {
              targetImageId: img.originalIndex,
              effectUrl: img.appliedEffect,
              isStaticImage: isStaticImage,
              targetPosition: {
                x: img.x,
                y: img.y,
              },
              targetDimensions: {
                width: img.width,
                height: img.height,
              },
              targetRotation: img.rotation || 0,
              effectPosition: {
                x: img.x,
                y: img.y,
              },
              visibleArea: {
                width: Math.min(
                  img.width,
                  canvasSize.width - Math.max(0, img.x),
                  Math.max(0, img.x + img.width) - Math.max(0, img.x)
                ),
                height: Math.min(
                  img.height,
                  canvasSize.height - Math.max(0, img.y),
                  Math.max(0, img.y + img.height) - Math.max(0, img.y)
                ),
              },
              cropOffset: {
                x: Math.max(0, -img.x),
                y: Math.max(0, -img.y),
              },
              blendMode: isStaticImage ? "normal" : "screen",
              opacity: isStaticImage ? 0.7 : 0.45,
            };
          }),
        exportSettings: {
          format: "video",
          duration: getDurationInMs(),
          fps: 30,
          quality: "high",
          timestamp: new Date().toISOString(),
        },
        metadata: {
          totalImages: konvaImages.length,
          totalEffects:
            canvasEffects.length +
            draggedImages.filter((img) => img.appliedEffect).length,
          hasAnimatedEffects:
            draggedImages.some((img) => img.appliedEffect) ||
            canvasEffects.length > 0,
          canvasAspectRatio: canvasSize.width / canvasSize.height,
        },
      };

      // Debug logging
      draggedImages.forEach((img, index) => {
        if (img.appliedEffect) {
          console.log(`Image ${img.originalIndex}:`, {
            effectUrl: img.appliedEffect,
            isStatic:
              !img.appliedEffect.includes(".gif") &&
              !img.appliedEffect.includes("giphy.com"),
          });
        }
      });

      console.log("\n=== DOM EFFECTS DEBUG ===");
      canvasEffects.forEach((effect) => {
        console.log(`Canvas Effect ${effect.id}:`, {
          gifUrl: effect.gifUrl,
          position: { x: effect.x, y: effect.y },
          size: { width: effect.width, height: effect.height },
        });
      });

      console.log("Konva Image Position:", konvaImages[1]);
      console.log("Dragged Image Position:", draggedImages[1]);

      {
        const stage = stageRef.current;
        const layer = stage?.getLayers?.()[1];
        const node = layer?.findOne?.("#image-1");
        console.log("Actual Konva Node Position:", node?.position?.());
        console.log("Absolute Position via getAbsXY:", getAbsXY?.(node));
        console.log(
          "Absolute Position via getAbsolutePosition:",
          node?.getAbsolutePosition
            ? node.getAbsolutePosition()
            : node?.absolutePosition?.()
        );
      }

      console.log("Export data before conversion:", exportData);

      // Store original counts for comparison
      const originalCanvasEffects = canvasEffects.length;
      const originalImageEffects = draggedImages.filter(
        (img) => img.appliedEffect
      ).length;

      // Convert URLs to data URLs with enhanced error handling
      await convertExportUrlsToData(exportData);

      // Validate that critical assets were converted successfully
      if (
        exportData.backgroundImage &&
        exportData.backgroundImage.media.preview
      ) {
        if (exportData.backgroundImage.media.preview.startsWith("blob:")) {
          throw new Error(
            "Background image could not be converted from blob URL. Please try uploading the image again."
          );
        }
        if (
          !exportData.backgroundImage.media.preview.startsWith("data:") &&
          !exportData.backgroundImage.media.preview.startsWith("http")
        ) {
          throw new Error("Background image has invalid URL format.");
        }
      }

      // Check overlay images
      const failedOverlays = (exportData.overlayImages || []).filter(
        (img) =>
          img.media.preview &&
          (img.media.preview.startsWith("blob:") ||
            (!img.media.preview.startsWith("data:") &&
              !img.media.preview.startsWith("http")))
      );

      if (failedOverlays.length > 0) {
        console.warn(
          `${failedOverlays.length} overlay images could not be converted properly`
        );
        // Remove failed overlays
        exportData.overlayImages = exportData.overlayImages.filter(
          (img) => !failedOverlays.includes(img)
        );
      }

      // The convertExportUrlsToData function should have already filtered out failed effects
      // But let's do a final check and filter
      exportData.canvasEffects = exportData.canvasEffects.filter(
        (eff) =>
          eff.gifUrl &&
          !eff.gifUrl.startsWith("blob:") &&
          (eff.gifUrl.startsWith("data:") || eff.gifUrl.startsWith("http"))
      );

      exportData.imageEffects = exportData.imageEffects.filter(
        (ie) =>
          ie.effectUrl &&
          !ie.effectUrl.startsWith("blob:") &&
          (ie.effectUrl.startsWith("data:") || ie.effectUrl.startsWith("http"))
      );

      // Update metadata to reflect actual number of effects after filtering
      exportData.metadata.totalEffects =
        exportData.canvasEffects.length + exportData.imageEffects.length;
      exportData.metadata.hasAnimatedEffects =
        exportData.canvasEffects.length > 0 ||
        exportData.imageEffects.length > 0;

      // Track filtered effects
      const filteredCanvasEffects = exportData.canvasEffects.length;
      const filteredImageEffects = exportData.imageEffects.length;

      const effectsWereFiltered =
        originalCanvasEffects > filteredCanvasEffects ||
        originalImageEffects > filteredImageEffects;

      if (effectsWereFiltered) {
        console.warn(
          `Some effects could not be converted and were excluded from export. Canvas effects: ${originalCanvasEffects} -> ${filteredCanvasEffects}, Image effects: ${originalImageEffects} -> ${filteredImageEffects}`
        );
      }

      console.log("Export data after conversion and filtering:", exportData);

      console.log("\n=== SENDING TO BACKEND ===");
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/export-video`;
      console.log("Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error || errorData.message) {
            errorMessage = errorData.error || errorData.message;
          }
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (e2) {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Backend Response:", result);

        if (result.success === false) {
          throw new Error(
            result.error || result.message || "Unknown server error"
          );
        }

        if (result.jobId) {
          console.log("Video generation started with job ID:", result.jobId);
          alert(
            "Video generation started! You will receive the download link when processing is complete."
          );
        }
      } else {
        // Handle direct video download
        const videoBlob = await response.blob();
        console.log("Video blob received, size:", videoBlob.size);

        if (videoBlob.size === 0) {
          throw new Error("Received empty video file from server");
        }

        const videoUrl = URL.createObjectURL(videoBlob);
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = `cinemaglow-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(videoUrl), 100);
        console.log("Video download initiated");

        // Show success message
        let successMessage = "Video exported successfully!";
        if (effectsWereFiltered) {
          successMessage +=
            " Note: Some effects could not be included due to technical limitations.";
        }
        alert(successMessage);
      }
    } catch (error) {
      console.error("Error exporting video:", error);

      // Provide more specific error messages
      let errorMessage = "Video export failed: ";
      if (error.message.includes("blob:")) {
        errorMessage +=
          "Some images or effects could not be processed. Please try re-uploading your images.";
      } else if (error.message.includes("Server error: 500")) {
        errorMessage +=
          "Server processing error. Please check that all images are valid and try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage +=
          "Network connection error. Please check your internet connection and try again.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setExportLoading(false);
    }
  };

  const exportCanvasAsImage = async () => {
    const stage = stageRef.current;
    if (!stage) return;

    const transformer = transformerRef.current;
    const wasVisible = transformer && transformer.visible();
    if (transformer) {
      transformer.visible(false);
      transformer.getLayer()?.batchDraw();
    }

    try {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = canvasSize.width * 2;
      tempCanvas.height = canvasSize.height * 2;
      tempCtx.scale(2, 2);

      // Step 1: Draw Konva stage
      const stageDataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
      });
      const stageImage = new Image();
      stageImage.crossOrigin = "anonymous";
      stageImage.src = stageDataURL;

      await new Promise((resolve, reject) => {
        stageImage.onload = resolve;
        stageImage.onerror = reject;
      });

      tempCtx.drawImage(stageImage, 0, 0, canvasSize.width, canvasSize.height);

      const drawImageOverlay = (img, effectUrl, isStatic = false) => {
        return new Promise((resolve) => {
          const overlayImg = new Image();
          overlayImg.crossOrigin = "anonymous";
          overlayImg.onload = () => {
            const effectX = img.x;
            const effectY = img.y;
            const effectWidth = img.width;
            const effectHeight = img.height;

            if (
              effectX < canvasSize.width &&
              effectY < canvasSize.height &&
              effectX + effectWidth > 0 &&
              effectY + effectHeight > 0
            ) {
              const startX = Math.max(0, effectX);
              const startY = Math.max(0, effectY);
              const endX = Math.min(canvasSize.width, effectX + effectWidth);
              const endY = Math.min(canvasSize.height, effectY + effectHeight);
              const visibleWidth = endX - startX;
              const visibleHeight = endY - startY;

              if (visibleWidth > 0 && visibleHeight > 0) {
                tempCtx.save();
                tempCtx.globalCompositeOperation = isStatic
                  ? "source-over"
                  : "screen";
                tempCtx.globalAlpha = isStatic ? 0.7 : 0.45;

                const srcX = Math.max(0, -effectX);
                const srcY = Math.max(0, -effectY);
                const srcWidth = visibleWidth;
                const srcHeight = visibleHeight;

                tempCtx.drawImage(
                  overlayImg,
                  srcX,
                  srcY,
                  srcWidth,
                  srcHeight,
                  startX,
                  startY,
                  visibleWidth,
                  visibleHeight
                );
                tempCtx.restore();
              }
            }
            resolve();
          };
          overlayImg.onerror = () => resolve(); // Fail silently
          overlayImg.src = effectUrl;
        });
      };

      const allOverlayPromises = [];

      // ✅ 1. Draw image-applied effects (from draggedImages.appliedEffect)
      draggedImages
        .filter((img) => img.appliedEffect)
        .forEach((img) => {
          const isStatic =
            !img.appliedEffect.includes(".gif") &&
            !img.appliedEffect.includes("giphy.com");
          allOverlayPromises.push(
            drawImageOverlay(img, img.appliedEffect, isStatic)
          );
        });

      // ✅ 2. Draw global animation overlays (from animationOverlays prop)
      animationOverlays.forEach((overlay) => {
        const url = overlay.gifUrl || overlay.url;
        if (!url) return;
        const fakeImg = {
          x: overlay.x || 0,
          y: overlay.y || 0,
          width: overlay.width || 130,
          height: overlay.height || 130,
        };
        allOverlayPromises.push(drawImageOverlay(fakeImg, url, false));
      });

      // Wait for all overlays
      await Promise.all(allOverlayPromises);

      // Final export
      const finalDataURL = tempCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "cinemaglow-picture-with-overlays.png";
      link.href = finalDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Restore transformer
      if (transformer && wasVisible) {
        transformer.visible(true);
        transformer.getLayer()?.batchDraw();
      }

      console.log("✅ Image exported with ALL overlays (applied + global)");
    } catch (error) {
      console.error("❌ Error exporting image:", error);
      if (transformer && wasVisible) {
        transformer.visible(true);
        transformer.getLayer()?.batchDraw();
      }
    }
  };
  // Update the existing export event handler to support video export
  const exportVideoRef = useRef();
  const exportImageRef = useRef();

  useEffect(() => {
    exportVideoRef.current = exportCanvasAsVideo;
    exportImageRef.current = exportCanvasAsImage;
  }, [exportCanvasAsVideo, exportCanvasAsImage]);

  useEffect(() => {
    const handleExportEvent = (e) => {
      if (e.detail?.format === "video" && !e.detail?.processed) {
        e.detail.processed = true;
        exportVideoRef.current?.();
      } else if (e.detail?.format === "image" && !e.detail?.processed) {
        e.detail.processed = true;
        exportImageRef.current?.();
      }
    };

    window.addEventListener("exportCanvas", handleExportEvent);
    return () => {
      window.removeEventListener("exportCanvas", handleExportEvent);
    };
  }, []); // ✅ No dependencies needed here

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle arrow keys when an image is selected (ALL IMAGES)
      if (selectedMediaIndex === null) return;

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

  // Keyboard shortcuts for copy, paste, delete
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Ignore if typing in input/textarea
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;

      // Only proceed when an image is actively selected
      if (selectedMediaIndex === null) return;

      const selectedImage = konvaImages.find(
        (img) => img.id === selectedMediaIndex
      );
      if (!selectedImage) return;

      // DELETE key - Remove image
      if (e.key === "Delete") {
        e.preventDefault();
        handleDeleteImage(selectedMediaIndex);
        return;
      }

      // Ctrl+D - Duplicate image
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        handleDuplicateImage(selectedMediaIndex);
        return;
      }

      // Ctrl+C - Copy image
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        handleCopyImage(selectedMediaIndex);
        return;
      }

      // Ctrl+V - Paste image
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        handlePasteImage();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [selectedMediaIndex, konvaImages]);

  const handleDeleteImage = useCallback(
    (imageId) => {
      setKonvaImages((prev) => prev.filter((img) => img.id !== imageId));
      setDraggedImages((prev) =>
        prev.filter((img) => img.originalIndex !== imageId)
      );

      if (onRemoveMedia) {
        onRemoveMedia(imageId);
      }

      if (selectedMediaIndex === imageId) {
        setSelectedMediaIndex(null);
      }
    },
    [selectedMediaIndex, onRemoveMedia]
  );

  // Duplicate image function
  const handleDuplicateImage = useCallback(
    (imageId) => {
      const imageToDuplicate = konvaImages.find((img) => img.id === imageId);
      const draggedImageToDuplicate = draggedImages.find(
        (img) => img.originalIndex === imageId
      );

      if (imageToDuplicate && draggedImageToDuplicate) {
        const newId = Math.max(...konvaImages.map((img) => img.id)) + 1;

        // Create new konva image with offset position
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

        // Select the new duplicated image
        setSelectedMediaIndex(newId);
      }
    },
    [konvaImages, draggedImages]
  );

  // Copy image function
  const handleCopyImage = useCallback(
    (imageId) => {
      const imageToCopy = konvaImages.find((img) => img.id === imageId);
      const draggedImageToCopy = draggedImages.find(
        (img) => img.originalIndex === imageId
      );

      if (imageToCopy && draggedImageToCopy) {
        setCopiedImageData({
          konvaImage: imageToCopy,
          draggedImage: draggedImageToCopy,
        });

        // Optional: Show toast notification
        console.log("Image copied to clipboard");
      }
    },
    [konvaImages, draggedImages]
  );

  // Paste image function
  const handlePasteImage = useCallback(() => {
    if (!copiedImageData) {
      console.log("No image in clipboard");
      return;
    }

    const newId = Math.max(...konvaImages.map((img) => img.id)) + 1;

    // Create new konva image with offset position
    const newKonvaImage = {
      ...copiedImageData.konvaImage,
      id: newId,
      x: copiedImageData.konvaImage.x + 30,
      y: copiedImageData.konvaImage.y + 30,
    };

    // Create new dragged image
    const newDraggedImage = {
      ...copiedImageData.draggedImage,
      originalIndex: newId,
      x: copiedImageData.draggedImage.x + 30,
      y: copiedImageData.draggedImage.y + 30,
    };

    setKonvaImages((prev) => [...prev, newKonvaImage]);
    setDraggedImages((prev) => [...prev, newDraggedImage]);

    // Select the new pasted image
    setSelectedMediaIndex(newId);

    // Optional: Show toast notification
    console.log("Image pasted");
  }, [copiedImageData, konvaImages]);

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
    if (targetId === null || targetId === undefined) return;

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
  // Find the addEffectToCanvas function and update it:
  const addEffectToCanvas = (effect) => {
    if (!effect) return;
    const gifUrl = effect.gif || effect.gifUrl || effect.url || null;
    if (!gifUrl) return;

    const id = `ef-${Date.now()}-${Math.random()}`;

    const effectWidth = 130;
    const effectHeight = 130;
    const minMargin = 5;
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

    const newOverlay = {
      id,
      name: effect.name || "Animation Overlay",
      gifUrl,
      url: gifUrl,
      x: startX,
      y: startY,
      width: effectWidth,
      height: effectHeight,
      type: "animation",
    };

    // ADD to animationOverlays instead of canvasEffects
    if (onAnimationOverlayAdd) {
      onAnimationOverlayAdd(newOverlay);
    }
  };

  // Sync animation overlays with canvasEffects
  // useEffect(() => {
  //   if (animationOverlays && animationOverlays.length > 0) {
  //     const newCanvasEffects = animationOverlays.map(overlay => ({
  //       id: overlay.id,
  //       gifUrl: overlay.gifUrl || overlay.url,
  //       x: overlay.x || (canvasSize.width - 130) / 2,
  //       y: overlay.y || (canvasSize.height - 130) / 2,
  //       width: overlay.width || 130,
  //       height: overlay.height || 130,
  //       isDragging: false,
  //     }));
  //     setCanvasEffects(newCanvasEffects);
  //   } else {
  //     setCanvasEffects([]);
  //   }
  // }, [animationOverlays, canvasSize]);

  useEffect(() => {
    if (!animationOverlays || animationOverlays.length === 0) {
      setCanvasEffects([]);
      return;
    }

    const existingIds = canvasEffects
      .map((ef) => ef.id)
      .sort()
      .join(",");
    const newIds = animationOverlays
      .map((o) => o.id)
      .sort()
      .join(",");

    if (existingIds !== newIds) {
      const newCanvasEffects = animationOverlays.map((overlay) => ({
        id: overlay.id,
        gifUrl: overlay.gifUrl || overlay.url,
        x: overlay.x || (canvasSize.width - 130) / 2,
        y: overlay.y || (canvasSize.height - 130) / 2,
        width: overlay.width || 130,
        height: overlay.height || 130,
        isDragging: false,
      }));
      setCanvasEffects(newCanvasEffects);
    }
  }, [animationOverlays]);

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
    if (selectedMediaIndex != null) {
      // Apply effect to selected image (INCLUDING BASE IMAGE)
      setDraggedImages((prev) =>
        prev.map((img) =>
          img.originalIndex === selectedMediaIndex
            ? { ...img, appliedEffect: gifUrl }
            : img
        )
      );
      setKonvaImages((prev) =>
        prev.map((img) =>
          img.id === selectedMediaIndex
            ? { ...img, appliedEffect: gifUrl }
            : img
        )
      );
      if (typeof onImageEffectChange === "function") {
        onImageEffectChange(selectedMediaIndex, gifUrl);
      }
      lastActiveEffectRef.current = gifUrl;
    } else {
      addEffectToCanvas(activeEffect);
      lastActiveEffectRef.current = gifUrl;
      setShowEffectHint(true);
      const t = setTimeout(() => {
        lastActiveEffectRef.current = null;
      }, 800);
      return () => clearTimeout(t);
    }
  }, [activeEffect, canvasSize]);

  // Auto-hide the hint after a few seconds
  useEffect(() => {
    if (!showEffectHint) return;
    const t = setTimeout(() => setShowEffectHint(false), 6000);
    return () => clearTimeout(t);
  }, [showEffectHint]);

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
          // Canvas hamesha A4 size hoga
          setCanvasSize({ width: A4_WIDTH, height: A4_HEIGHT });

          const loadImageDimensions = async () => {
            const imageDimensions = await Promise.all(
              uploadedMedia.map((media, index) => {
                return new Promise((resolve) => {
                  if (media.type.startsWith("image/")) {
                    const tempImg = new window.Image();
                    tempImg.onload = () => {
                      let imgWidth = tempImg.width;
                      let imgHeight = tempImg.height;

                      if (index === 0) {
                        // Base image always full canvas size
                        resolve({ width: A4_WIDTH, height: A4_HEIGHT });
                      } else {
                        // Overlay images independent scaling
                        const maxSize = 300;
                        if (imgWidth > maxSize || imgHeight > maxSize) {
                          const scale = Math.min(
                            maxSize / imgWidth,
                            maxSize / imgHeight
                          );
                          imgWidth = Math.round(imgWidth * scale);
                          imgHeight = Math.round(imgHeight * scale);
                        }
                        resolve({ width: imgWidth, height: imgHeight });
                      }
                    };
                    tempImg.src = media.preview;
                  } else {
                    resolve({ width: 150, height: 150 });
                  }
                });
              })
            );

            // Update draggedImages
            setDraggedImages((prevImages) => {
              const newDraggedImages = uploadedMedia.map((media, index) => {
                const existingImage = prevImages.find(
                  (img) => img.originalIndex === index
                );
                const dimensions = imageDimensions[index];

                const centerPos = (w, h) => ({
                  x: (A4_WIDTH - w) / 2,
                  y: (A4_HEIGHT - h) / 2,
                });

                if (existingImage) {
                  return {
                    ...existingImage,
                    appliedEffect:
                      media && Object.prototype.hasOwnProperty.call(media, "appliedEffect")
                        ? media.appliedEffect
                        : existingImage.appliedEffect ?? null,
                  };
                }

                return {
                  originalIndex: index,
                  x:
                    index === 0
                      ? 0
                      : centerPos(dimensions.width, dimensions.height).x,
                  y:
                    index === 0
                      ? 0
                      : centerPos(dimensions.width, dimensions.height).y,
                  width: dimensions.width,
                  height: dimensions.height,
                  rotation: 0,
                  appliedEffect:
                    media && Object.prototype.hasOwnProperty.call(media, "appliedEffect")
                      ? media.appliedEffect
                      : null,
                };
              });
              return newDraggedImages;
            });

            // Update konvaImages
            setKonvaImages((prevKonvaImages) => {
              const images = uploadedMedia.map((media, idx) => {
                const existingKonvaImage = prevKonvaImages.find(
                  (img) => img.id === idx
                );
                const dimensions = imageDimensions[idx];

                const centerPos = (w, h) => ({
                  x: (A4_WIDTH - w) / 2,
                  y: (A4_HEIGHT - h) / 2,
                });

                if (existingKonvaImage) {
                  return {
                    ...existingKonvaImage,
                    media,
                    appliedEffect:
                      media && Object.prototype.hasOwnProperty.call(media, "appliedEffect")
                        ? media.appliedEffect
                        : existingKonvaImage.appliedEffect ?? null,
                  };
                }

                const isBase = idx === 0;
                return {
                  id: idx,
                  media,
                  konvaImg: null,
                  x: isBase
                    ? 0
                    : centerPos(dimensions.width, dimensions.height).x,
                  y: isBase
                    ? 0
                    : centerPos(dimensions.width, dimensions.height).y,
                  width: dimensions.width,
                  height: dimensions.height,
                  rotation: 0,
                  isDragging: false,
                  appliedEffect:
                    media && Object.prototype.hasOwnProperty.call(media, "appliedEffect")
                      ? media.appliedEffect
                      : null,
                };
              });

              // Load only new images
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

          loadImageDimensions();
        };
        img.src = firstImage.preview;
      }
    }
  }, [uploadedMedia]);

  // Attach/clear Transformer based on selection (ALL IMAGES INCLUDING BASE)
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

    // If we have individual selection (ANY IMAGE INCLUDING BASE)
    if (selectedMediaIndex != null) {
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
      // REMOVED: Custom drag handling for uploaded images
      // Only handle effect dragging
      const effectIndex = canvasEffects.findIndex(
        (ef) => ef.id === draggedImageId
      );
      if (effectIndex === -1) return;

      e.preventDefault();

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const stageElement = stageRef.current?.getStage().container();
      const stageRect = stageElement?.getBoundingClientRect();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = clientX - (stageRect?.left || 0) - dragOffset.x;
      let newY = clientY - (stageRect?.top || 0) - dragOffset.y;

      // If dragging an effect from canvasEffects
      const ef = canvasEffects[effectIndex];
      // Boundaries for effect icon
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

            if (typeof onImageEffectChange === "function") {
              onImageEffectChange(hit.originalIndex, ef.gifUrl);
            }

            // Remove the small effect icon from canvas (if you want to keep it, change this)
            setCanvasEffects((prev) => prev.filter((x) => x.id !== ef.id));
            // Also remove from animation overlays if it exists there
            if (onAnimationOverlayRemove) {
              onAnimationOverlayRemove(ef.id);
            }
            // Hide the hint once successfully dropped
            setShowEffectHint(false);
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

  // ----- Warp Overlay Drawing (HTML Canvas) -----
  const drawWarpedImage = useCallback(() => {
    if (!warpMode.active || warpMode.targetId == null) return;
    const target = konvaImages.find((img) => img.id === warpMode.targetId);
    if (!target || !target.konvaImg) return;

    const canvas = warpCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Match the Konva stage size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Convenience
    const img = target.konvaImg;
    const sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;

    // Triangles: [0,1,2] and [0,2,3]
    const p0 = warpCorners[0];
    const p1 = warpCorners[1];
    const p2 = warpCorners[2];
    const p3 = warpCorners[3];

    const drawTriangle = (pA, pB, pC, srcTri) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.closePath();
      ctx.clip();

      const denom =
        srcTri[0] * (srcTri[3] - srcTri[5]) +
        srcTri[2] * (srcTri[5] - srcTri[1]) +
        srcTri[4] * (srcTri[1] - srcTri[3]);
      if (denom === 0) {
        ctx.restore();
        return;
      }

      const a =
        (pA.x * (srcTri[3] - srcTri[5]) +
          pB.x * (srcTri[5] - srcTri[1]) +
          pC.x * (srcTri[1] - srcTri[3])) /
        denom;
      const b =
        (pA.x * (srcTri[4] - srcTri[2]) +
          pB.x * (srcTri[0] - srcTri[4]) +
          pC.x * (srcTri[2] - srcTri[0])) /
        denom;
      const c =
        (pA.x * (srcTri[2] * srcTri[5] - srcTri[4] * srcTri[3]) +
          pB.x * (srcTri[4] * srcTri[1] - srcTri[0] * srcTri[5]) +
          pC.x * (srcTri[0] * srcTri[3] - srcTri[2] * srcTri[1])) /
        denom;
      const d =
        (pA.y * (srcTri[3] - srcTri[5]) +
          pB.y * (srcTri[5] - srcTri[1]) +
          pC.y * (srcTri[1] - srcTri[3])) /
        denom;
      const e =
        (pA.y * (srcTri[4] - srcTri[2]) +
          pB.y * (srcTri[0] - srcTri[4]) +
          pC.y * (srcTri[2] - srcTri[0])) /
        denom;
      const f =
        (pA.y * (srcTri[2] * srcTri[5] - srcTri[4] * srcTri[3]) +
          pB.y * (srcTri[4] * srcTri[1] - srcTri[0] * srcTri[5]) +
          pC.y * (srcTri[0] * srcTri[3] - srcTri[2] * srcTri[1])) /
        denom;

      ctx.setTransform(a, d, b, e, c, f);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      ctx.restore();
    };

    drawTriangle(p0, p1, p2, [0, 0, sw, 0, sw, sh]);
    drawTriangle(p0, p2, p3, [0, 0, sw, sh, 0, sh]);

    // Draw anchors on top
    ctx.save();
    ctx.fillStyle = "#8088e2";
    warpCorners.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }, [
    warpMode.active,
    warpMode.targetId,
    warpCorners,
    konvaImages,
    canvasSize,
  ]);
  // ----- Warp Overlay Drawing (HTML Canvas) -----

  useEffect(() => {
    drawWarpedImage();
  }, [drawWarpedImage]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("warpModeChanged", {
        detail: { active: warpMode.active },
      })
    );
  }, [warpMode.active]);

  useEffect(() => {
    const handleEnterWarp = () => {
      if (warpMode.active) return;
      const targetId = selectedMediaIndex;
      if (targetId === null || targetId === undefined) return;
      const target = konvaImages.find((img) => img.id === targetId);
      if (!target || !target.konvaImg) return;
      const cornersInit = [
        { x: target.x, y: target.y },
        { x: target.x + target.width, y: target.y },
        { x: target.x + target.width, y: target.y + target.height },
        { x: target.x, y: target.y + target.height },
      ];
      setWarpCorners(cornersInit);
      setWarpMode({ active: true, targetId });
    };

    window.addEventListener("enterWarpTransform", handleEnterWarp);
    return () =>
      window.removeEventListener("enterWarpTransform", handleEnterWarp);
  }, [warpMode.active, selectedMediaIndex, konvaImages]);

  // Handle zoom mode changes from LeftSidebar
  useEffect(() => {
    const handleZoomModeChange = (e) => {
      if (e.detail?.mode === "ZoomIn") {
        setZoomMode("zoom-in");
      } else if (e.detail?.mode === "ZoomOut") {
        setZoomMode("zoom-out");
      } else if (e.detail?.mode === null) {
        setZoomMode(null);
      }
    };

    window.addEventListener("zoomModeChanged", handleZoomModeChange);
    return () =>
      window.removeEventListener("zoomModeChanged", handleZoomModeChange);
  }, []);

  // Handle tool changes to deactivate zoom mode
  useEffect(() => {
    const handleToolChange = (e) => {
      const tool = e.detail?.tool;

      if (tool !== "Skew") {
        // Commit any pending warp so other tools see the latest transform
        applyWarp();
      }

      if (tool && tool !== "ZoomIn" && tool !== "ZoomOut") {
        setZoomMode(null);
        // Dispatch zoom mode change event to update left sidebar
        window.dispatchEvent(
          new CustomEvent("zoomModeChanged", { detail: { mode: null } })
        );
      }
    };

    window.addEventListener("toolChanged", handleToolChange);
    return () => window.removeEventListener("toolChanged", handleToolChange);
  }, [applyWarp]);

  // Handle drag selection start
  const handleSelectionStart = (e) => {
    // Only start selection if clicking on empty stage area AND within canvas boundaries AND base image exists
    if (e.target === e.target.getStage() && konvaImages.length > 0) {
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
          style={{
            cursor: zoomMode
              ? zoomMode === "zoom-in"
                ? "zoom-in"
                : "zoom-out"
              : "default",
          }}
        >
          {/* Fixed Background Layer - Base Image */}
          <Layer>
            {/* {konvaImages[0]?.konvaImg && (
              <KonvaImage
                image={konvaImages[0].konvaImg}
                x={0}
                y={0}
                width={konvaImages[0].width}
                height={konvaImages[0].height}
                listening={false}
              />
            )} */}
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
            {konvaImages.map((item, index) => {
              const actualIndex = index;
              const isSelected =
                selectedMediaIndex === actualIndex ||
                selectedImages.includes(actualIndex);
              const isGrouped = groupedImages.includes(actualIndex);
              const hiddenByWarp =
                warpMode.active && warpMode.targetId === actualIndex;

              // Don't render if it's part of a group
              if (isGrouped) return null;
              if (hiddenByWarp) return null;

              // Get zoom data for this image
              const zoomData = imageZoomLevels[actualIndex] || {
                scale: 1,
                offsetX: 0,
                offsetY: 0,
              };

              // Check if konvaImg exists before proceeding
              if (!item.konvaImg) return null;

              // Calculate crop area for zoom effect within image boundaries
              const scale = zoomData.scale;
              const offsetX = zoomData.offsetX;
              const offsetY = zoomData.offsetY;

              // Calculate the source image dimensions
              const sourceWidth = item.konvaImg.width;
              const sourceHeight = item.konvaImg.height;

              // Calculate crop dimensions (smaller area = more zoom)
              const cropWidth = sourceWidth / scale;
              const cropHeight = sourceHeight / scale;

              // Calculate crop position (centered with offset)
              const cropX = Math.max(
                0,
                Math.min(
                  sourceWidth - cropWidth,
                  (sourceWidth - cropWidth) / 2 + offsetX
                )
              );
              const cropY = Math.max(
                0,
                Math.min(
                  sourceHeight - cropHeight,
                  (sourceHeight - cropHeight) / 2 + offsetY
                )
              );

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
                  crop={{
                    x: cropX,
                    y: cropY,
                    width: cropWidth,
                    height: cropHeight,
                  }}
                  onClick={(e) => {
                    if (zoomMode && selectedMediaIndex === actualIndex) {
                      const stage = e.target.getStage();
                      const pointerPosition = stage.getPointerPosition();
                      handleZoomClick(
                        actualIndex,
                        pointerPosition.x,
                        pointerPosition.y
                      );
                    } else {
                      setSelectedMediaIndex(actualIndex);
                    }
                  }}
                  onTap={(e) => {
                    if (zoomMode && selectedMediaIndex === actualIndex) {
                      const stage = e.target.getStage();
                      const pointerPosition = stage.getPointerPosition();
                      handleZoomClick(
                        actualIndex,
                        pointerPosition.x,
                        pointerPosition.y
                      );
                    } else {
                      setSelectedMediaIndex(actualIndex);
                    }
                  }}
                  onDragStart={() => setSelectedMediaIndex(actualIndex)}
                  onDragMove={(e) => {
                    const node = e.target;
                    const newX = node.x();
                    const newY = node.y();

                    // Update draggedImages state for consistency
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

                    // setGuides(newGuides);
                    // node.position(newPos);
                    // const abs = getAbsXY(node);
                    // const maxX = canvasSize.width - item.width;
                    // const maxY = canvasSize.height - item.height;
                    // const finalX = clamp(abs.x, 0, Math.max(0, Math.floor(maxX)));
                    // const finalY = clamp(abs.y, 0, Math.max(0, Math.floor(maxY)));
                    // node.absolutePosition({ x: finalX, y: finalY });
                    // const logged = getAbsXY(node);
                    // console.log("Dragged Image Position:", logged);
                    setGuides(newGuides);
                    node.position(newPos);
                    const abs = getAbsXY(node);
                    const logged = getAbsXY(node);
                    console.log("Dragged Image Position:", logged);
                    setDraggedImages((prev) =>
                      prev.map((img) =>
                        img.originalIndex === actualIndex
                          ? { ...img, x: logged.x, y: logged.y }
                          : img
                      )
                    );
                  }}
                  onDragEnd={(e) => {
                    console.log("Dragged Image Position:", {
                      x: e.target.x(),
                      y: e.target.y(),
                    });

                    const { x, y } = getAbsXY(e.target);
                    console.log("Dragged Image Position:", { x, y });
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
              visible={!warpMode.active && !eraserMode.active}
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

        {/* Warp Transform Overlay (HTML Canvas + Anchor Drag) */}
        {warpMode.active &&
          (() => {
            const containerRect = canvasRef.current?.getBoundingClientRect();
            const stageElement = stageRef.current?.getStage().container();
            const stageRect = stageElement?.getBoundingClientRect();
            const stageOffsetX =
              stageRect && containerRect
                ? stageRect.left - containerRect.left
                : 0;
            const stageOffsetY =
              stageRect && containerRect
                ? stageRect.top - containerRect.top
                : 0;

            const topBarLeft = stageOffsetX;
            const topBarTop = stageOffsetY - 44;

            const handleMouseDown = (e) => {
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              let nearest = -1;
              let bestDist = Infinity;
              warpCorners.forEach((c, i) => {
                const d = Math.hypot(c.x - x, c.y - y);
                if (d < bestDist) {
                  bestDist = d;
                  nearest = i;
                }
              });
              if (bestDist <= 14) setWarpDragIndex(nearest);
            };

            const handleMouseMove = (e) => {
              if (warpDragIndex == null) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(
                0,
                Math.min(e.clientX - rect.left, canvasSize.width)
              );
              const y = Math.max(
                0,
                Math.min(e.clientY - rect.top, canvasSize.height)
              );
              setWarpCorners((prev) => {
                const next = [...prev];
                next[warpDragIndex] = { x, y };
                return next;
              });
            };

            const handleMouseUp = () => setWarpDragIndex(null);

            const handleTouchStart = (e) => {
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const x = touch.clientX - rect.left;
              const y = touch.clientY - rect.top;
              let nearest = -1;
              let bestDist = Infinity;
              warpCorners.forEach((c, i) => {
                const d = Math.hypot(c.x - x, c.y - y);
                if (d < bestDist) {
                  bestDist = d;
                  nearest = i;
                }
              });
              if (bestDist <= 18) setWarpDragIndex(nearest);
            };

            const handleTouchMove = (e) => {
              if (warpDragIndex == null) return;
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(
                0,
                Math.min(touch.clientX - rect.left, canvasSize.width)
              );
              const y = Math.max(
                0,
                Math.min(touch.clientY - rect.top, canvasSize.height)
              );
              setWarpCorners((prev) => {
                const next = [...prev];
                next[warpDragIndex] = { x, y };
                return next;
              });
            };

            const handleTouchEnd = () => setWarpDragIndex(null);

            return (
              <div
                className="absolute z-[60]"
                style={{
                  left: stageOffsetX,
                  top: stageOffsetY,
                  width: canvasSize.width,
                  height: canvasSize.height,
                }}
              >
                {/* Apply / Cancel bar */}
                <div
                  className="absolute left-0 right-0 -top-10 flex items-center justify-end gap-2"
                  style={{ left: 0, right: 0 }}
                >
                  <button
                    className="px-3 py-1.5 text-sm rounded-sm bg-[#2f2f42] text-white hover:bg-[#262635]"
                    onClick={exitWarpMode}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded-sm bg-[#8088e2] text-white hover:bg-[#6d77e0]"
                    onClick={applyWarp}
                  >
                    Apply
                  </button>
                </div>
                <canvas
                  ref={warpCanvasRef}
                  className="w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              </div>
            );
          })()}

        {/* Eraser Transform Overlay */}
        {eraserMode.active &&
          (() => {
            const target = konvaImages.find(
              (img) => img.id === eraserMode.targetId
            );
            if (!target) return null;

            const containerRect = canvasRef.current?.getBoundingClientRect();
            const stageElement = stageRef.current?.getStage().container();
            const stageRect = stageElement?.getBoundingClientRect();
            const stageOffsetX =
              stageRect && containerRect
                ? stageRect.left - containerRect.left
                : 0;
            const stageOffsetY =
              stageRect && containerRect
                ? stageRect.top - containerRect.top
                : 0;

            return (
              <div
                className="absolute z-[60]"
                style={{
                  left: stageOffsetX + target.x,
                  top: stageOffsetY + target.y,
                  width: target.width,
                  height: target.height,
                }}
              >
                {/* Apply / Cancel bar */}
                <div className="absolute left-0 right-0 -top-12 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-white text-sm">Brush:</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={eraserBrushSize}
                      onChange={(e) =>
                        setEraserBrushSize(Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-white text-xs">
                      {eraserBrushSize}px
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 text-sm rounded-sm bg-[#2f2f42] text-white hover:bg-[#262635]"
                      onClick={exitEraserMode}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm rounded-sm bg-[#8088e2] text-white hover:bg-[#6d77e0]"
                      onClick={applyEraser}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <canvas
                  ref={eraserCanvasRef}
                  className="w-full h-full cursor-crosshair"
                  style={{ touchAction: "none" }}
                  onMouseDown={startErasing}
                  onMouseMove={continueErasing}
                  onMouseUp={stopErasing}
                  onMouseLeave={stopErasing}
                  onTouchStart={startErasing}
                  onTouchMove={continueErasing}
                  onTouchEnd={stopErasing}
                />
              </div>
            );
          })()}

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
              {showEffectHint && (
                <button
                  className="absolute top-1 right-1 w-5 h-5 p-0 rounded-full bg-[#b4b9ea] text-[#0f0f16] border border-black/20 flex items-center justify-center shadow-md z-[55] hover:bg-white"
                  title="Remove"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCanvasEffects((prev) => {
                      const next = prev.filter((x) => x.id !== ef.id);
                      if (next.length === 0) setShowEffectHint(false);
                      return next;
                    });
                    // Also remove from animation overlays if it exists there
                    if (onAnimationOverlayRemove) {
                      onAnimationOverlayRemove(ef.id);
                    }
                  }}
                >
                  <X className="w-4 h-4 text-gray-600" strokeWidth={3} />
                </button>
              )}
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

        {/* Effect guidance hint */}
        {showEffectHint && canvasEffects.length > 0 && (
          <div className="absolute z-[70] top-3 left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,0.65)] text-white text-sm px-3 py-1.5 rounded border border-[#8088e2]">
            Drag and Drop on the image
          </div>
        )}

        {/* Zoom mode indicator */}
        {zoomMode && selectedMediaIndex !== null &&
          selectedMediaIndex !== undefined && (
          <div className="absolute z-[70] top-3 left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,0.65)] text-white text-sm px-3 py-1.5 rounded border border-[#8088e2]">
            {zoomMode === "zoom-in"
              ? "Click on the selected image to zoom in"
              : "Click on the selected image to zoom out"}
          </div>
        )}

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
      {/* Add this just before the last closing </div> */}
      <VideoExportLoader
        isVisible={exportLoading}
        onClose={() => setExportLoading(false)}
      />
    </div>
  );
};

export default MainCanvas;
