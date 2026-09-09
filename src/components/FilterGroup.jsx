import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FilterGroup({ title, children }) {
  const [isOpen, setIsOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  return (
    <div className="mb-4 border-b border-neutral-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}   