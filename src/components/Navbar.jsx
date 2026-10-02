import { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  X,
  Home,
  Sparkles,
  Droplet,
  LayoutGrid,
  Info,
  ShieldCheck,
} from "lucide-react";
import { navLinks, collectionsProducts } from "../data";
import { useCart } from "../components/CartContext";
import logoImg from "../assets/logo.png";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

// Icon mapping for the bottom mobile nav bar
const bottomNavIcons = {
  "/": Home,
  "/shop": ShoppingBag,
  "/perfumes": Sparkles,
  "/attar": Droplet,
  "/collections": LayoutGrid,
  "/about": Info,
};

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, openAuthModal, signOut } = useCustomerAuth();
  const { supabaseProducts } = useSupabaseProducts();

  // Merge static + Supabase products for full search coverage
  const allSearchProducts = useMemo(
    () => [...collectionsProducts, ...supabaseProducts],
    [supabaseProducts]
  );

  const matches =
    searchTerm.trim().length > 0
      ? allSearchProducts
          .filter(
            (p) =>
              (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
              (p.notes || "").toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5)
      : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = () => {
    if (searchTerm.trim().length === 0) return;
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    setShowResults(false);
    setMobileSearchOpen(false);
  };

  const goToProduct = (name) => {
    setSearchTerm("");
    setShowResults(false);
    setMobileSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(name)}`);
  };

  return (
    <>
      {/* ── Ultra-Modern Luxury Running Marquee Ribbon ── */}
      <Link
        to="/shop"
        className="group relative block w-full overflow-hidden bg-gradient-to-r from-[#120a04] via-[#221509] to-[#120a04] py-2 border-b border-amber-500/25 transition-colors hover:border-amber-400/50"
      >
        {/* Soft edge fade masks for seamless high-fashion feel */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#120a04] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#120a04] to-transparent z-10" />

        <div className="animate-marquee-smooth flex items-center text-[10.5px] sm:text-[11.5px] tracking-[0.16em] font-medium text-amber-200/90 uppercase">
          {/* Loop Segment 1 */}
          <div className="flex items-center gap-6 sm:gap-9 pr-6 sm:pr-9 flex-shrink-0">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span className="text-amber-400 text-xs">✦</span>
              <span>GRAND OPENING SPECIAL</span>
            </span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="flex items-center gap-1.5">
              <span>SPECIAL OFFER:</span>
              <strong className="text-amber-100 font-bold tracking-wider">FLAT 20% OFF ON ALL ORDERS</strong>
            </span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="text-amber-200/80">PURE HANDCRAFTED ROYAL ATTARS & FINE PERFUMES</span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="flex items-center gap-1 font-bold text-amber-300 underline underline-offset-4 group-hover:text-white transition-colors">
              <span>SHOP NOW</span>
              <span>→</span>
            </span>
          </div>

          {/* Loop Segment 2 (duplicate for continuous infinite flow) */}
          <div className="flex items-center gap-6 sm:gap-9 pr-6 sm:pr-9 flex-shrink-0" aria-hidden="true">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span className="text-amber-400 text-xs">✦</span>
              <span>GRAND OPENING SPECIAL</span>
            </span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="flex items-center gap-1.5">
              <span>SPECIAL OFFER:</span>
              <strong className="text-amber-100 font-bold tracking-wider">FLAT 20% OFF ON ALL ORDERS</strong>
            </span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="text-amber-200/80">PURE HANDCRAFTED ROYAL ATTARS & FINE PERFUMES</span>
            <span className="text-amber-500/50 text-[8px]">◆</span>
            <span className="flex items-center gap-1 font-bold text-amber-300 underline underline-offset-4 group-hover:text-white transition-colors">
              <span>SHOP NOW</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </Link>

      {/* border-b hata diya — navbar aur hero ke beech ki line yahi thi */}
      <div className="relative w-full bg-white">
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-5 pb-5 font-serif md:px-14">

          {/* Left: logo with text (desktop only) */}
          <div className="flex flex-shrink-0 items-center gap-3">
            {/* Desktop Logo & Brand Name */}
            <Link to="/" className="group hidden items-center gap-3 md:flex">
              <img
                src={logoImg}
                alt="Dar Al Rehan"
                className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col text-left">
                <span className="font-['Cinzel'] text-lg font-bold tracking-[0.22em] text-neutral-900 transition-colors group-hover:text-amber-800">
                  DAR AL REHAN
                </span>
                <span className="text-[9px] font-sans font-medium tracking-[0.35em] text-amber-800 uppercase -mt-0.5">
                  Perfumes & Attar
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile: Sirf Logo bilkul Perfect Center me */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
          >
            <img src={logoImg} alt="Dar Al Rehan" className="h-9 w-auto" />
          </Link>

          {/* Center: desktop nav links */}
          <div className="hidden flex-1 items-center justify-center gap-9 md:flex">
            {navLinks.map((link) => {
              const isActive = window.location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`relative cursor-pointer whitespace-nowrap pb-1 text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:text-amber-700 ${
                    isActive ? "text-amber-700" : "text-neutral-700"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-amber-700"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right: icons */}
          <div className="flex flex-shrink-0 items-center justify-end gap-2 md:gap-6">
            <div ref={searchRef} className="relative hidden md:block">
              <div className="group flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(180,131,20,0.12)]">
                <Search className="h-4 w-4 text-neutral-400 transition-colors group-focus-within:text-amber-700" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-Z0-9\s\-'.]/g, "");
                    if (clean.length > 60) return;
                    setSearchTerm(clean);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search fragrances..."
                  className="w-40 bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                />
                {searchTerm && (
                  <X
                    className="h-4 w-4 cursor-pointer text-neutral-400 hover:text-amber-700"
                    onClick={() => {
                      setSearchTerm("");
                      setShowResults(false);
                    }}
                  />
                )}
              </div>

              <AnimatePresence>
                {showResults && searchTerm.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full z-20 mt-2 w-72 rounded-md border border-neutral-200 bg-white py-2 shadow-lg"
                  >
                    {matches.length > 0 ? (
                      <>
                        {matches.map((product) => (
                          <div
                            key={`${product.routeType || product.type}-${product.id}`}
                            onClick={() => goToProduct(product.name)}
                            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-amber-50"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 flex-shrink-0 object-contain"
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium text-neutral-800">{product.name}</p>
                              <p className="text-xs text-neutral-500">{product.type}</p>
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={runSearch}
                          className="cursor-pointer border-t border-neutral-100 px-4 pt-2 text-center text-xs font-medium text-amber-700 hover:underline"
                        >
                          See all results for "{searchTerm}"
                        </div>
                      </>
                    ) : (
                      <p className="px-4 py-2 text-center text-sm text-neutral-500">No products found.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="rounded-full p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-700 md:hidden"
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => (user ? setShowUserMenu(!showUserMenu) : openAuthModal("/"))}
                className="rounded-full p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-700 md:p-2"
                title={user ? "Account" : "Sign In with Mobile OTP"}
              >
                {user ? (
                  user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.phone || user.user_metadata?.full_name || "User"}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-xs font-semibold text-white">
                      {(user.phone ? user.phone.slice(-2) : "U").toUpperCase()}
                    </div>
                  )
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>

              {user && showUserMenu && (
                <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-md border border-neutral-200 bg-white py-2 shadow-lg">
                  <p className="truncate px-4 py-1 text-sm font-semibold text-neutral-800">
                    {user.phone || user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="truncate px-4 pb-2 text-[11px] font-medium text-amber-700">
                    {user.isAdmin ? "👑 Admin Access" : user.phone ? "Verified Mobile Customer" : (user.email || "Customer")}
                  </p>

                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 border-t border-neutral-100 bg-amber-50/70 px-4 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full border-t border-neutral-100 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="group relative rounded-full p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-700 md:p-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[10px] font-medium text-white shadow-sm transition-transform duration-200 group-hover:scale-110">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-neutral-200 md:hidden"
            >
              <div className="px-6 py-3">
                <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 transition-all duration-300 focus-within:border-amber-600 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(180,131,20,0.12)]">
                  <Search className="h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^a-zA-Z0-9\s\-'.]/g, "");
                      if (clean.length > 60) return;
                      setSearchTerm(clean);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="Search fragrances..."
                    className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                  />
                  {searchTerm && (
                    <X
                      className="h-4 w-4 cursor-pointer text-neutral-400"
                      onClick={() => setSearchTerm("")}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {searchTerm.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 rounded-md border border-neutral-200 bg-white py-2 shadow-sm"
                    >
                      {matches.length > 0 ? (
                        <>
                          {matches.map((product) => (
                            <div
                              key={`${product.routeType || product.type}-${product.id}`}
                              onClick={() => goToProduct(product.name)}
                              className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-amber-50"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 flex-shrink-0 object-contain"
                              />
                              <div className="text-left">
                                <p className="text-sm font-medium text-neutral-800">{product.name}</p>
                                <p className="text-xs text-neutral-500">{product.type}</p>
                              </div>
                            </div>
                          ))}
                          <div
                            onClick={runSearch}
                            className="cursor-pointer border-t border-neutral-100 px-4 pt-2 text-center text-xs font-medium text-amber-700 hover:underline"
                          >
                            See all results for "{searchTerm}"
                          </div>
                        </>
                      ) : (
                        <p className="px-4 py-2 text-center text-sm text-neutral-500">No products found.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation bar (mobile only) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-white/95 px-1 pb-1 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden">
        {navLinks.map((link) => {
          const isActive = window.location.pathname === link.path;
          const Icon = bottomNavIcons[link.path] || LayoutGrid;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="relative flex flex-1 flex-col items-center"
            >
              <motion.div
                animate={{ y: isActive ? -10 : 0 }}
                whileTap={{ y: -12, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-amber-700 shadow-[0_6px_14px_-4px_rgba(180,131,20,0.55)]"
                    : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-neutral-500"
                  }`}
                />
              </motion.div>

              <span
                className={`mt-0.5 text-[10px] tracking-wide transition-all duration-300 ${
                  isActive
                    ? "-translate-y-1.5 font-medium text-amber-700 opacity-100"
                    : "translate-y-0 text-neutral-500 opacity-80"
                }`}
              >
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}