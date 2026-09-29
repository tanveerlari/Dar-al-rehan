import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";

const ADMIN_EMAILS = ["rehanpatel346@gmail.com", "laritanveer55@gmail.com"];

export function AdminProtectedRoute({ children }) {
  const { adminUser, loading: adminLoading } = useAdminAuth();
  const { user, loading: customerLoading } = useCustomerAuth();

  if (adminLoading && customerLoading) {
    return <p className="p-10 text-center text-sm text-neutral-500">Loading...</p>;
  }

  const currentEmail = (adminUser?.email || user?.email || "").toLowerCase();
  const isAdmin = ADMIN_EMAILS.some((email) => email.toLowerCase() === currentEmail);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}