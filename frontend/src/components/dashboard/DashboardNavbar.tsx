import { useNavigate } from "react-router-dom";
import { signOut } from "../../lib/auth-client";
import JoinBoardModal from "./JoinBoardModal";
import { useState } from "react";

function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/auth/login");
        },
      },
    });
  };
  return (
    <nav className="flex justify-between border-b px-8 py-4 h-18">
      <h1 className="text-2xl font-bold">Squiggle</h1>
      <ul className="flex gap-3">
        <li>
          <button
            className="px-6 py-3 bg-blue-800 text-white rounded-md"
            onClick={() => setOpen(true)}
          >
            Join Room
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-400 text-white rounded-md"
          >
            Logout
          </button>
        </li>
      </ul>
      <JoinBoardModal open={open} onCloseModal={() => setOpen(false)} />
    </nav>
  );
}

export default DashboardNavbar;
