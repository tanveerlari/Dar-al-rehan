import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Package, ShoppingBag, IndianRupee, MessageSquare, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFast2SmsBalance } from "../../utils/smsService";

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [smsBalance, setSmsBalance] = useState(null);
  const [smsLoading, setSmsLoading] = useState(false);
  const [chartView, setChartView] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSmsBalance = async () => {
    setSmsLoading(true);
    const res = await getFast2SmsBalance();
    if (res.success) {
      setSmsBalance(res.wallet);
    }
    setSmsLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { data: orders } = await supabase.from("orders").select("total, created_at");

      const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

      setStats({
        products: productCount || 0,
        orders: orders?.length || 0,
        revenue,
      });

      // Group by month (last 12 months)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap = {};
      const yearlyMap = {};

      orders?.forEach((order) => {
        const date = new Date(order.created_at);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        const yearKey = `${date.getFullYear()}`;

        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + Number(order.total);
        yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + Number(order.total);
      });

      const monthlyArr = Object.entries(monthlyMap)
        .map(([month, sales]) => ({ label: month, sales }))
        .sort((a, b) => new Date(a.label) - new Date(b.label))
        .slice(-12);

      const yearlyArr = Object.entries(yearlyMap)
        .map(([year, sales]) => ({ label: year, sales }))
        .sort((a, b) => a.label - b.label);

      setMonthlyData(monthlyArr);
      setYearlyData(yearlyArr);
      setLoading(false);
    }

    fetchData();
    fetchSmsBalance();
  }, []);

  const chartData = chartView === "monthly" ? monthlyData : yearlyData;
  const isSmsBalanceLow = smsBalance !== null && smsBalance <= 20;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-neutral-800">Dashboard</h1>
        <button
          onClick={fetchSmsBalance}
          disabled={smsLoading}
          className="inline-flex items-center gap-1.5 self-start text-xs text-neutral-500 hover:text-amber-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${smsLoading ? "animate-spin" : ""}`} />
          <span>Refresh Balance</span>
        </button>
      </div>

      {/* ⚠️ Low Fast2SMS Balance Alert Banner */}
      {isSmsBalanceLow && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Fast2SMS Balance Low Alert! (₹{smsBalance.toFixed(2)})
              </p>
              <p className="mt-0.5 text-xs text-red-700">
                Aapka SMS credit balance ₹20 se kam ho gaya hai. Customer mobile number verification (OTP) uninterrupted rakhne ke liye Fast2SMS account me paise add karein.
              </p>
            </div>
          </div>
          <a
            href="https://www.fast2sms.com/dashboard/recharge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700"
          >
            <span>Recharge Now</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="rounded-full bg-amber-100 p-3 text-amber-800">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Products</p>
            <p className="text-xl font-semibold text-neutral-800">{stats.products}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="rounded-full bg-amber-100 p-3 text-amber-800">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Orders</p>
            <p className="text-xl font-semibold text-neutral-800">{stats.orders}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="rounded-full bg-amber-100 p-3 text-amber-800">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Revenue</p>
            <p className="text-xl font-semibold text-neutral-800">₹{stats.revenue.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* SMS Credits Widget */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${isSmsBalanceLow ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">SMS Wallet Balance</p>
              <p className="text-xl font-semibold text-neutral-800">
                {smsBalance !== null ? `₹${smsBalance.toFixed(2)}` : smsLoading ? "Checking..." : "—"}
              </p>
            </div>
          </div>
          {smsBalance !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isSmsBalanceLow
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isSmsBalanceLow ? "Low Balance" : "Healthy"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-neutral-800">Sales Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartView("monthly")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                chartView === "monthly"
                  ? "bg-amber-700 text-white"
                  : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setChartView("yearly")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                chartView === "yearly"
                  ? "bg-amber-700 text-white"
                  : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-neutral-500">Loading chart...</p>
        ) : chartData.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">No sales data yet.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#737373" }} />
                <YAxis tick={{ fontSize: 12, fill: "#737373" }} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Sales"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#b45309"
                  strokeWidth={2.5}
                  dot={{ fill: "#b45309", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}