import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

import Toolbar from "../components/Toolbar";
import RoomNavbar from "../components/RoomNavbar";

function DrawingRoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new Canvas(canvasRef.current, {
        backgroundColor: "#f5f5f5",
      });

      fabricRef.current.setDimensions({
        width: containerRef.current?.clientWidth,
        height: containerRef.current?.clientHeight,
      });
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <RoomNavbar />
      <div className="flex flex-1">
        <Toolbar fabricRef={fabricRef} />
        <main ref={containerRef} className="flex-1 overflow-hidden">
          <canvas ref={canvasRef} />
        </main>
      </div>
    </div>
  );
}

export default DrawingRoom;
