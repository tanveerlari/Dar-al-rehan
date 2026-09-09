import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useCart } from "../components/CartContext";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link
      to={`/product/${product.type.toLowerCase()}/${product.id}`}
      className="group relative block rounded-md border border-neutral-200 p-4 transition-shadow hover:shadow-md"
    >
      {product.discount > 0 && (
        <span className="absolute left-3 top-3 rounded bg-amber-700 px-2 py-0.5 text-[10px] font-medium text-white">
          -{product.discount}%
        </span>
      )}
      <span className="absolute right-3 top-3 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
        {product.type}
      </span>

      <img src={product.image} alt={product.name} className="mx-auto mt-6 h-40 object-contain" />

      <h3 className="mt-4 text-sm font-semibold text-neutral-800">{product.name}</h3>
      <p className="text-xs text-neutral-500">{product.notes}</p>

      <div className="mt-1 flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
        <span className="text-xs text-neutral-600">
          {product.rating} ({product.reviews})
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-800">₹{product.price}</span>
        {product.oldPrice && (
          <span className="text-xs text-neutral-400 line-through">₹{product.oldPrice}</span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-3 w-full rounded border border-amber-700 py-2 text-xs font-medium tracking-wide text-amber-700 transition-colors hover:bg-amber-700 hover:text-white"
      >
        ADD TO CART
      </button>
    </Link>
  );
}