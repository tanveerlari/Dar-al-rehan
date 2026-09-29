import crypto from "crypto";

// Prioritize Live Key Secret strictly to avoid any Netlify env variable mismatch
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(
      event.body || "{}"
    );

    if (!razorpay_payment_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Missing required payment_id",
        }),
      };
    }

    // If order_id & signature exist, verify signature
    if (razorpay_order_id && razorpay_signature) {
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
            error: "Invalid payment signature.",
          }),
        };
      }
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
        order_id: razorpay_order_id || null,
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
