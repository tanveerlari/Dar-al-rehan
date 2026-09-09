import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";
import { X } from "lucide-react";
import { navLinks, collectionsProducts } from "../data";
import { useCart } from "../components/CartContext";
import logoImg from "../assets/logo.png";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const matches =
    searchTerm.trim().length > 0
      ? collectionsProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.notes.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="relative w-full border-b border-neutral-200 bg-white">
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-8 pb-5 font-serif md:px-14">

        {/* Left: hamburger (mobile only) + logo (desktop only) */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-30 flex h-6 w-6 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-0.5 w-6 bg-amber-700"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="h-0.5 w-6 bg-amber-700"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-0.5 w-6 bg-amber-700"
            />
          </button>

          <Link to="/" className="hidden items-center gap-2 md:flex">
            <img src={logoImg} alt="Dar Al Rehan" className="h-10 w-auto" />
            <span className="font-['Cinzel'] text-base font-semibold tracking-[0.2em] text-neutral-800">
              DAR-AL-REHAN
            </span>
          </Link>
        </div>

        {/* Mobile logo - true absolute center */}
        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
        >
          <img src={logoImg} alt="Dar Al Rehan" className="h-8 w-auto" />
        </Link>

        {/* Center: desktop nav links */}
        <div className="hidden flex-1 items-center justify-center gap-9 md:flex">
          {navLinks.map((link) => {
            const isActive = window.location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`relative cursor-pointer whitespace-nowrap pb-1 text-sm tracking-wide transition-colors hover:text-amber-700 ${
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
                  setSearchTerm(e.target.value);
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
                          key={`${product.type}-${product.id}`}
                          onClick={() => goToProduct(product.name)}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-amber-50"
                        >
                          <img src={product.image} alt={product.name} className="h-10 w-10 flex-shrink-0 object-contain" />
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

          <button className="rounded-full p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-700 md:p-2">
            <User className="h-5 w-5" />
          </button>

          <Link to="/cart" className="group relative rounded-full p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-700 md:p-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[10px] font-medium text-white shadow-sm transition-transform duration-200 group-hover:scale-110">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-0 z-10 bg-black/20 md:hidden"
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-full z-20 overflow-hidden border-t border-neutral-200 bg-white shadow-md md:hidden"
            >
              <div className="flex flex-col gap-1 p-6">
                {navLinks.map((link, index) => {
                  const isActive = window.location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`block rounded-md px-3 py-2.5 text-sm tracking-wide transition-colors ${
                          isActive ? "bg-amber-50 text-amber-700" : "text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search fragrances..."
                  className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                />
                {searchTerm && (
                  <X className="h-4 w-4 cursor-pointer text-neutral-400" onClick={() => setSearchTerm("")} />
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
                            key={`${product.type}-${product.id}`}
                            onClick={() => goToProduct(product.name)}
                            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-amber-50"
                          >
                            <img src={product.image} alt={product.name} className="h-10 w-10 flex-shrink-0 object-contain" />
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
  );
}