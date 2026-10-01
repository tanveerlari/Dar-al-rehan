import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { phone, otp } = await req.json();
    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    const cleanOtp = String(otp || "").trim();

    if (cleanPhone.length !== 10 || cleanOtp.length !== 6) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid phone number or OTP format." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch active OTP record for phone number
    const { data: records, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", cleanPhone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !records || records.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No OTP request found for this number." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const record = records[0];

    // Check expiration
    if (new Date(record.expires_at).getTime() < Date.now()) {
      await supabase.from("otp_codes").delete().eq("id", record.id);
      return new Response(
        JSON.stringify({ success: false, message: "OTP has expired. Please request a new code." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify hash
    const inputHash = await hashOtp(cleanOtp);
    if (inputHash !== record.otp_hash) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP code. Please check your SMS." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Success! Delete OTP record
    await supabase.from("otp_codes").delete().eq("id", record.id);

    // Log/Upsert into verified_customers
    await supabase.from("verified_customers").upsert(
      {
        phone: `+91${cleanPhone}`,
        status: "verified",
        last_verified_at: new Date().toISOString(),
      },
      { onConflict: "phone" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Phone number verified successfully!",
        phone: `+91${cleanPhone}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Error in verify-otp Edge Function:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error verifying OTP." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
