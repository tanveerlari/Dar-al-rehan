import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle } from "lucide-react";
import { useCart } from "../components/CartContext";

export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim())) newErrors.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setOrderPlaced(true);
    clearCart();
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center md:px-14">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-amber-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center md:px-14">
        <CheckCircle className="mx-auto h-16 w-16 text-amber-700" />
        <h1 className="mt-4 font-serif text-2xl text-neutral-800">Order Placed Successfully!</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Thank you, {form.name}. We'll contact you at {form.phone} for delivery updates.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 rounded-full bg-amber-700 px-6 py-2.5 text-xs font-medium tracking-wide text-white hover:bg-amber-800"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/cart" className="hover:text-amber-700">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Checkout</span>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-14">
        <h1 className="mb-8 font-serif text-3xl text-neutral-800">Checkout</h1>

        <div className="flex flex-col gap-10 md:flex-row">
          {/* Form */}
          <form onSubmit={handlePlaceOrder} className="flex-1 space-y-5">
            <h2 className="font-serif text-lg text-neutral-800">Delivery Details</h2>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-amber-600 ${
                  errors.name ? "border-red-400" : "border-neutral-300"
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-amber-600 ${
                  errors.phone ? "border-red-400" : "border-neutral-300"
                }`}
                placeholder="10-digit mobile number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-amber-600 ${
                  errors.address ? "border-red-400" : "border-neutral-300"
                }`}
                placeholder="House no, street, area"
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-amber-600 ${
                    errors.city ? "border-red-400" : "border-neutral-300"
                  }`}
                  placeholder="City"
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={`w-full rounded border px-3 py-2.5 text-sm outline-none focus:border-amber-600 ${
                    errors.pincode ? "border-red-400" : "border-neutral-300"
                  }`}
                  placeholder="6-digit pincode"
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-amber-700 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-amber-800"
            >
              PLACE ORDER
            </button>
          </form>

          {/* Order summary */}
          <div className="w-full rounded-md border border-neutral-200 p-6 md:w-80">
            <h2 className="font-serif text-lg text-neutral-800">Order Summary</h2>
            <div className="mt-4 flex flex-col gap-3">
              {cartItems.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 object-contain" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-800">{item.name}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-neutral-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm text-neutral-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-semibold text-neutral-800">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}