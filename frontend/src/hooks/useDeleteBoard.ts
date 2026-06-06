import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBoard } from "../api/boards";
import toast from "react-hot-toast";

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,

    onSuccess: () => {
      toast.success("board deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },

    onError: () => {
      toast.error("Error deleting board!");
    },
  });
}
