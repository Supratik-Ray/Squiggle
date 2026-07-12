import toast from "react-hot-toast";
import type { Participant } from "../../types/Participant";
import { Save, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

function RoomNavbar({
  roomId,
  participants,
  onSave,
  isSaving,
}: {
  roomId: string;
  participants: Participant[];
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <nav
      className="
      border-b
      bg-white
      shadow-sm
      px-3
      sm:px-4
      md:px-6
      py-2
      flex
      items-center
      justify-between
      gap-3
      flex-wrap
    "
    >
      {/* Logo */}
      <div className="shrink-0">
        <Link to="/" className="text-lg sm:text-xl font-bold tracking-tight">
          Squiggle
        </Link>
      </div>

      {/* Right Side */}
      <div
        className="
        flex
        items-center
        gap-2
        sm:gap-4
        md:gap-6
        flex-wrap
        justify-end
        ml-auto
      "
      >
        {/* Room Code */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm text-gray-500">Room</span>

          <span className="rounded-md bg-gray-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono font-medium">
            {roomId}
          </span>
        </div>

        {/* Save */}
        <button
          onClick={() => {
            onSave();
            toast.success("Saved successfully!");
          }}
          className="
    flex
    items-center
    gap-2
    rounded-md
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-3
    py-2
    text-sm
    transition
  "
        >
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span className="hidden sm:inline">
            {isSaving ? "saving..." : "save"}
          </span>
        </button>

        {/* Participants */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden md:inline text-sm text-gray-500">
            {participants.length} member
            {participants.length !== 1 ? "s" : ""}
          </span>

          <div
            className="
            flex
            -space-x-2
            sm:-space-x-3
            overflow-x-auto
            max-w-[180px]
            md:max-w-none
            scrollbar-hide
          "
          >
            {participants.map((participant) => (
              <div
                key={participant.id}
                title={participant.name}
                className="
                h-8
                w-8
                sm:h-10
                sm:w-10
                md:h-11
                md:w-11
                lg:h-12
                lg:w-12
                shrink-0
                overflow-hidden
                rounded-full
                border-2
                border-white
                bg-green-700
                text-white
                flex
                items-center
                justify-center
                text-sm
                sm:text-base
                font-medium
                shadow-sm
              "
              >
                {participant.image ? (
                  <img
                    src={participant.image}
                    alt={participant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  participant.name[0]?.toUpperCase()
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default RoomNavbar;
