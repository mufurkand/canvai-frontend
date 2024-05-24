// custom hook needs use client to work
"use client";

import { Trash2 } from "lucide-react";

import useDraw from "@/hooks/useDraw";
import type { Draw } from "@/types/typing";

export default function Home() {
  const { canvasRef, onMouseDown, clear } = useDraw(draw);

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

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-5">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
      <button
        type="button"
        onClick={clear}
        className="border border-black rounded-md p-2"
      >
        <Trash2 size={50} />
      </button>
    </div>
  );
}
