import { Link, useNavigate } from "react-router-dom";
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
    <>
      <nav
        className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-3
        border-b
        px-4
        sm:px-6
        md:px-8
        py-3
        bg-white
      "
      >
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold shrink-0">
          Squiggle
        </Link>

        {/* Actions */}
        <ul className="flex w-full sm:w-auto gap-2 sm:gap-3 sm:justify-end">
          <li className="flex-1 sm:flex-none">
            <button
              onClick={() => setOpen(true)}
              className="
              w-full
              sm:w-auto
              rounded-md
              bg-blue-800
              px-4
              sm:px-6
              py-2
              sm:py-3
              text-sm
              sm:text-base
              text-white
              hover:bg-blue-900
              transition
            "
            >
              Join Room
            </button>
          </li>

          <li className="flex-1 sm:flex-none">
            <button
              onClick={handleLogout}
              className="
              w-full
              sm:w-auto
              rounded-md
              bg-red-500
              px-4
              sm:px-6
              py-2
              sm:py-3
              text-sm
              sm:text-base
              text-white
              hover:bg-red-600
              transition
            "
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <JoinBoardModal open={open} onCloseModal={() => setOpen(false)} />
    </>
  );
}

export default DashboardNavbar;
