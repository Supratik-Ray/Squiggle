import Modal from "react-responsive-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type JoinBoardModalProps = {
  open: boolean;
  onCloseModal: () => void;
};

function JoinBoardModal({ open, onCloseModal }: JoinBoardModalProps) {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinBoard = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/boards/${roomId}/join`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Board not found");
        return;
      }

      toast.success("Successfully joined board!");
      console.log(data);

      onCloseModal();
      navigate(`/board/${roomId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to join board");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      classNames={{
        modal: "customModal",
      }}
    >
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Join Drawing Board
          </h2>

          <p className="text-slate-500 mt-2">
            Enter a board room ID to collaborate with others.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleJoinBoard}>
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Room ID
            </label>

            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. A7K9P2"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCloseModal}
              className="
                px-5
                py-2.5
                rounded-xl
                border
                border-slate-300
                font-medium
                hover:bg-slate-50
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5
                py-2.5
                rounded-xl
                bg-emerald-600
                text-white
                font-medium
                hover:bg-emerald-700
                transition
                shadow-sm
              "
            >
              Join Board
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default JoinBoardModal;
