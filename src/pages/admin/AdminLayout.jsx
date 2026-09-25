import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, Users } from "lucide-react";
import { useAdminAuth } from "../../components/AdminAuthContext";
import { useCustomerAuth } from "../../components/CustomerAuthContext";

export function AdminLayout() {
  const { logout } = useAdminAuth();
  const { signOut } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    await signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/customers", label: "Verified Customers", icon: Users },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <h2 className="font-serif text-base text-amber-700">Dar Al Rehan Admin</h2>
        <button onClick={() => setSidebarOpen(true)} className="text-neutral-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-neutral-200 bg-white p-6 md:block">
        <SidebarContent navItems={navItems} pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-50 h-full w-64 bg-white p-6 shadow-xl md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-4 text-neutral-500"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent navItems={navItems} pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 bg-neutral-50 p-4 pt-20 md:p-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarContent({ navItems, pathname, onNavigate, onLogout }) {
  return (
    <>
      <h2 className="mb-8 font-serif text-lg text-amber-700">Dar Al Rehan Admin</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-amber-50 text-amber-700" : "text-neutral-700 hover:bg-amber-50"
              }`}
            >
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="mt-6 flex items-center gap-2 rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
    </>
  );
}