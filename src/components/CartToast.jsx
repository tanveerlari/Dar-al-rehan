import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

export function CartToast() {
  const { toast } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex w-80 items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-xl"
          >
            <img src={toast.image} alt={toast.name} className="h-12 w-12 flex-shrink-0 object-contain" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-xs font-medium text-green-700">Added to Cart</p>
              </div>
              <p className="mt-0.5 truncate text-sm font-semibold text-neutral-800">{toast.name}</p>
            </div>
            <Link
              to="/cart"
              className="flex-shrink-0 rounded-full border border-amber-700 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-700 hover:text-white"
            >
              View
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}