import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomerAuth } from "./CustomerAuthContext";

export function PhoneAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    sendPhoneOtp,
    verifyPhoneOtp,
    signInWithGoogle,
  } = useCustomerAuth();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("phone");
      setPhoneNumber("");
      setOtpValues(["", "", "", "", "", ""]);
      setError("");
      setSuccessMsg("");
      setCountdown(0);
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleaned = phoneNumber.trim().replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    const result = await sendPhoneOtp(cleaned);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to send OTP. Please check your number.");
      return;
    }

    setSuccessMsg(result.message || `OTP sent to +91 ${cleaned}`);
    setStep("otp");
    setCountdown(30);

    setTimeout(() => {
      if (otpInputsRef.current[0]) {
        otpInputsRef.current[0].focus();
      }
    }, 150);
  };

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      const newOtp = [...otpValues];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpValues(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      if (otpInputsRef.current[nextIndex]) {
        otpInputsRef.current[nextIndex].focus();
      }
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = cleaned;
    setOtpValues(newOtp);

    if (cleaned && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    const token = otpValues.join("");

    if (token.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    const result = await verifyPhoneOtp(phoneNumber, token);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Invalid OTP. Please check your SMS.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-[#FAF7F2] p-7 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Brand */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-13 w-13 items-center justify-center rounded-full border border-amber-400/40 bg-amber-50 shadow-inner">
              {step === "phone" ? (
                <Phone className="h-6 w-6 text-amber-700" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-amber-700" />
              )}
            </div>
            <h2
              className="text-2xl font-normal tracking-wide text-neutral-900"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              DAR AL REHAN
            </h2>
            <p className="mt-1 text-xs text-amber-800/80 tracking-widest font-medium uppercase">
              {step === "phone" ? "Mobile Number Verification" : "Enter Verification Code"}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && !error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* ──────────────── STEP 1: ENTER PHONE ──────────────── */}
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-neutral-700 mb-1.5 uppercase">
                  Mobile Number
                </label>
                <div className="flex rounded-lg border border-neutral-300 bg-white focus-within:border-amber-600 focus-within:ring-1 focus-within:ring-amber-600 transition-all overflow-hidden shadow-sm">
                  <span className="flex items-center bg-amber-50/70 px-3.5 text-sm font-semibold text-amber-900 border-r border-neutral-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3.5 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 font-medium"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-500">
                  Real 6-digit OTP will be sent via SMS to your mobile phone.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-700 to-amber-800 py-3 text-xs font-semibold tracking-widest text-white shadow-md transition-all hover:from-amber-800 hover:to-amber-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>SEND OTP VIA SMS</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Or Google Login */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <span className="relative bg-[#FAF7F2] px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                  Or
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  signInWithGoogle();
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-neutral-300 bg-white py-2.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            /* ──────────────── STEP 2: ENTER OTP ──────────────── */
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
              <div className="text-center">
                <p className="text-xs text-neutral-600">
                  SMS Code sent to <span className="font-semibold text-neutral-900">+91 {phoneNumber}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setError("");
                  }}
                  className="mt-1 text-[11px] text-amber-700 underline hover:text-amber-800"
                >
                  Change number
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-12 w-11 sm:h-13 sm:w-12 rounded-lg border border-neutral-300 bg-white text-center text-lg font-bold text-neutral-800 shadow-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otpValues.join("").length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 py-3 text-xs font-semibold tracking-widest text-white shadow-md transition-all hover:from-amber-800 hover:to-amber-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <span>VERIFY & SIGN IN</span>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-neutral-400">
                    Resend OTP in <span className="font-semibold text-amber-700">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-xs font-semibold text-amber-800 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
