import type { Participant } from "../types/Participant";

function RoomNavbar({
  roomId,
  participants,
}: {
  roomId: string;
  participants: Participant[];
}) {
  return (
    <nav className="flex justify-between border-b px-8 py-4 h-18">
      <h1 className="text-2xl font-bold">Squiggle</h1>
      <ul className="flex items-center gap-3">
        <li>Room Code: {roomId}</li>
        <li>
          Members:{" "}
          {participants.map((participant) => (
            <span className="h-12 w-12 rounded-full overflow-hidden bg-green-800 text-white flex justify-center items-center">
              {participant.image ? (
                <img src={participant.image} className="w-full h-full" />
              ) : (
                <p className="">{participant.name[0].toUpperCase()}</p>
              )}
            </span>
          ))}
        </li>
      </ul>
    </nav>
  );
}

export default RoomNavbar;
