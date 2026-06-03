import { Plus } from "lucide-react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import WelcomeMessage from "../components/dashboard/WelcomeMessage";
import { useSession } from "../lib/auth-client";

function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="h-screen flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 p-16">
        <WelcomeMessage />
        <section className="mt-8">
          <div className="flex gap-6 items-center">
            <h2 className="text-2xl font-bold">Your drawing boards</h2>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-md flex gap-3">
              <Plus />
              Create new
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
