import { Link } from "react-router-dom";
import { Copy, Trash2 } from "lucide-react";
import type { Board } from "../../types/Board";
import toast from "react-hot-toast";
import { useDeleteBoard } from "../../hooks/useDeleteBoard";

function BoardCard({ board }: { board: Board }) {
  const mutation = useDeleteBoard();
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(board.roomId);
    toast.success("Copied room code!");
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(board.roomId);
    console.log("Delete board:", board._id);
  };

  return (
    <Link
      to={`/drawing-board/${board.roomId}`}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex justify-end mb-3">
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
          title="Delete Board"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="h-32 rounded-xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 mb-5" />

      <h3 className="font-bold text-lg text-slate-900 truncate">
        {board.name}
      </h3>

      <div className="flex items-center gap-2 mt-2">
        <p className="text-sm text-slate-500">Room Code: {board.roomId}</p>

        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
          title="Copy Room ID"
        >
          <Copy size={14} />
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Created {new Date(board.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}

export default BoardCard;
