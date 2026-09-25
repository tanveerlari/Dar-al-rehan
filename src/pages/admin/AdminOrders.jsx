import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { CheckCircle, Clock } from "lucide-react";

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsCompleted = async (id) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", id)
      .select();

    if (error) {
      alert("Failed to update order: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("Update blocked — 0 rows affected. This usually means the RLS policy isn't matching your admin email.");
      return;
    }

    fetchOrders();
  };

  const pendingOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const displayedOrders = activeTab === "pending" ? pendingOrders : completedOrders;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-800">Orders</h1>

      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "border-amber-700 text-amber-700"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <Clock className="h-4 w-4" />
          New Orders
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
            {pendingOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "completed"
              ? "border-amber-700 text-amber-700"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Completed Orders
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {completedOrders.length}
          </span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading orders...</p>
      ) : displayedOrders.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {activeTab === "pending" ? "No new orders." : "No completed orders yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedOrders.map((order) => (
            <div key={order.id} className="rounded-md border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{order.name}</p>
                  <p className="text-xs text-neutral-500">{order.phone} · {order.city}, {order.pincode}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-amber-700">₹{order.total}</span>
                  <p className="text-[10px] text-neutral-400">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-xs text-neutral-500">{order.address}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {order.items?.map((item, i) => (
                  <span key={i} className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                    {item.name} ({item.type}) × {item.quantity} — ₹{item.price}
                  </span>
                ))}
              </div>

              {activeTab === "pending" && (
                <button
                  onClick={() => markAsCompleted(order.id)}
                  className="flex items-center gap-2 rounded-full bg-amber-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-800"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Mark as Received / Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}