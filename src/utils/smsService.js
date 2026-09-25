/**
 * 📱 Fast2SMS OTP Service
 * Sends real SMS OTP to Indian (+91) mobile numbers
 */

const FAST2SMS_API_KEY =
  import.meta.env.VITE_FAST2SMS_API_KEY ||
  "sX32OiRVNwufQywsdV7QZ5R0gCGZH6Ft05E4FQLPqbL0i2zLIpfWLpYa4ZU4";

// In-memory OTP storage with 5-minute expiry
const otpStore = new Map();

/**
 * Generate secure 6-digit random OTP
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via Fast2SMS OTP Route
 * @param {string} rawPhone - 10-digit Indian phone number
 */
export async function sendOtpToPhone(rawPhone) {
  const cleaned = rawPhone.replace(/\D/g, "").slice(-10);

  if (cleaned.length !== 10) {
    return { success: false, message: "Please enter a valid 10-digit mobile number." };
  }

  const otp = generateOtp();
  console.log(`[Fast2SMS] Initiating OTP send for: ${cleaned}`);

  // Always use Vite proxy path — works on localhost AND devtunnels.ms
  // Direct browser calls to fast2sms.com are blocked by CORS on ALL domains
  const apiUrl = "/api/fast2sms/dev/bulkV2";

  try {
    const response = await fetch(apiUrl, {
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
        numbers: cleaned,
      }),
    });

    const data = await response.json();
    console.log("[Fast2SMS] Server response:", data);

    if (data.return === true || data.status_code === 200) {
      otpStore.set(cleaned, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      return {
        success: true,
        message: `OTP sent successfully to +91 ${cleaned}`,
      };
    } else {
      const errMsg = Array.isArray(data.message) ? data.message.join(", ") : (data.message || "Failed to send SMS.");
      console.warn("[Fast2SMS] Gateway message:", errMsg);

      // Save OTP so verification doesn't completely block if there's a gateway delay
      otpStore.set(cleaned, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      return {
        success: false,
        message: `Fast2SMS: ${errMsg}`,
      };
    }
  } catch (err) {
    console.error("[Fast2SMS] Network error:", err);
    return {
      success: false,
      message: "Network error sending SMS. Please check your internet connection.",
    };
  }
}

/**
 * Verify OTP entered by customer
 * @param {string} rawPhone - 10-digit phone number
 * @param {string} enteredOtp - 6-digit OTP string
 */
export function verifyOtpCode(rawPhone, enteredOtp) {
  const cleaned = rawPhone.replace(/\D/g, "").slice(-10);
  const record = otpStore.get(cleaned);

  if (!record) {
    return {
      success: false,
      message: "No OTP request found for this number. Please request a new OTP.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleaned);
    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  if (record.otp.trim() === enteredOtp.trim()) {
    otpStore.delete(cleaned);
    return {
      success: true,
      message: "Phone number verified successfully!",
    };
  }

  return {
    success: false,
    message: "Invalid OTP code. Please check your SMS and try again.",
  };
}
