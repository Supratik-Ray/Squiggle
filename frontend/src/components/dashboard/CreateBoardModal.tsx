import Modal from "react-responsive-modal";

type CreateBoardModalProps = {
  open: boolean;
  onCloseModal: () => void;
  handleCreateDrawingBoard: () => void;
};

function CreateBoardModal({
  open,
  onCloseModal,
  handleCreateDrawingBoard,
}: CreateBoardModalProps) {
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
            Create Drawing Board
          </h2>
          <p className="text-slate-500 mt-2">
            Give your board a name and start collaborating.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="boardName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Board Name
            </label>

            <input
              id="boardName"
              type="text"
              placeholder="e.g. Product Brainstorm"
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
              onClick={handleCreateDrawingBoard}
              className="
            px-5
            py-2.5
            rounded-xl
            bg-blue-600
            text-white
            font-medium
            hover:bg-blue-700
            transition
            shadow-sm
          "
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateBoardModal;
