import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || "sX32OiRVNwufQywsdV7QZ5R0gCGZH6Ft05E4FQLPqbL0i2zLIpfWLpYa4ZU4";
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
    const { phone } = JSON.parse(event.body || "{}");
    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);

    if (cleanPhone.length !== 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "Please enter a valid 10-digit mobile number." }),
      };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Rate Limiting check (max 5 requests per 15 min per phone)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("phone", cleanPhone)
      .gte("created_at", fifteenMinsAgo);

    if ((count || 0) >= 5) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ success: false, message: "Too many OTP requests. Please wait 15 minutes." }),
      };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store in DB
    await supabase.from("otp_codes").delete().eq("phone", cleanPhone);
    await supabase.from("otp_codes").insert({
      phone: cleanPhone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    // Send SMS via Fast2SMS
    if (FAST2SMS_API_KEY) {
      const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: FAST2SMS_API_KEY,
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
      console.log("[Fast2SMS Netlify Response]:", smsData);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone}`,
      }),
    };
  } catch (error) {
    console.error("[Netlify send-otp Error]:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message || "Server error sending OTP." }),
    };
  }
}
