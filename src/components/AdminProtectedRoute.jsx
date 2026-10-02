import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { useCustomerAuth } from "./CustomerAuthContext";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "rehanpatel346@gmail.com,laritanveer55@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

const ADMIN_PHONES = (import.meta.env.VITE_ADMIN_PHONES || "8983284487")
  .split(",")
  .map((p) => p.replace(/\D/g, "").slice(-10));

export function AdminProtectedRoute({ children }) {
  const { adminUser, loading: adminLoading } = useAdminAuth();
  const { user, loading: customerLoading } = useCustomerAuth();

  if (adminLoading && customerLoading) {
    return <p className="p-10 text-center text-sm text-neutral-500">Loading...</p>;
  }

  const currentEmail = (adminUser?.email || user?.email || "").toLowerCase();
  const isEmailAdmin = ADMIN_EMAILS.some((email) => email === currentEmail);

  const cleanPhone = (user?.phone || "").replace(/\D/g, "").slice(-10);
  const isPhoneAdmin = user?.isAdmin || (cleanPhone && ADMIN_PHONES.includes(cleanPhone));

  const isAdmin = isEmailAdmin || isPhoneAdmin;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}