import { Loader2, Plus } from "lucide-react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import WelcomeMessage from "../components/dashboard/WelcomeMessage";
import "react-responsive-modal/styles.css";
import { useState } from "react";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import BoardCard from "../components/dashboard/BoardCard";
import { type Board } from "../types/Board";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api/boards";

function Dashboard() {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const {
    data: drawingBoards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />

      <main className="flex-1 p-8 md:p-12 lg:p-16">
        <WelcomeMessage />

        <section className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Drawing Boards
            </h2>

            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 transition-colors text-white px-5 py-3 rounded-xl shadow-md"
            >
              <Plus size={18} />
              New Board
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 size={40} className="animate-spin text-blue-700" />
            </div>
          ) : error ? (
            <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <h3 className="text-lg font-semibold text-red-700">
                Failed to load boards
              </h3>

              <p className="text-red-600 mt-2">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong."}
              </p>
            </div>
          ) : drawingBoards.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No boards yet
              </h3>
              <p className="text-slate-500 mt-2">
                Create your first drawing board to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {drawingBoards.map((board: Board) => (
                <BoardCard key={board._id} board={board} />
              ))}
            </div>
          )}
        </section>

        <CreateBoardModal open={open} onCloseModal={onCloseModal} />
      </main>
    </div>
  );
}

export default Dashboard;
