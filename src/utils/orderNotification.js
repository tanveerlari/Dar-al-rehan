/**
 * 📱 Admin Order SMS Alert Service — Secure Backend-Powered
 * SMS notifications are now sent through a secure Edge Function.
 * No API keys or admin phone numbers are exposed in the frontend.
 */

const SUPABASE_FUNCTIONS_URL =
  import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : "";

export async function notifyAdminNewOrder(order) {
  try {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/notify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
      console.log("[Admin SMS] Order alert sent successfully via backend.");
    } else {
      console.warn("[Admin SMS] Backend notification notice:", data.message);
    }
  } catch (err) {
    // Non-blocking — order is already saved, SMS failure shouldn't break flow
    console.error("[Admin SMS] Error sending order alert:", err);
  }
}
