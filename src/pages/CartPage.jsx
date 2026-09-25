import { Link } from "react-router-dom";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Lock 
} from "lucide-react";
import { useCart } from "../components/CartContext";
import { collectionsProducts } from "../data";
import { ProductCard } from "../components/ProductCard";

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Estimated standard shipping starting from ₹40 (Actual calculated at checkout based on Pincode)
  const estimatedShipping = cartItems.length > 0 ? 50 : 0;
  const estimatedTotal = cartItems.length > 0 ? cartTotal + estimatedShipping : 0;

  const suggestions = collectionsProducts
    .filter(
      (p) => !cartItems.some((item) => (item.routeType || item.type) === (p.routeType || p.type) && item.id === p.id)
    )
    .slice(0, 4);

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Your Fragrance Bag</span>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-20 md:px-14 animate-hero-reveal">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-amber-950/10 pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-tight">
              Your Fragrance Bag
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} handcrafted item(s) selected
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-2 sm:mt-0 text-xs font-medium text-amber-800 hover:text-amber-900 underline underline-offset-4"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Royal Empty State */
          <div className="my-12 mx-auto max-w-md rounded-2xl border border-amber-950/10 bg-gradient-to-b from-[#FAF7F2] to-[#F3EDE2] p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/70 text-amber-800 shadow-inner">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl text-neutral-800">Your Fragrance Bag is Empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Your bag is currently awaiting its first precious scent. Discover our artisanal attars and royal perfumes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/attar"
                className="w-full sm:w-auto rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-wider text-white hover:bg-amber-800 transition-colors"
              >
                EXPLORE ATTARS
              </Link>
              <Link
                to="/perfumes"
                className="w-full sm:w-auto rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-xs font-medium tracking-wider text-neutral-800 hover:border-amber-700 hover:text-amber-800 transition-colors"
              >
                EXPLORE PERFUMES
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 lg:flex-row">
            
            {/* Left Column: Items List */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={`${item.routeType || item.type}-${item.id}`} 
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-950/10 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-900/25"
                >
                  <div className="flex items-center gap-4">
                    {/* Product Miniature Showcase */}
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F1E8DC] p-2 border border-amber-900/10">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider text-amber-800 uppercase">
                        Dar Al Rehan
                      </span>
                      <h3 className="font-serif text-base font-medium text-neutral-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {item.type} {item.size && `• ${item.size}`}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-neutral-800 sm:hidden">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Action Controls */}
                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-full border border-neutral-300 bg-neutral-50/60 px-1 py-0.5 shadow-inner">
                      <button
                        onClick={() => updateQuantity(item.routeType || item.type, item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-white hover:text-amber-800"
                        title="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.routeType || item.type, item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-white hover:text-amber-800"
                        title="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Total for this item */}
                    <div className="hidden sm:block text-right min-w-[70px]">
                      <p className="text-sm font-semibold text-neutral-900">
                        ₹{item.price * item.quantity}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-neutral-400">
                          (₹{item.price} each)
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.routeType || item.type, item.id)}
                      className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="sticky top-6 rounded-2xl border border-amber-950/10 bg-white p-6 shadow-md">
                
                <h2 className="font-serif text-xl font-medium text-neutral-900">
                  Order Summary
                </h2>
                <div className="mt-2 h-0.5 w-8 bg-amber-700" />

                <div className="mt-6 space-y-3 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-medium text-neutral-800">₹{cartTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-amber-700" /> Express Courier Shipping
                    </span>
                    <span className="font-medium text-neutral-700">Calculated at checkout</span>
                  </div>
                </div>

                <div className="my-5 border-t border-neutral-200" />

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-base font-medium text-neutral-900">Subtotal</span>
                    <p className="text-[10px] text-neutral-400">Inclusive of all taxes</p>
                  </div>
                  <span className="font-serif text-2xl font-bold text-amber-900">
                    ₹{cartTotal}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  to="/checkout"
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-xs font-semibold tracking-wider text-white shadow-md transition-all duration-300 hover:bg-amber-800 hover:shadow-lg"
                >
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 border-t border-neutral-100 pt-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <ShieldCheck className="h-4 w-4 text-amber-700 flex-shrink-0" />
                    <span>100% Authentic Botanical Extracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <Truck className="h-4 w-4 text-amber-700 flex-shrink-0" />
                    <span>Dispatched in Handcrafted Safe Packaging</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <Lock className="h-4 w-4 text-amber-700 flex-shrink-0" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* You Might Also Like Section */}
        {suggestions.length > 0 && (
          <div className="mt-20 border-t border-amber-950/10 pt-12">
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-amber-800 uppercase">
                  Curated For You
                </span>
                <h2 className="font-serif text-2xl text-neutral-900">
                  Complete Your Fragrance Wardrobe
                </h2>
              </div>
              <Link to="/collections" className="text-xs font-medium text-amber-800 hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {suggestions.map((product) => (
                <ProductCard key={`${product.routeType || product.type}-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}