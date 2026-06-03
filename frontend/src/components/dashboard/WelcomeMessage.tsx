import { useSession } from "../../lib/auth-client";

function WelcomeMessage() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex gap-4 items-center">
      {user?.image ? (
        <img src={user.image} className="h-15 w-15 rounded-full" />
      ) : (
        <div className="h-15 w-15 rounded-full flex justify-center items-center bg-blue-600 text-white font-bold text-lg">
          <p>{user?.name[0].toUpperCase()}</p>
        </div>
      )}
      <p className="text-xl font-bold">Welcome {user?.name.split(" ")[0]}!</p>
    </div>
  );
}

export default WelcomeMessage;
