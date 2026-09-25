import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../components/CartContext";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const productLink = `/product/${product.routeType || product.type.toLowerCase()}/${product.id}`;

  return (
    <div className="group relative flex h-full flex-col pt-3 sm:pt-8">
      {/* Card ka box (Link nahi hai, taaki andar button rakhna valid rahe) */}
      <div className="relative flex h-full flex-col rounded-2xl bg-[#FAF6F0] p-3 sm:p-5 border border-[#EADBCA]/70 shadow-[0_4px_18px_rgba(60,35,10,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(60,35,10,0.09)] hover:border-amber-900/15">
        {/* Sirf ye hissa link hai */}
        <Link to={productLink} className="flex flex-1 flex-col">
          {/* ================= BOTTLE SHOWCASE ================= */}
          <div className="relative -mt-8 sm:-mt-14 flex flex-col items-center justify-end">
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-28 w-28 sm:h-36 sm:w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-2xl transition-all duration-700 group-hover:bg-amber-100/30 group-hover:scale-105" />

            <div className="relative z-10 flex h-44 sm:h-52 md:h-56 w-full items-end justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                style={{
                  transform: `scale(${product.imageScaleX || 1}, ${product.imageScaleY || 1})`,
                }}
                className="max-h-full w-auto object-contain drop-shadow-[0_10px_14px_rgba(50,25,5,0.20)] transition-transform duration-500"
              />
            </div>

            <div className="relative z-0 -mt-1.5 w-full flex flex-col items-center">
              <div className="relative w-4/5 flex items-center justify-center">
                <div className="h-2 w-20 sm:w-28 rounded-[50%] bg-amber-950/50 blur-[2px] transition-all duration-500 group-hover:scale-90 group-hover:opacity-40" />
                <div className="absolute -bottom-0.5 h-3.5 w-32 sm:w-44 rounded-[50%] bg-amber-950/15 blur-md transition-all duration-500 group-hover:scale-105 group-hover:opacity-25" />
              </div>
              <div className="mt-1 h-[1px] w-3/5 bg-gradient-to-r from-transparent via-amber-900/15 to-transparent" />
            </div>
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div className="mt-3 sm:mt-4 flex flex-col items-center text-center">
            <span className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-800/80">
              DAR AL REHAN
            </span>

            <h3 className="mt-1 w-full truncate font-serif text-sm sm:text-lg font-medium text-neutral-900 transition-colors duration-300 group-hover:text-amber-900">
              {product.name}
            </h3>

            <p className="mt-0.5 w-full truncate text-[10px] sm:text-xs font-light uppercase tracking-wider text-neutral-500">
              {product.type} {product.size ? `• ${product.size}` : ""}
            </p>

            <div className="hidden sm:block mt-1 h-4 w-full">
              {product.notes && (
                <p className="truncate text-[11px] font-light italic text-neutral-400">
                  {product.notes}
                </p>
              )}
            </div>

            <div className="mt-1.5 sm:mt-2 flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-[11px] sm:text-xs font-medium text-neutral-700">
                {product.rating}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400">
                ({product.reviews || 0})
              </span>
            </div>
          </div>

          {/* ================= PRICE ================= */}
          <div className="mt-auto pt-3 sm:pt-4">
            <div className="mb-2 sm:mb-3 h-px w-full bg-gradient-to-r from-transparent via-amber-900/15 to-transparent" />

            <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
              <span className="font-serif text-base sm:text-xl font-semibold text-neutral-900">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* ================= ADD TO CART (Link ke bahar) ================= */}
        <div className="pt-2 sm:pt-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-[8px] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.18em] text-white shadow-sm transition-all duration-300 ${
              isAdded
                ? "bg-emerald-700"
                : "bg-neutral-900 hover:bg-[#3A2716] hover:shadow-md"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-amber-300" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}