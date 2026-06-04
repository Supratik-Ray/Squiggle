import { Link } from "react-router-dom";
import type { Board } from "../../types/Board";

function BoardCard({ board }: { board: Board }) {
  return (
    <Link
      to={`/drawing-board/${board.roomId}`}
      key={board._id}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="h-32 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 mb-5" />

      <h3 className="font-bold text-lg text-slate-900 truncate">
        {board.name}
      </h3>

      <p className="text-sm text-slate-500 mt-2">Room Code: {board.roomId}</p>

      <p className="text-xs text-slate-400 mt-4">
        Created {new Date(board.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}

export default BoardCard;
