import { Loader2, Plus } from "lucide-react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import WelcomeMessage from "../components/dashboard/WelcomeMessage";
import "react-responsive-modal/styles.css";
import { useEffect, useState } from "react";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import toast from "react-hot-toast";

interface Board {
  _id: string;
  name: string;
  roomId: string;
  createdAt: string;
}

function Dashboard() {
  const [drawingBoards, setDrawingBoards] = useState<Board[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  async function fetchBoards() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/api/boards", {
        credentials: "include",
      });

      if (!response.ok) {
        throw toast.error("Failed to fetch boards");
      }

      const data = await response.json();

      setDrawingBoards(data.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

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
              {drawingBoards.map((board) => (
                <div
                  key={board._id}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="h-32 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 mb-5" />

                  <h3 className="font-bold text-lg text-slate-900 truncate">
                    {board.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Room Code: {board.roomId}
                  </p>

                  <p className="text-xs text-slate-400 mt-4">
                    Created {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
