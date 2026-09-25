import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FilterSidebar({ children, onClear, activeCount = 0 }) {
  const [open, setOpen] = useState(false);

  // Drawer khula ho to peeche ka page scroll na ho
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="w-full flex-shrink-0 md:w-64">
      {/* ===== Phone: 3 line wala button ===== */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 self-start rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium tracking-wide text-neutral-700 shadow-sm transition-colors hover:border-amber-600 hover:text-amber-700 md:hidden"
      >
        <Menu className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-700 px-1 text-[10px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* ===== Phone: left side drawer ===== */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-xs flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <h2 className="font-serif text-lg text-neutral-800">Filters</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClear}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

              <div className="border-t border-neutral-200 px-5 py-3">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full bg-neutral-900 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-amber-800"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Desktop: pehle jaisa sidebar ===== */}
      <aside className="hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-lg text-neutral-800">Filters</h2>
          <button
            onClick={onClear}
            className="text-xs text-amber-700 hover:underline"
          >
            Clear All
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}