import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

function Guest({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default Guest;
