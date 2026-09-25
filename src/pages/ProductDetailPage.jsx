import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ChevronRight, Minus, Plus, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { collectionsProducts, floraBelleProducts, sampleReviews } from "../data";
import { useCart } from "../components/CartContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { BottleStylesBanner } from "../components/BottleStylesBanner";
import { ImageGallery } from "../components/ImageGallery";

export function ProductDetailPage() {
  const { supabaseProducts } = useSupabaseProducts();
  const allProducts = [...collectionsProducts, ...floraBelleProducts, ...supabaseProducts];
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find(
    (p) => (p.routeType || p.type.toLowerCase()) === type && String(p.id) === id
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

      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pb-14 md:flex-row md:px-14">
        <ImageGallery images={product.images || [product.image, product.image2].filter(Boolean)} alt={product.name} />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100/70 px-3 py-1 text-[11px] font-semibold tracking-wider text-amber-900 uppercase">
              {product.type}
            </span>
            {product.category && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-600">
                {product.category}
              </span>
            )}
          </div>

          <h1 className="mt-3 font-serif text-3xl text-neutral-800 sm:text-4xl">{product.name}</h1>
          
          {product.notes && (
            <p className="mt-2 text-sm italic text-neutral-500">{product.notes}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-medium text-neutral-700">
              {product.rating} ({product.reviews || 0} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-3xl font-semibold text-neutral-900">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-base text-neutral-400 line-through">₹{product.oldPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="rounded bg-amber-700 px-2 py-0.5 text-xs font-semibold text-white">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Specifications Chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-600">
            {product.size && (
              <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1">
                <strong>Size:</strong> {product.size}
              </span>
            )}
            {product.family && (
              <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1">
                <strong>Fragrance Family:</strong> {product.family}
              </span>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="mt-6 rounded-xl border border-amber-950/10 bg-[#FAF7F2] p-4 text-sm leading-relaxed text-neutral-700">
              <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Sparkles className="h-3.5 w-3.5 text-amber-700" /> Description
              </h3>
              <p className="whitespace-pre-line text-xs sm:text-sm text-neutral-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-neutral-300 bg-neutral-50/60 px-1 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-white hover:text-amber-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-neutral-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-white hover:text-amber-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-neutral-900 py-3.5 text-xs font-semibold tracking-widest text-white transition-all duration-300 hover:bg-amber-800 hover:shadow-lg"
            >
              ADD TO CART
            </button>
          </div>

          {quantity > 1 && (
            <p className="mt-3 text-xs text-neutral-500">
              Subtotal ({quantity} items): <span className="font-semibold text-neutral-800">₹{product.price * quantity}</span>
            </p>
          )}

          {/* Trust Highlights */}
          <div className="mt-8 border-t border-neutral-200 pt-5 grid grid-cols-2 gap-3 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-700 flex-shrink-0" />
              <span>100% Authentic Product</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-700 flex-shrink-0" />
              <span>Express Delivery across India</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottle styles banner — sirf jin products me bottleShowcaseImage field hai unme dikhega */}
      {product.bottleShowcaseImage && (
        <BottleStylesBanner image={product.bottleShowcaseImage} />
      )}

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
                  {product.rating} out of 5 ({product.reviews || 0} reviews)
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