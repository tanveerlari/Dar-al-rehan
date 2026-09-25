import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Package, ShoppingBag, IndianRupee } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [chartView, setChartView] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const chartData = chartView === "monthly" ? monthlyData : yearlyData;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-800">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-5">
          <div className="rounded-full bg-amber-100 p-3">
            <Package className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Products</p>
            <p className="text-xl font-semibold text-neutral-800">{stats.products}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-5">
          <div className="rounded-full bg-amber-100 p-3">
            <ShoppingBag className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Orders</p>
            <p className="text-xl font-semibold text-neutral-800">{stats.orders}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-5">
          <div className="rounded-full bg-amber-100 p-3">
            <IndianRupee className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Total Revenue</p>
            <p className="text-xl font-semibold text-neutral-800">₹{stats.revenue}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-md border border-neutral-200 bg-white p-6">
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