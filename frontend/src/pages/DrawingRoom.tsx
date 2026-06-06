import { Canvas } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";

import Toolbar from "../components/Toolbar";
import RoomNavbar from "../components/RoomNavbar";
import { useSocket } from "../contexts/socket/useSocket";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { Participant } from "../types/Participant";

function DrawingRoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
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
    ({
      roomId,
      participants,
    }: {
      roomId: string;
      participants: Participant[];
    }) => {
      setParticipants(participants);
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

  useEffect(() => {
    socket?.on("socket:error", handleSocketError);
    socket?.on("room:joined", handleRoomJoined);
    socket?.on("user:joined", handleNewUserJoined);
    socket?.on("user:left", handleUserLeft);

    return () => {
      socket?.removeListener("room:joined", handleRoomJoined);
      socket?.removeListener("socket:error", handleSocketError);
      socket?.removeListener("user:joined", handleNewUserJoined);
      socket?.removeListener("user:joined", handleUserLeft);
    };
  }, [
    socket,
    handleRoomJoined,
    handleSocketError,
    handleNewUserJoined,
    handleUserLeft,
  ]);

  useEffect(() => {
    socket?.emit("room:join", { roomId });

    return () => {
      socket?.emit("user:left");
    };
  }, [roomId, socket]);

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
