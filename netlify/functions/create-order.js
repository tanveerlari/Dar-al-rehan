import Razorpay from "razorpay";

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ThrvQA6FFgWfkd";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "C0rKjIgsH8UNRjRszD1oPTJS";

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

    if (!KEY_ID || !KEY_SECRET) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Razorpay credentials not configured" }),
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
