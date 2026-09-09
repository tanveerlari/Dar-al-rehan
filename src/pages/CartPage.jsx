import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { useCart } from "../components/CartContext";
import { collectionsProducts } from "../data";
import { ProductCard } from "../components/ProductCard";

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const suggestions = collectionsProducts
    .filter(
      (p) => !cartItems.some((item) => item.type === p.type && item.id === p.id)
    )
    .slice(0, 2);

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Cart</span>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-14">
        <h1 className="mb-6 font-serif text-3xl text-neutral-800">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-4 inline-block rounded-full border border-amber-700 px-6 py-2.5 text-xs font-medium tracking-wide text-amber-700 hover:bg-amber-700 hover:text-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10 md:flex-row">
            <div className="flex-1 divide-y divide-neutral-200">
              {cartItems.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 py-5">
                  <img src={item.image} alt={item.name} className="h-20 w-20 object-contain" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.type} · {item.size}</p>
                    <p className="mt-1 text-sm font-medium text-neutral-800">₹{item.price}</p>
                  </div>

                  <div className="flex items-center rounded-full border border-neutral-300">
                    <button
                      onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                      className="p-2 text-neutral-600 hover:text-amber-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                      className="p-2 text-neutral-600 hover:text-amber-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.type, item.id)}
                    className="p-2 text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full rounded-md border border-neutral-200 p-6 md:w-80">
              <h2 className="font-serif text-lg text-neutral-800">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-800">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-full bg-amber-700 py-3 text-center text-sm font-medium tracking-wide text-white transition-colors hover:bg-amber-800"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        )}

        {/* You Might Also Like */}
        {suggestions.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-10">
            <h2 className="mb-6 font-serif text-xl text-neutral-800">You Might Also Like</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {suggestions.map((product) => (
                <ProductCard key={`${product.type}-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}