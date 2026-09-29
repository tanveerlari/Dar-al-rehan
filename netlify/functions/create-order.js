import Razorpay from "razorpay";

// Prioritize Live Key ID & Secret strictly to avoid any Netlify env variable mismatch
const KEY_ID = "rzp_live_ThsECEbsHQb6Vn";
const KEY_SECRET = "EwCc9GM2b8whwENcHGSrEZU7";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { amount, currency = "INR", receipt } = JSON.parse(event.body || "{}");

    // Validate minimum amount (>= 100 paise = ₹1)
    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Amount must be at least 100 paise (₹1)" }),
      };
    }

    const instance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
    };
  } catch (error) {
    console.error("[Razorpay Create Order Error]:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message || "Failed to create Razorpay order",
      }),
    };
  }
}
