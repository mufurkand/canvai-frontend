import { useEffect, useRef, useState } from "react";
import type { Draw, Point } from "@/types/typing";
import { log } from "console";

function useDraw(onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<Point | null>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!mouseDown) return;

      const currentPoint = computePointInCanvas(e);
      console.log(currentPoint);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    }

    // compute point in canvas, not window
    function computePointInCanvas(e: MouseEvent) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    }

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    // add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [mouseDown, onDraw]);

  return { canvasRef, onMouseDown };
}

export default useDraw;
