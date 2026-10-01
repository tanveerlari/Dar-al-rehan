import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Phone, CheckCircle2, RefreshCw, MessageCircle, User } from "lucide-react";

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("verified_customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching verified customers:", error.message);
    }
    setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-800">Verified Customers</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Customers who verified their mobile number via OTP
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Card */}
      <div className="mb-6 flex items-center gap-4 rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="rounded-full bg-amber-100 p-3">
          <Phone className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <p className="text-xs text-amber-700">Total Verified Mobile Customers</p>
          <p className="text-2xl font-semibold text-amber-900">{customers.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-6 w-6 animate-spin text-amber-700" />
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-md border border-neutral-200 bg-white py-16 text-center">
          <Phone className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">No verified customers yet.</p>
          <p className="mt-1 text-xs text-neutral-400">
            Customers who verify their mobile number will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1.2fr_1fr_1fr_auto] gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <span>#</span>
            <span>Customer Name</span>
            <span>Mobile Number</span>
            <span>Verified At</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {customers.map((customer, index) => (
            <div
              key={customer.id}
              className="grid grid-cols-[auto_1.2fr_1fr_1fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-3.5 last:border-0 hover:bg-neutral-50/60 transition-colors"
            >
              {/* Index */}
              <span className="text-xs font-medium text-neutral-400">{index + 1}</span>

              {/* Customer Name */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900 uppercase">
                  {customer.name ? (
                    customer.name.trim().charAt(0)
                  ) : (
                    <User className="h-4 w-4 text-amber-700" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    {customer.name || "—"}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <p className="text-sm font-medium text-neutral-700">{customer.phone}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-medium text-emerald-700">
                    OTP Verified
                  </span>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-neutral-500">
                {customer.last_verified_at
                  ? formatDate(customer.last_verified_at)
                  : customer.created_at
                  ? formatDate(customer.created_at)
                  : "—"}
              </p>

              {/* WhatsApp Button */}
              <button
                onClick={() => openWhatsApp(customer.phone)}
                title="Chat on WhatsApp"
                className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
