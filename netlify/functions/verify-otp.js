import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://fxmyoxstqguhogrrqgha.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bXlveHN0cWd1aG9ncnJxZ2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5Njk3NzEsImV4cCI6MjEwNDU0NTc3MX0.ZcS5cnKJke7xypI74lNMAXlg3XtQHvH7dXqA86bysXU";

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    const { phone, otp } = JSON.parse(event.body || "{}");
    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    const cleanOtp = String(otp || "").trim();

    if (cleanPhone.length !== 10 || cleanOtp.length !== 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "Invalid phone number or OTP format." }),
      };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch active OTP
    const { data: records, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", cleanPhone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !records || records.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "No OTP request found for this number." }),
      };
    }

    const record = records[0];

    if (new Date(record.expires_at).getTime() < Date.now()) {
      await supabase.from("otp_codes").delete().eq("id", record.id);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "OTP has expired. Please request a new code." }),
      };
    }

    const inputHash = hashOtp(cleanOtp);
    if (inputHash !== record.otp_hash) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "Invalid OTP code. Please check your SMS." }),
      };
    }

    // Success! Delete OTP
    await supabase.from("otp_codes").delete().eq("id", record.id);

    // Upsert verified customer
    await supabase.from("verified_customers").upsert(
      {
        phone: `+91${cleanPhone}`,
        status: "verified",
        last_verified_at: new Date().toISOString(),
      },
      { onConflict: "phone" }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Phone number verified successfully!",
        phone: `+91${cleanPhone}`,
      }),
    };
  } catch (error) {
    console.error("[Netlify verify-otp Error]:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message || "Server error verifying OTP." }),
    };
  }
}
