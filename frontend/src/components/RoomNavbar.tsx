import type { Participant } from "../types/Participant";

function RoomNavbar({
  roomId,
  participants,
}: {
  roomId: string;
  participants: Participant[];
}) {
  return (
    <nav className="h-16 border-b bg-white px-6 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Squiggle</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Room Code */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Room</span>
          <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-mono font-medium">
            {roomId}
          </span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {participants.length} member
            {participants.length !== 1 ? "s" : ""}
          </span>

          <div className="flex -space-x-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                title={participant.name}
                className="h-13 w-13 overflow-hidden rounded-full border-2 border-white bg-green-700 text-white flex items-center justify-center font-medium shadow-sm"
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
