const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || "sX32OiRVNwufQywsdV7QZ5R0gCGZH6Ft05E4FQLPqbL0i2zLIpfWLpYa4ZU4";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "8983284487";

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  try {
    const { name, phone, items, total, city } = JSON.parse(event.body || "{}");

    const itemsSummary = (items || [])
      .map((item) => `${item.name}(${item.quantity})`)
      .join(", ");

    const smsMessage = `New Order on Dar Al Rehan! Customer: ${name}, Phone: ${phone}, Items: ${itemsSummary}, Total: Rs.${total}, City: ${city}. Check Admin Panel.`;

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: smsMessage,
        language: "english",
        flash: 0,
        numbers: ADMIN_PHONE,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error("[Netlify notify-admin Error]:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}
