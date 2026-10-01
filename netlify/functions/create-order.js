const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_ThsECEbsHQb6Vn";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "EwCc9GM2b8whwENcHGSrEZU7";

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { amount, currency = "INR", receipt } = JSON.parse(event.body || "{}");

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Amount must be at least 100 paise (₹1)" }),
      };
    }

    const authHeader = "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const rzpData = await rzpRes.json();

    if (!rzpRes.ok || !rzpData.id) {
      console.error("[Razorpay API Error]:", rzpData);
      return {
        statusCode: 200, // Graceful return so payment modal can fallback
        headers,
        body: JSON.stringify({
          success: false,
          amount: Math.round(amount),
          error: rzpData.error?.description || "Failed to create Razorpay order",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        order_id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
      }),
    };
  } catch (error) {
    console.error("[Razorpay Create Order Handler Error]:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        amount: Math.round(amount || 0),
        error: error.message || "Failed to create Razorpay order",
      }),
    };
  }
}
