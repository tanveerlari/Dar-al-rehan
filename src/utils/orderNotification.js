/**
 * 📱 Admin Order SMS Alert Service
 * Sends real instant SMS directly to Admin's mobile number (+91 8983284487) via Fast2SMS
 */

const ADMIN_PHONE = "8983284487"; // Rehan Patel (Admin Mobile)
const FAST2SMS_API_KEY =
  import.meta.env.VITE_FAST2SMS_API_KEY ||
  "sX32OiRVNwufQywsdV7QZ5R0gCGZH6Ft05E4FQLPqbL0i2zLIpfWLpYa4ZU4";

export async function notifyAdminNewOrder(order) {
  try {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.name}(${item.quantity})`)
      .join(", ");

    const smsMessage = `New Order on Dar Al Rehan! Customer: ${order.name}, Phone: ${order.phone}, Items: ${itemsSummary}, Total: Rs.${order.total}, City: ${order.city}. Check Admin Panel.`;

    const response = await fetch("/api/fast2sms/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: smsMessage,
        language: "english",
        flash: 0,
        numbers: ADMIN_PHONE,
      }),
    });

    const data = await response.json();
    console.log("[Admin SMS] Order Alert Status:", data);

    if (data.return === true || data.status_code === 200) {
      console.log(`[Admin SMS] Order alert sent successfully to Admin (+91 ${ADMIN_PHONE})`);
    } else {
      console.warn("[Admin SMS] Fast2SMS Gateway notice:", data.message);
    }
  } catch (err) {
    console.error("[Admin SMS] Error sending order alert SMS:", err);
  }
}
