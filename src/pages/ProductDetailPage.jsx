import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ChevronRight, Minus, Plus } from "lucide-react";
import { collectionsProducts, sampleReviews } from "../data";
import { useCart } from "../components/CartContext";

export function ProductDetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = collectionsProducts.find(
    (p) => p.type.toLowerCase() === type && String(p.id) === id
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center md:px-14">
        <p className="text-neutral-600">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-amber-700 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-amber-700">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">{product.name}</span>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pb-10 md:flex-row md:px-14">
        <div className="flex flex-1 items-center justify-center rounded-md border border-neutral-200 bg-amber-50/30 p-10">
          <img src={product.image} alt={product.name} className="h-72 object-contain" />
        </div>

        <div className="flex-1">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            {product.type}
          </span>
          <h1 className="mt-3 font-serif text-3xl text-neutral-800">{product.name}</h1>
          <p className="mt-2 text-sm text-neutral-500">{product.notes}</p>

          <div className="mt-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm text-neutral-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-neutral-800">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-base text-neutral-400 line-through">₹{product.oldPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="rounded bg-amber-700 px-2 py-0.5 text-xs font-medium text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          <div className="mt-2 text-sm text-neutral-500">Size: {product.size}</div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-neutral-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-neutral-600 hover:text-amber-700"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-neutral-600 hover:text-amber-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-amber-700 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-amber-800"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="w-full border-t border-neutral-200 bg-amber-50/20">
        <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-14">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-neutral-800">Customer Reviews</h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= Math.round(product.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {product.rating} out of 5 ({product.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sampleReviews.map((review, index) => (
              <div
                key={index}
                className="rounded-md border border-neutral-200 bg-white p-5"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i <= review.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-neutral-600">{review.comment}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800">{review.name}</span>
                  <span className="text-xs text-neutral-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}