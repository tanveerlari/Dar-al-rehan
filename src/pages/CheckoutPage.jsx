import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle, LogIn, ShieldAlert, Truck, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useCustomerAuth } from "../components/CustomerAuthContext";
import { useCart } from "../components/CartContext";
import { useRateLimiter } from "../hooks/useRateLimiter";
import { getDeliveryDetails } from "../utils/deliveryCalculator";
import { notifyAdminNewOrder } from "../utils/orderNotification";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_ThsECEbsHQb6Vn";

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

// Load Razorpay checkout.js dynamically if needed
function loadRazorpaySdk() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, openAuthModal, signInWithGoogle } = useCustomerAuth();
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
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "cod"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkLimit, isBlocked, blockMessage } = useRateLimiter("placeOrder");

  // Calculate live delivery info based on user's entered Pincode
  const deliveryInfo = useMemo(() => {
    return getDeliveryDetails(form.pincode);
  }, [form.pincode]);

  const deliveryCharge = cartItems.length > 0 ? deliveryInfo.charge : 0;
  const finalTotal = cartItems.length > 0 ? cartTotal + deliveryCharge : 0;

  // Auto-fill verified phone number
  useEffect(() => {
    if (user?.phone) {
      const clean = user.phone.replace(/\D/g, "").slice(-10);
      setForm((prev) => ({
        ...prev,
        phone: prev.phone || clean,
      }));
    }
  }, [user]);

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
    else if (!/^\d{6}$/.test(form.pincode.trim())) newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to save order in Supabase
  const saveOrderToDatabase = async (paymentDetails = {}) => {
    const orderPayload = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      // Phone OTP users have a local `phone_<number>` id, not a Supabase UUID.
      user_id: isUuid(user?.id) ? user.id : null,
      items: cartItems.map((item) => ({
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
      })),
      total: finalTotal,
      payment_method: paymentDetails.method || paymentMethod,
      payment_id: paymentDetails.paymentId || null,
      payment_status: paymentDetails.status || "pending",
    };

    const { error } = await supabase.from("orders").insert([orderPayload]);

    if (error) {
      throw error;
    }

    // 🔔 Instant Notification to Admin (SMS)
    notifyAdminNewOrder(orderPayload);
  };

  // STEP 1 & 2: Razorpay Online Payment Flow
  const handleRazorpayOnlinePayment = async () => {
    const sdkLoaded = await loadRazorpaySdk();
    if (!sdkLoaded) {
      alert("Failed to load Razorpay payment gateway. Please check your internet connection.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Call Backend to Create Razorpay Order
      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal * 100, // in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order on server");
      }

      // Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Dar Al Rehan",
        description: `Order of ${cartItems.length} handcrafted fragrance item(s)`,
        image: "/logo.png",
        order_id: orderData.order_id,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: user?.email || "",
        },
        notes: {
          address: `${form.address}, ${form.city} - ${form.pincode}`,
          zone: deliveryInfo.zone,
        },
        theme: {
          color: "#b45309", // Amber-700
        },
        handler: async function (response) {
          // Step 3: Backend Verification of Signature
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              alert("Payment verification failed: " + (verifyData.error || "Signature mismatch"));
              setIsSubmitting(false);
              return;
            }

            // Save verified order to Supabase
            await saveOrderToDatabase({
              method: "online",
              paymentId: response.razorpay_payment_id,
              status: "paid",
            });

            setOrderPlaced(true);
            clearCart();
          } catch (err) {
            console.error("Order save / verify error:", err);
            alert("Payment was successful (" + response.razorpay_payment_id + "), but order saving encountered an error. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (failResponse) {
        console.error("Payment failed:", failResponse.error);
        alert(`Payment failed: ${failResponse.error.description || "Transaction declined"}`);
        setIsSubmitting(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      alert(err.message || "Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // 🛡️ Rate Limit Check
    const rateResult = checkLimit();
    if (!rateResult.allowed) {
      setErrors({ ...errors, rateLimit: rateResult.message });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    if (paymentMethod === "online") {
      await handleRazorpayOnlinePayment();
    } else {
      // Cash on Delivery
      try {
        await saveOrderToDatabase({ method: "cod", status: "pending" });
        setOrderPlaced(true);
        clearCart();
      } catch (err) {
        alert("Failed to place order: " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Not logged in — block checkout
  if (!user) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center md:px-14">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-50 shadow-inner">
          <LogIn className="h-7 w-7 text-amber-700" />
        </div>
        <h1
          className="font-normal text-2xl text-neutral-800 sm:text-3xl"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Sign In to Continue
        </h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
          Verify your mobile number with a quick OTP or sign in with Google to place your order securely.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal("/checkout")}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-700 to-amber-800 px-8 py-3.5 text-xs font-semibold tracking-widest text-white shadow-md transition-all hover:from-amber-800 hover:to-amber-900 hover:shadow-lg"
          >
            SIGN IN WITH MOBILE OTP
          </button>
          <button
            onClick={() => signInWithGoogle("/checkout")}
            className="w-full sm:w-auto rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-xs font-semibold tracking-wider text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
          >
            Google Sign In
          </button>
        </div>
        <div>
          <Link to="/cart" className="mt-6 inline-block text-xs text-neutral-500 hover:text-amber-700 hover:underline">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

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
        <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
        <h1 className="mt-4 font-serif text-3xl text-neutral-800">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {paymentMethod === "online"
            ? "Payment received and verified successfully! Your order is confirmed."
            : "We have received your order and will contact you shortly for delivery confirmation."}
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-8 rounded-full bg-amber-700 px-8 py-3 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-amber-800"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  const isPincodeEntered = String(form.pincode).trim().length === 6;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-14">
      <nav className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/cart" className="hover:underline">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Checkout</span>
      </nav>

      <h1 className="mb-8 font-serif text-3xl text-neutral-800">Checkout</h1>

      {/* 🛡️ Rate limit blocked alert banner */}
      {isBlocked && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <p className="font-semibold">Order temporarily on hold</p>
            <p className="text-xs text-amber-700">{blockMessage}</p>
          </div>
        </div>
      )}

      {errors.rateLimit && !isBlocked && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {errors.rateLimit}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Shipping Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-4 lg:col-span-2">
          <h2 className="font-serif text-lg text-neutral-800">Shipping Details</h2>

          <div>
            <label className="block text-xs font-medium text-neutral-600">Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600">Phone Number *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600">Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House/Flat No, Street, Area"
              rows={3}
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600">Pincode *</label>
              <input
                name="pincode"
                maxLength={6}
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
            </div>
          </div>

          {/* 🚚 Real Courier Zone & Estimate Indicator */}
          {isPincodeEntered && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-900/15 bg-[#FAF7F2] p-3 text-xs text-neutral-700">
              <Truck className="h-5 w-5 text-amber-800 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">
                  Courier Zone: {deliveryInfo.zone} ({deliveryInfo.state})
                </p>
                <p className="text-[11px] text-neutral-500">
                  Est. Delivery: {deliveryInfo.days} • Shipping Fee: <strong className="text-amber-900">₹{deliveryInfo.charge}</strong>
                </p>
              </div>
            </div>
          )}

          {/* ──────────── Payment Method Selection ──────────── */}
          <div className="pt-4">
            <p className="mb-3 text-xs font-medium text-neutral-600">Payment Method</p>
            <div className="space-y-3">
              {/* Online Payment Option (Razorpay) */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                  paymentMethod === "online"
                    ? "border-amber-600 bg-amber-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 accent-amber-700"
                />
                <CreditCard className={`h-5 w-5 ${paymentMethod === "online" ? "text-amber-700" : "text-neutral-400"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${paymentMethod === "online" ? "text-amber-900" : "text-neutral-700"}`}>
                    Pay Online (Instant & Secure)
                  </p>
                  <p className="text-xs text-neutral-500">UPI, Google Pay, PhonePe, Cards, Net Banking</p>
                </div>
                {/* Badges */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">UPI</span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">Cards</span>
                </div>
              </label>

              {/* COD Option */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                  paymentMethod === "cod"
                    ? "border-amber-600 bg-amber-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 accent-amber-700"
                />
                <Banknote className={`h-5 w-5 ${paymentMethod === "cod" ? "text-amber-700" : "text-neutral-400"}`} />
                <div>
                  <p className={`text-sm font-medium ${paymentMethod === "cod" ? "text-amber-900" : "text-neutral-700"}`}>
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-xs text-neutral-500">Pay cash upon parcel delivery</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBlocked || isSubmitting}
            className="mt-6 w-full rounded-full bg-amber-700 py-3 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>PROCESSING...</span>
              </>
            ) : paymentMethod === "online" ? (
              `PAY NOW (₹${finalTotal.toLocaleString("en-IN")})`
            ) : (
              `PLACE ORDER (₹${finalTotal.toLocaleString("en-IN")})`
            )}
          </button>

          {paymentMethod === "online" && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Secured by Razorpay • 256-Bit SSL Encrypted</span>
            </div>
          )}
        </form>

        {/* Right: Order Summary */}
        <div className="h-fit rounded-lg border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="font-serif text-lg text-neutral-800">Order Summary</h2>

          <div className="mt-4 divide-y divide-neutral-200 text-xs text-neutral-600">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between py-2">
                <span>
                  {item.name} ({item.type}) × {item.quantity}
                </span>
                <span className="font-medium text-neutral-800">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-neutral-300 pt-4 space-y-2.5">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-800">₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-xs text-neutral-600">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-amber-700" />
                <span>Delivery Charges</span>
              </span>
              <span className="font-semibold text-amber-900">
                ₹{deliveryCharge}
              </span>
            </div>

            <div className="flex justify-between text-xs text-neutral-600">
              <span>Payment Mode</span>
              <span className="font-medium text-amber-800">
                {paymentMethod === "online" ? "Online (UPI / Cards)" : "Cash on Delivery"}
              </span>
            </div>

            {isPincodeEntered ? (
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>Destination:</span>
                <span className="text-neutral-700 font-medium">{deliveryInfo.state} ({deliveryInfo.days})</span>
              </div>
            ) : (
              <p className="text-[10px] italic text-neutral-400">
                *Enter 6-digit Pincode to see exact courier rates for your area
              </p>
            )}

            <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-800">
              <span>Total Amount</span>
              <span className="text-base text-amber-900">₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}