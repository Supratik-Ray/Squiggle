import {
  Pencil,
  Eraser,
  Square,
  Type,
  Image,
  Trash2,
  Palette,
  Shapes,
} from "lucide-react";
import { Compact } from "@uiw/react-color";
import { useEffect, useState } from "react";
import { Canvas, PencilBrush, Rect, Textbox } from "fabric";

function Toolbar({ fabricRef }: { fabricRef: React.RefObject<Canvas | null> }) {
  const [hex, setHex] = useState("#000");

  const handleDrawOrErase = (option: "draw" | "erase") => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      if (canvas.freeDrawingBrush) {
        if (option === "draw") {
          canvas.freeDrawingBrush.color = hex;
          canvas.freeDrawingBrush.width = 8;
          canvas.defaultCursor = "crosshair";
        } else {
          canvas.freeDrawingBrush.color = "#f5f5f5";
          canvas.freeDrawingBrush.width = 20;
          canvas.defaultCursor = "grab";
        }
      }
    }
  };

  useEffect(() => {
    const canvas = fabricRef.current;

    if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = hex;
    }
  }, [hex, fabricRef]);

  const handleAddRectangle = () => {
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
    }
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: hex,
      width: 100,
      height: 100,
    });

    fabricRef.current?.add(rect);
  };

  const handleAddTextBox = () => {
    const text = new Textbox("Hello React", {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: "black",
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

        <button
          onClick={() => handleDrawOrErase("draw")}
          className="w-full flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition"
        >
          <Pencil size={18} />
          Draw
        </button>

        <button
          onClick={() => handleDrawOrErase("erase")}
          className="w-full flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition"
        >
          <Eraser size={18} />
          Eraser
        </button>
      </div>

      {/* Elements */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Shapes size={16} />
          <span>Elements</span>
        </div>

        <button
          onClick={handleAddRectangle}
          className="w-full flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition"
        >
          <Square size={18} />
          Rectangle
        </button>

        <button
          onClick={handleAddTextBox}
          className="w-full flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition"
        >
          <Type size={18} />
          Text
        </button>

        <button className="w-full flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition">
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
