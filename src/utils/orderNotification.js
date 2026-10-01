/**
 * 📱 Admin Order SMS Alert Service — Netlify Powered
 */

export async function notifyAdminNewOrder(order) {
  try {
    const response = await fetch("/api/notify-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: order.name,
        phone: order.phone,
        items: order.items,
        total: order.total,
        city: order.city,
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("[Admin SMS] Order alert sent successfully via Netlify Function.");
    }
  } catch (err) {
    console.error("[Admin SMS] Error sending order alert:", err);
  }
}
