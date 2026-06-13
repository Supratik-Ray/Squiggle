import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Triangle,
  Type,
  Image,
  Trash2,
  Palette,
  Shapes,
} from "lucide-react";
import { Compact } from "@uiw/react-color";
import { useCallback, useEffect, useState } from "react";
import {
  Canvas,
  PencilBrush,
  Rect,
  Textbox,
  Circle as FabricCircle,
  Triangle as FabricTriangle,
} from "fabric";

type Tool = "draw" | "erase" | null;

const toolBtn = (
  tool: Tool,
  onClick: () => void,
  icon: React.ReactNode,
  label: string,
  activeTool: Tool,
) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 transition
        ${
          activeTool === tool
            ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
            : "border-gray-200 hover:bg-gray-100 text-gray-700"
        }`}
  >
    {icon}
    {label}
  </button>
);

function Toolbar({ fabricRef }: { fabricRef: React.RefObject<Canvas | null> }) {
  const [hex, setHex] = useState("#000");
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const isErasing = activeTool === "erase";
  const isDrawing = activeTool === "draw";

  const handleErase = useCallback(
    (e: MouseEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      if (e.buttons !== 1) return;
      const pointer = canvas.getScenePoint(e);
      const objects = canvas
        .getObjects()
        .filter((obj) => obj.containsPoint(pointer));
      if (objects.length) {
        canvas.remove(...objects);
        canvas.renderAll();
      }
    },
    [fabricRef],
  );

  // Handle drawing mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (isDrawing) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = hex;
      canvas.freeDrawingBrush.width = 8;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [isDrawing, fabricRef, hex]);

  // Handle erase mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (isErasing) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.upperCanvasEl.addEventListener("mousemove", handleErase);
    } else {
      canvas.selection = true;
      canvas.upperCanvasEl.removeEventListener("mousemove", handleErase);
    }
  }, [isErasing, fabricRef, handleErase]);

  const selectTool = (tool: Tool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const handleAddRectangle = () => {
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: hex,
      width: 100,
      height: 100,
    });
    fabricRef.current?.add(rect);
  };

  const handleAddCircle = () => {
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      fill: hex,
      radius: 50,
    });
    fabricRef.current?.add(circle);
  };

  const handleAddTriangle = () => {
    const triangle = new FabricTriangle({
      left: 100,
      top: 100,
      fill: hex,
      width: 100,
      height: 100,
    });
    fabricRef.current?.add(triangle);
  };

  const handleAddTextBox = () => {
    const text = new Textbox("Hello React", {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: hex,
    });
    fabricRef.current?.add(text);
  };

  const handleClearCanvas = () => {
    fabricRef.current?.clear();
  };

  return (
    <aside className="w-72 border-r bg-white flex flex-col p-4 gap-6">
      <div>
        <h1 className="text-xl font-bold">Canvas Editor</h1>
        <p className="text-sm text-gray-500">
          Draw, add shapes and customize elements
        </p>
      </div>

      {/* Drawing Tools */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Pencil size={16} />
          <span>Drawing Tools</span>
        </div>
        {toolBtn(
          "draw",
          () => selectTool("draw"),
          <Pencil size={18} />,
          "Draw",
          activeTool,
        )}
        {toolBtn(
          "erase",
          () => selectTool("erase"),
          <Eraser size={18} />,
          "Eraser",
          activeTool,
        )}
      </div>

      {/* Elements */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Shapes size={16} />
          <span>Elements</span>
        </div>
        <button
          onClick={handleAddRectangle}
          className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Square size={18} />
          Rectangle
        </button>
        <button
          onClick={handleAddCircle}
          className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Circle size={18} />
          Circle
        </button>
        <button
          onClick={handleAddTriangle}
          className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Triangle size={18} />
          Triangle
        </button>
        <button
          onClick={handleAddTextBox}
          className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Type size={18} />
          Text
        </button>
        <button className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-100 transition text-gray-700">
          <Image size={18} />
          Image
        </button>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Palette size={16} />
          <span>Colors</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded border"
            style={{ backgroundColor: hex }}
          />
          <span className="text-sm text-gray-600">{hex}</span>
        </div>
        <Compact color={hex} onChange={(color) => setHex(color.hex)} />
      </div>

      <div className="mt-auto">
        <button
          onClick={handleClearCanvas}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition"
        >
          <Trash2 size={18} />
          Clear Canvas
        </button>
      </div>
    </aside>
  );
}

export default Toolbar;
