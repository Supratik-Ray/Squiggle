import { useNavigate } from "react-router-dom";
import { signOut } from "../../lib/auth-client";

function DashboardNavbar() {
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
          <button className="px-6 py-3 bg-blue-800 text-white rounded-md">
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
    </nav>
  );
}

export default DashboardNavbar;
