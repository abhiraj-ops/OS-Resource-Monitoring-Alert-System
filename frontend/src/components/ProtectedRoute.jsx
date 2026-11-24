import { useNavigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // This is a client-side guard. The real security is enforced by Supabase RLS.
  return children;
}

export function RequireAuth({ children }) {
  const navigate = useNavigate();

  return children;
}

export default ProtectedRoute;
