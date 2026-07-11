import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Triangle,
  Type,
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
  FabricObject,
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
    className={`w-full flex items-center justify-center md:justify-start gap-3 rounded-lg border px-2 md:px-3 py-2 transition
      ${
        activeTool === tool
          ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
          : "border-gray-200 hover:bg-gray-100 text-gray-700"
      }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

function Toolbar({
  fabricRef,
  selectedObjId,
}: {
  fabricRef: React.RefObject<Canvas | null>;
  selectedObjId: string | null;
}) {
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [hex, setHex] = useState("#000");
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const isErasing = activeTool === "erase";
  const isDrawing = activeTool === "draw";

  const getRandomPosition = useCallback(
    (canvas: Canvas, objectWidth: number, objectHeight: number) => {
      const jitter = 40;

      return {
        left:
          canvas.getWidth() / 2 -
          objectWidth / 2 +
          (Math.random() - 0.5) * jitter,
        top:
          canvas.getHeight() / 2 -
          objectHeight / 2 +
          (Math.random() - 0.5) * jitter,
      };
    },
    [],
  );

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
    setActiveTool(null);

    if (!fabricRef.current) return;

    const { left, top } = getRandomPosition(fabricRef.current, 100, 100);

    const rect = new Rect({
      left,
      top,
      fill: hex,
      width: 100,
      height: 100,
    });
    fabricRef.current?.add(rect);
  };

  const handleAddCircle = () => {
    setActiveTool(null);

    if (!fabricRef.current) return;

    const { left, top } = getRandomPosition(fabricRef.current, 100, 100);
    const circle = new FabricCircle({
      left,
      top,
      fill: hex,
      radius: 50,
    });
    fabricRef.current?.add(circle);
  };

  const handleAddTriangle = () => {
    setActiveTool(null);

    if (!fabricRef.current) return;

    const { left, top } = getRandomPosition(fabricRef.current, 100, 100);
    const triangle = new FabricTriangle({
      left,
      top,
      fill: hex,
      width: 100,
      height: 100,
    });
    fabricRef.current?.add(triangle);
  };

  const handleAddTextBox = () => {
    setActiveTool(null);

    if (!fabricRef.current) return;

    const { left, top } = getRandomPosition(fabricRef.current, 100, 100);
    const text = new Textbox("Hello React", {
      left,
      top,
      fontSize: 30,
      fill: hex,
    });
    fabricRef.current?.add(text);
  };

  const handleClearCanvas = () => {
    fabricRef.current?.clear();
  };

  return (
    <aside
      className="
      w-16
      sm:w-20
      md:w-64
      lg:w-72
      shrink-0
      border-r
      bg-white
      flex
      flex-col
      p-2
      sm:p-3
      md:p-4
      gap-4
      md:gap-6
      overflow-y-auto
    "
    >
      {/* Header */}
      <div className="hidden md:block">
        <h1 className="text-xl font-bold">Canvas Editor</h1>
        <p className="text-sm text-gray-500">
          Draw, add shapes and customize elements
        </p>
      </div>

      {/* Drawing Tools */}
      <div className="space-y-2">
        <div className="hidden md:flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-gray-600">
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
        <div className="hidden md:flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-gray-600">
          <Shapes size={16} />
          <span>Elements</span>
        </div>

        <button
          onClick={handleAddRectangle}
          className="w-full flex items-center justify-center md:justify-start gap-3 rounded-lg border border-gray-200 px-2 md:px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Square size={18} />
          <span className="hidden md:inline">Rectangle</span>
        </button>

        <button
          onClick={handleAddCircle}
          className="w-full flex items-center justify-center md:justify-start gap-3 rounded-lg border border-gray-200 px-2 md:px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Circle size={18} />
          <span className="hidden md:inline">Circle</span>
        </button>

        <button
          onClick={handleAddTriangle}
          className="w-full flex items-center justify-center md:justify-start gap-3 rounded-lg border border-gray-200 px-2 md:px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Triangle size={18} />
          <span className="hidden md:inline">Triangle</span>
        </button>

        <button
          onClick={handleAddTextBox}
          className="w-full flex items-center justify-center md:justify-start gap-3 rounded-lg border border-gray-200 px-2 md:px-3 py-2 hover:bg-gray-100 transition text-gray-700"
        >
          <Type size={18} />
          <span className="hidden md:inline">Text</span>
        </button>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <div className="hidden md:flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-gray-600">
          <Palette size={16} />
          <span>Colors</span>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-3">
          {/* Color preview */}
          <button
            onClick={() => setColorModalOpen(true)}
            className="h-8 w-8 rounded border cursor-pointer"
            style={{ backgroundColor: hex }}
          />

          <span className="hidden md:inline text-sm text-gray-600">{hex}</span>
        </div>

        {/* Desktop picker */}
        <div className="hidden md:block">
          <Compact
            color={hex}
            onChange={(color) => {
              if (selectedObjId) {
                const canvas = fabricRef.current;
                const obj = canvas
                  ?.getObjects()
                  .find(
                    (o: FabricObject) => o.get("objectId") === selectedObjId,
                  );

                if (obj) {
                  obj.set("fill", color.hex);
                  canvas?.renderAll();
                }
              }

              setHex(color.hex);
            }}
          />
        </div>

        {/* Mobile dialog */}
        <Modal
          open={colorModalOpen}
          onClose={() => setColorModalOpen(false)}
          center
        >
          <div className="pt-2">
            <Compact
              color={hex}
              onChange={(color) => {
                if (selectedObjId) {
                  const canvas = fabricRef.current;
                  const obj = canvas
                    ?.getObjects()
                    .find(
                      (o: FabricObject) => o.get("objectId") === selectedObjId,
                    );

                  if (obj) {
                    obj.set("fill", color.hex);
                    canvas?.renderAll();
                  }
                }

                setHex(color.hex);
              }}
            />
          </div>
        </Modal>
      </div>

      {/* Clear */}
      <div className="md:mt-auto">
        <button
          onClick={handleClearCanvas}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-2 md:px-3 py-2 text-white hover:bg-red-600 transition"
        >
          <Trash2 size={18} />
          <span className="hidden md:inline">Clear Canvas</span>
        </button>
      </div>
    </aside>
  );
}

export default Toolbar;
