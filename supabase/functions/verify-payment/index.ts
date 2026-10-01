import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Verify Razorpay HMAC SHA256 Signature
 */
async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const generatedSignature = signatureArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return generatedSignature === signature;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !order_db_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing payment verification parameters." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    const fast2smsApiKey = Deno.env.get("FAST2SMS_API_KEY") || "";
    const adminPhone = Deno.env.get("ADMIN_PHONE") || "8983284487";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Verify Signature if secret exists
    if (razorpayKeySecret && razorpay_signature) {
      const isValid = await verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        razorpayKeySecret
      );

      if (!isValid) {
        console.error("Invalid Razorpay payment signature detected!");
        return new Response(
          JSON.stringify({ success: false, message: "Invalid payment signature. Verification failed." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }

    // 2. Update order in Supabase to 'paid'
    const { data: updatedOrder, error: updateErr } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_db_id)
      .select("*")
      .single();

    if (updateErr) {
      console.error("Failed to update order status:", updateErr);
      return new Response(
        JSON.stringify({ success: false, message: "Error updating order payment status." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // 3. Send SMS notification to Admin
    if (fast2smsApiKey && updatedOrder) {
      try {
        const itemsStr = (updatedOrder.items || [])
          .map((i: any) => `${i.name}(${i.quantity})`)
          .join(", ");

        const msg = `New Paid Order on Dar Al Rehan! Customer: ${updatedOrder.name}, Phone: ${updatedOrder.phone}, Total: Rs.${updatedOrder.total}, City: ${updatedOrder.city}, Items: ${itemsStr}.`;

        await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: fast2smsApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "q",
            message: msg,
            language: "english",
            flash: 0,
            numbers: adminPhone,
          }),
        });
      } catch (smsErr) {
        console.warn("Non-blocking SMS error:", smsErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified and order updated to paid." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Error in verify-payment Edge Function:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error verifying payment." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
