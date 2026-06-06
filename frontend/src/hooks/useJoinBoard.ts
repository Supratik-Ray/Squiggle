import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinBoard } from "../api/boards";

export function useJoinBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
}
