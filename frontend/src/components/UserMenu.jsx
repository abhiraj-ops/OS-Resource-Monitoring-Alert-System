import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserMenu({ user, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-lg border border-[#30405b] px-3 py-2 text-sm text-[#c1ccdc] hover:bg-[#182337] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
        aria-label="User menu"
      >
        <User className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline truncate max-w-24" title={user?.email}>
          {user?.email}
        </span>
        <LogOut className="w-4 h-4 ml-1" aria-hidden="true" />
      </button>
    </div>
  );
}

export default UserMenu;
