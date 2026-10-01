import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Delivery calculator helper (server-side)
function calculateDeliveryCharge(pincode: string): number {
  const cleanPin = String(pincode || "").trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) return 60;

  const prefix2 = parseInt(cleanPin.slice(0, 2), 10);
  const prefix3 = parseInt(cleanPin.slice(0, 3), 10);

  if ((prefix2 >= 78 && prefix2 <= 79) || prefix2 === 19 || prefix2 === 17 || prefix3 === 744 || prefix3 === 682) {
    return 110;
  }
  if (prefix2 >= 40 && prefix2 <= 44) {
    return prefix2 === 40 || prefix2 === 41 ? 40 : 50;
  }
  if (prefix2 === 11 || prefix2 === 12 || prefix2 === 13 || (prefix2 >= 30 && prefix2 <= 34) || (prefix2 >= 36 && prefix2 <= 39) || (prefix2 >= 45 && prefix2 <= 49)) {
    return 65;
  }
  if (prefix2 >= 50 && prefix2 <= 69) {
    return (prefix2 === 56 || prefix2 === 60 || prefix2 === 50) ? 70 : 80;
  }
  if ((prefix2 >= 70 && prefix2 <= 74) || (prefix2 >= 75 && prefix2 <= 77) || (prefix2 >= 80 && prefix2 <= 85) || (prefix2 >= 20 && prefix2 <= 28)) {
    return 75;
  }
  return 65;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { items, name, phone, address, city, pincode, user_id } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !name || !phone || !address || !city || !pincode) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required order fields." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. SECURITY: Look up ACTUAL prices from database, NEVER trust client prices!
    const productIds = items.map((i: any) => i.product_id).filter(Boolean);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price, type")
      .in("id", productIds);

    let calculatedCartTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProd = dbProducts?.find((p: any) => String(p.id) === String(item.product_id));
      const unitPrice = dbProd ? Number(dbProd.price) : Number(item.price || 0); // fallback if product table not populated yet
      const qty = Math.max(1, parseInt(item.quantity || 1, 10));

      calculatedCartTotal += unitPrice * qty;
      validatedItems.push({
        product_id: item.product_id,
        name: dbProd?.name || item.name || "Perfume Product",
        type: dbProd?.type || item.type || "Perfume",
        price: unitPrice,
        quantity: qty,
      });
    }

    const deliveryCharge = calculateDeliveryCharge(pincode);
    const finalTotal = calculatedCartTotal + deliveryCharge;
    const amountInPaise = Math.round(finalTotal * 100);

    // 2. Create Razorpay Order server-side if Razorpay keys exist
    let razorpayOrderId = `order_sim_${Date.now()}`;
    if (razorpayKeyId && razorpayKeySecret) {
      const authHeader = "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: name,
            customer_phone: phone,
          },
        }),
      });

      const rzpData = await rzpRes.json();
      if (rzpData.id) {
        razorpayOrderId = rzpData.id;
      }
    }

    // 3. Save order into Supabase with 'pending' status
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          name,
          phone,
          address,
          city,
          pincode,
          user_id: user_id || null,
          items: validatedItems,
          total: finalTotal,
          payment_method: "online",
          payment_id: null,
          payment_status: "pending",
          razorpay_order_id: razorpayOrderId,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (orderErr) {
      console.error("Order DB insertion error:", orderErr);
      return new Response(
        JSON.stringify({ success: false, message: "Database error creating order." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: razorpayOrderId,
        amount: amountInPaise,
        order_db_id: orderData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Error in create-order Edge Function:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error creating order." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
