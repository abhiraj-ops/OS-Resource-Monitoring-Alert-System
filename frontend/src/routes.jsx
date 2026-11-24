import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import NotFound from "./pages/NotFound.jsx";
import Settings from "./pages/Settings.jsx";
import { supabase } from "./services/supabase.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard supabase={supabase} demoMode={!supabase} />,
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/reset-password", element: <PasswordReset /> },
  { path: "/verify-email", element: <EmailVerification /> },
  { path: "/dashboard", element: <Dashboard supabase={supabase} session={null} demoMode={!supabase} /> },
  { path: "/settings", element: <Settings supabase={supabase} /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/refund", element: <RefundPolicy /> },
  { path: "/delete-account", element: <Settings supabase={supabase} openDelete={true} /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
