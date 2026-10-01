import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Hash string using SHA-256
 */
async function hashOtp(otp: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);

    if (cleanPhone.length !== 10) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid 10-digit mobile number." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const fast2smsApiKey = Deno.env.get("FAST2SMS_API_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Server-side Rate Limiting: max 5 requests per 15 min per phone
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("phone", cleanPhone)
      .gte("created_at", fifteenMinsAgo);

    if ((count || 0) >= 5) {
      return new Response(
        JSON.stringify({ success: false, message: "Too many OTP requests. Please wait 15 minutes." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // 3. Store hashed OTP in Supabase
    await supabase.from("otp_codes").delete().eq("phone", cleanPhone);
    const { error: dbErr } = await supabase.from("otp_codes").insert({
      phone: cleanPhone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    if (dbErr) {
      console.error("DB error saving OTP:", dbErr);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to process OTP request." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // 4. Send SMS via Fast2SMS
    if (fast2smsApiKey) {
      const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: `Welcome to Dar Al Rehan. Your luxury perfume verification code is ${otp}. Valid for 5 minutes. Please do not share this code.`,
          language: "english",
          flash: 0,
          numbers: cleanPhone,
        }),
      });

      const smsData = await smsRes.json();
      console.log("[Fast2SMS] Edge Function send status:", smsData);
    }

    return new Response(
      JSON.stringify({ success: true, message: `OTP sent successfully to +91 ${cleanPhone}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Error in send-otp Edge Function:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error sending OTP." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
