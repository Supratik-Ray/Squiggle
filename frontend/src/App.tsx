import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

import Toolbar from "./components/Toolbar";

function App() {
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
    <div className="h-screen flex">
      <Toolbar fabricRef={fabricRef} />
      <main ref={containerRef} className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} />
      </main>
    </div>
  );
}

export default App;
