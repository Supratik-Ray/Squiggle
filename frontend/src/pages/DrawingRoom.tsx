import {
  Canvas,
  FabricObject,
  util,
  type FabricObjectProps,
  type TextStyle,
} from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";

import Toolbar from "../components/drawing-room/Toolbar";
import RoomNavbar from "../components/drawing-room/RoomNavbar";
import { useSocket } from "../contexts/socket/useSocket";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { Participant } from "../types/Participant";
import { generateId } from "../utils/id";
import { saveBoard } from "../api/boards";

function DrawingRoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const isRemoteUpdate = useRef<boolean>(false);
  const { socket } = useSocket();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleSocketError = useCallback(
    ({ error }: { error: string }) => {
      toast.error(error);
      navigate("/dashboard");
    },
    [navigate],
  );

  const handleRoomJoined = useCallback(
    async ({
      roomId,
      participants,
      snapshot,
    }: {
      roomId: string;
      participants: Participant[];
      snapshot?: object;
    }) => {
      setParticipants(participants);

      if (snapshot && fabricRef.current) {
        isRemoteUpdate.current = true;
        await fabricRef.current.loadFromJSON(snapshot);

        // Re-lock all paths after restore
        fabricRef.current.getObjects().forEach((obj) => {
          if (obj.type === "path") {
            obj.set({
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
            });
          }
        });

        fabricRef.current.renderAll();
        isRemoteUpdate.current = false;
      }

      toast.success(`joined board with room-id: ${roomId}`);
    },
    [],
  );

  const handleNewUserJoined = useCallback(({ user }: { user: Participant }) => {
    setParticipants((prev) => [...prev, user]);
    toast.success(`${user.name} joined the room!`);
  }, []);

  const handleUserLeft = useCallback(({ user }: { user: Participant }) => {
    setParticipants((prev) => prev.filter((u) => u.id !== user.id));
  }, []);

  const handleCreatePath = useCallback(
    async ({ path }: { path: FabricObjectProps }) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const objs = await util.enlivenObjects([path]);

      isRemoteUpdate.current = true;
      const obj = objs[0] as FabricObject;
      obj.set({
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
      });
      canvas.add(obj);
      isRemoteUpdate.current = false;
    },
    [],
  );

  const handleObjectAdd = useCallback(
    async ({ object }: { object: FabricObjectProps }) => {
      isRemoteUpdate.current = true;

      const objs = await util.enlivenObjects([object]);
      fabricRef.current?.add(objs[0] as FabricObject);

      isRemoteUpdate.current = false;
    },
    [],
  );

  const handleObjectMoving = useCallback(
    ({
      objectId,
      left,
      top,
    }: {
      objectId: string;
      left: string;
      top: string;
    }) => {
      const obj = fabricRef.current
        ?.getObjects()
        .find((o: FabricObject) => o.get("objectId") === objectId);

      if (!obj) return;

      obj.set({
        left,
        top,
      });

      fabricRef.current?.renderAll();
    },
    [],
  );

  const handleCanvasClear = useCallback(() => {
    isRemoteUpdate.current = true;
    fabricRef.current?.clear();
    fabricRef.current?.set("backgroundColor", "#f5f5f5");
    fabricRef.current?.renderAll();
    isRemoteUpdate.current = false;
  }, []);

  const handleObjectModified = useCallback(
    ({ objectId, ...transform }: { objectId: string }) => {
      const obj = fabricRef.current
        ?.getObjects()
        .find((o: FabricObject) => o.get("objectId") === objectId);

      if (!obj) return;
      obj.set(transform);
      obj.setCoords();
      fabricRef.current?.renderAll();
    },
    [],
  );

  const handleTextUpdate = useCallback(
    ({
      objectId,
      text,
      styles,
      left,
      top,
    }: {
      objectId: string;
      text: string;
      styles: TextStyle;
      left: number;
      top: number;
    }) => {
      console.log("text:update", text);
      const canvas = fabricRef.current;
      const obj = canvas
        ?.getObjects()
        .find((o: FabricObject) => o.get("objectId") === objectId);

      console.log(obj);
      console.log(obj?.type);
      if (obj && obj.type === "textbox") {
        isRemoteUpdate.current = true;

        obj.set({ text, styles, left, top });
        obj.setCoords();
        canvas?.renderAll();

        isRemoteUpdate.current = false;
      }
    },
    [],
  );

  const handleObjectRemove = useCallback(
    ({ objectId }: { objectId: string }) => {
      isRemoteUpdate.current = true;

      const canvas = fabricRef.current;
      const obj = canvas
        ?.getObjects()
        .find((o: FabricObject) => o.get("objectId") === objectId);

      console.log("removed object: ", obj);
      if (obj) {
        obj.dispose();
        canvas?.remove(obj);
        canvas?.renderAll();
      }
      isRemoteUpdate.current = false;
    },
    [],
  );

  useEffect(() => {
    socket?.on("socket:error", handleSocketError);
    socket?.on("room:joined", handleRoomJoined);
    socket?.on("user:joined", handleNewUserJoined);
    socket?.on("user:left", handleUserLeft);
    socket?.on("canvas:path:create", handleCreatePath);
    socket?.on("canvas:object:add", handleObjectAdd);
    socket?.on("canvas:object:moving", handleObjectMoving);
    socket?.on("canvas:clear", handleCanvasClear);
    socket?.on("canvas:object:modified", handleObjectModified);
    socket?.on("canvas:text:update", handleTextUpdate);
    socket?.on("canvas:object:remove", handleObjectRemove);

    return () => {
      socket?.removeListener("room:joined", handleRoomJoined);
      socket?.removeListener("socket:error", handleSocketError);
      socket?.removeListener("user:joined", handleNewUserJoined);
      socket?.removeListener("user:joined", handleUserLeft);
      socket?.removeListener("canvas:path:create", handleCreatePath);
      socket?.removeListener("canvas:object:add", handleObjectAdd);
      socket?.removeListener("canvas:object:moving", handleObjectMoving);
      socket?.removeListener("canvas:clear", handleCanvasClear);
      socket?.removeListener("canvas:object:modified", handleObjectModified);
      socket?.removeListener("canvas:text:update", handleTextUpdate);
      socket?.removeListener("canvas:object:remove", handleObjectRemove);
    };
  }, [
    socket,
    handleRoomJoined,
    handleSocketError,
    handleNewUserJoined,
    handleUserLeft,
    handleCreatePath,
    handleObjectAdd,
    handleObjectMoving,
    handleCanvasClear,
    handleObjectModified,
    handleTextUpdate,
    handleObjectRemove,
  ]);

  useEffect(() => {
    socket?.emit("room:join", { roomId });

    return () => {
      socket?.emit("user:left");
    };
  }, [roomId, socket]);

  useEffect(() => {
    FabricObject.customProperties = ["objectId"];
    if (canvasRef.current) {
      fabricRef.current = new Canvas(canvasRef.current, {
        backgroundColor: "#f5f5f5",
      });

      const canvas = fabricRef.current;

      canvas.setDimensions({
        width: containerRef.current?.clientWidth,
        height: containerRef.current?.clientHeight,
      });

      canvas.on("path:created", (e) => {
        console.log("path:Created");
        const path = e.path;
        if (path) {
          path.set({
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
          });
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
        if (isRemoteUpdate.current) return;

        if (!path.get("objectId")) {
          path.set("objectId", generateId());
        }

        socket?.emit("canvas:path:create", {
          roomId,
          path: path.toObject(),
        });
      });

      canvas.on("object:added", (e) => {
        if (isRemoteUpdate.current) return;

        const obj = e.target;

        // Paths are handled by path:created — skip them here
        if (obj.type === "path") return;

        if (!obj.get("objectId")) {
          obj.set("objectId", generateId());
        }
        socket?.emit("canvas:object:add", {
          roomId,
          object: obj.toObject(),
        });
      });

      canvas.on("object:moving", (e) => {
        if (isRemoteUpdate.current) return;

        const obj = e.target;

        socket?.emit("canvas:object:moving", {
          roomId,
          objectId: obj?.get("objectId"),
          left: obj?.left,
          top: obj?.top,
        });
      });

      canvas.on("canvas:cleared", () => {
        if (isRemoteUpdate.current) return;
        socket?.emit("canvas:clear", { roomId });
      });

      canvas.on("object:modified", (e) => {
        if (isRemoteUpdate.current) return;

        const obj = e.target;

        socket?.emit("canvas:object:modified", {
          roomId,
          objectId: obj.get("objectId"),
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          flipX: obj.flipX,
          flipY: obj.flipY,
        });
      });

      canvas.on("object:removed", (e) => {
        if (isRemoteUpdate.current) return;
        const obj = e.target;
        console.log("emitted: ", obj.get("objectId"));
        socket?.emit("canvas:object:remove", {
          roomId,
          objectId: obj.get("objectId"),
        });
      });

      canvas.on("text:changed", (e) => {
        if (isRemoteUpdate.current) return;
        const obj = e.target;

        socket?.emit("canvas:text:update", {
          roomId,
          objectId: obj.get("objectId"),
          text: obj.text,
          styles: obj.styles,
          left: obj.left,
          top: obj.top,
        });
      });
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, [roomId, socket]);

  //saves canvas snapshot to DB every 5 second
  useEffect(() => {
    const isLeader = participants[0]?.socketId === socket?.id;
    if (!roomId || !isLeader) return;

    const interval = setInterval(() => {
      const snapshot = fabricRef.current?.toJSON();
      saveBoard(roomId, snapshot);
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId, participants, socket]);

  return (
    <div className="flex flex-col h-screen">
      <RoomNavbar roomId={roomId as string} participants={participants} />
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
