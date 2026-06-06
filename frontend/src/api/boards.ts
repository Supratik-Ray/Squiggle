import { api } from "./axios";

export async function getBoards() {
  const res = await api.get("/boards");
  return res.data.data;
}

export async function createBoard({
  name,
  roomId,
}: {
  name: string;
  roomId: string;
}) {
  const res = await api.post("/boards", {
    name,
    roomId,
  });

  return res.data.data;
}

export async function joinBoard(roomId: string) {
  await api.post(`/boards/${roomId}/join`);
}

export async function deleteBoard(roomId: string) {
  await api.delete(`/boards/${roomId}`);
}
