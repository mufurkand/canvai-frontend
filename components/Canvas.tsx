// use client is needed for custom hooks
"use client";

import useDraw from "@/hooks/useDraw";
import { Draw } from "@/types/typing";
import React, { useState } from "react";
import Timer from "./Timer";
import { Trash2 } from "lucide-react";

export default function Canvas({
  setChangeTheme,
  theme,
}: {
  setChangeTheme: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
}) {
  const [isLocked, setIsLocked] = useState(false);
  const { canvasRef, onMouseDown, clearCanvas } = useDraw(draw, isLocked);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 10);

  // with object notation the order of the parameters does not matter
  function draw({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    // TODO: strokestyle and fillstyle
    ctx.lineWidth = 5;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  function getCropRectangle():
    | { top: number; bottom: number; left: number; right: number }
    | undefined {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let top = height,
      bottom = 0,
      left = width,
      right = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = imageData[(y * width + x) * 4 + 3];
        if (alpha > 0) {
          // non-transparent pixel found
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }

    // teturn the rectangle coordinates
    return { top, bottom, left, right };
  }

  // function to crop the canvas to a square
  function cropCanvasToSquare() {
    const canvas = canvasRef.current;
    const crop = getCropRectangle();
    if (!crop || !canvas) return;
    const { top, bottom, left, right } = crop;

    const croppedWidth = right - left + 1;
    const croppedHeight = bottom - top + 1;
    const size = Math.max(croppedWidth, croppedHeight); // ensure square dimensions

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");
    if (!croppedCtx) return;

    croppedCanvas.width = size;
    croppedCanvas.height = size;

    // center the original drawing in the square
    const offsetX = (size - croppedWidth) / 2;
    const offsetY = (size - croppedHeight) / 2;

    // fill the canvas with white or any background color if desired
    croppedCtx.fillStyle = "white";
    croppedCtx.fillRect(0, 0, size, size);

    // draw the cropped area onto the new canvas, centered
    croppedCtx.drawImage(
      canvas,
      left,
      top,
      croppedWidth,
      croppedHeight, // source rectangle
      offsetX,
      offsetY,
      croppedWidth,
      croppedHeight // destination rectangle
    );

    croppedCtx.globalCompositeOperation = "difference";
    croppedCtx.fillStyle = "white";
    croppedCtx.fillRect(0, 0, canvas.width, canvas.height);

    return croppedCanvas;
  }

  // crop and save the canvas
  function saveCroppedCanvas() {
    const croppedCanvas = cropCanvasToSquare();
    if (!croppedCanvas) return;
    const croppedDataUrl = croppedCanvas.toDataURL();

    // create a download link and click it to save the image
    const link = document.createElement("a");
    link.href = croppedDataUrl;
    link.download = "cropped-drawing.png";
    link.click();
  }

  function drawingExpireFunction() {
    setIsLocked(true);
    saveCroppedCanvas();
  }

  function intermissionExpireFunction() {
    clearCanvas();
    setIsLocked(false);
    setChangeTheme(true);
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-5">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="border-2 border-black rounded-md"
      />
      <div className="flex flex-col items-center gap-5">
        {isLocked ? (
          <>
            <h1 className="text-4xl font-bold">Intermission</h1>
            <Timer
              expiryTimestamp={time}
              expireFunction={intermissionExpireFunction}
            />
          </>
        ) : (
          <>
            <p>Your current theme is:</p>
            <h1 className="text-4xl font-bold">{theme}</h1>
            <Timer
              expiryTimestamp={time}
              expireFunction={drawingExpireFunction}
            />
            <button
              type="button"
              onClick={clearCanvas}
              className="border-2 border-black rounded-md p-2"
            >
              <Trash2 size={50} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
