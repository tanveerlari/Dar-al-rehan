import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../assets/logo.png";
import attarBanner from "../assets/attar.png";
import perfumesBanner from "../assets/perfumes.png";
import shopBanner from "../assets/shopimg.png";

// Route-specific subtitles & banners for smart pre-caching
const ROUTE_CONFIG = {
  "/attar": {
    title: "ROYAL ATTAR",
    subtitle: "Distilling Pure Botanical Essences...",
    banner: attarBanner,
  },
  "/perfumes": {
    title: "FINE PERFUMES",
    subtitle: "Crafting Timeless Fragrances...",
    banner: perfumesBanner,
  },
  "/shop": {
    title: "SHOP ALL FRAGRANCES",
    subtitle: "Preparing Luxury Vitrine...",
    banner: shopBanner,
  },
  "/collections": {
    title: "EXCLUSIVE COLLECTIONS",
    subtitle: "Gathering Royal Masterpieces...",
    banner: null,
  },
  "/about": {
    title: "DAR AL REHAN",
    subtitle: "A Heritage of Pure Perfumery...",
    banner: null,
  },
};

export function RoyalPageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currentRouteInfo, setCurrentRouteInfo] = useState(null);
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    const current = location.pathname;

    // Only trigger when navigating to a different main route (not admin)
    if (prev !== current && !current.startsWith("/admin")) {
      const config = ROUTE_CONFIG[current];

      // Preload target banner in background so it renders instantly
      if (config?.banner) {
        const img = new Image();
        img.src = config.banner;
      }

      setCurrentRouteInfo(
        config || {
          title: "DAR AL REHAN",
          subtitle: "Loading Royal Experience...",
        }
      );

      setLoading(true);

      // 600ms duration: Fast enough to feel snappy, long enough for images to buffer
      const timer = setTimeout(() => {
        setLoading(false);
      }, 650);

      prevPathnameRef.current = current;
      return () => clearTimeout(timer);
    }

    prevPathnameRef.current = current;
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="royal-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF6F0]/95 backdrop-blur-md px-6 select-none"
        >
          {/* Subtle Golden Ambient Aura */}
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />

          {/* Loader Card */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            {/* Logo with Breathing Glow */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-amber-300/30 blur-xl animate-ping" />
              <img
                src={logoImg}
                alt="Dar Al Rehan"
                className="relative z-10 h-20 w-auto object-contain drop-shadow-[0_8px_16px_rgba(180,120,40,0.25)]"
              />
            </div>

            {/* Brand Title */}
            <span className="text-[10px] font-semibold tracking-[0.35em] text-amber-800 uppercase">
              DAR AL REHAN
            </span>

            {/* Route Title */}
            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-medium tracking-wide text-neutral-900">
              {currentRouteInfo?.title || "ROYAL FRAGRANCES"}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-xs font-light tracking-wider text-neutral-500 italic">
              {currentRouteInfo?.subtitle || "Loading Fine Essences..."}
            </p>

            {/* Elegant Slim Gold Progress Bar */}
            <div className="relative mt-6 h-1 w-44 overflow-hidden rounded-full bg-amber-950/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
                className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-amber-700 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
