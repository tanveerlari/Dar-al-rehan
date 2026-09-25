import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const options = [
  { value: "popularity", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = options.find((o) => o.value === value) || options[0];

  // Bahar click ya Escape dabane pe band ho jaye
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border bg-[#FAF6F0] px-4 py-2 text-xs shadow-sm transition-all duration-300 hover:border-amber-600 ${
          open ? "border-amber-600 shadow-[0_0_0_3px_rgba(180,131,20,0.12)]" : "border-amber-900/20"
        }`}
      >
        <ArrowUpDown className="h-3.5 w-3.5 text-amber-700" />
        <span className="text-neutral-500">Sort by:</span>
        <span className="font-medium text-neutral-900">{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-amber-900/10 bg-white py-1.5 shadow-xl sm:left-auto sm:right-0"
          >
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors hover:bg-amber-50 ${
                      selected ? "font-medium text-amber-800" : "text-neutral-700"
                    }`}
                  >
                    {option.label}
                    {selected && <Check className="h-3.5 w-3.5 text-amber-700" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}