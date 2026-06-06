import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "../api/boards";
import toast from "react-hot-toast";

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,

    onSuccess: () => {
      toast.success("board created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },

    onError: () => {
      toast.error("Error creating board!");
    },
  });
}
