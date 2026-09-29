import crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "EwCc9GM2b8whwENcHGSrEZU7";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(
      event.body || "{}"
    );

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Missing required verification fields (order_id, payment_id, signature)",
        }),
      };
    }

    // Step 3: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (!isMatch) {
      console.warn("[Razorpay Verification] Signature mismatch!", {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Invalid payment signature. Payment verification failed.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      }),
    };
  } catch (error) {
    console.error("[Razorpay Verify Signature Error]:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: error.message || "Internal server error during verification",
      }),
    };
  }
}
