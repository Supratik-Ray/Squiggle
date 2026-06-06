import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

function Protected({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }
  if (session) {
    return children;
  }
  return <Navigate to="/auth/login" replace />;
}

export default Protected;
