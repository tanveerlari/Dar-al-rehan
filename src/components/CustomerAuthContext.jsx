import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { rateLimiter } from "../utils/rateLimiter";
import { sendOtpToPhone, verifyOtpCode } from "../utils/smsService";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "rehanpatel346@gmail.com,laritanveer55@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

const ADMIN_PHONES = (import.meta.env.VITE_ADMIN_PHONES || "8983284487")
  .split(",")
  .map((p) => p.replace(/\D/g, "").slice(-10));

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check local storage for phone verified customer
    const savedPhoneUser = localStorage.getItem("dar_al_rehan_customer");
    if (savedPhoneUser) {
      try {
        const parsed = JSON.parse(savedPhoneUser);
        const cleanPhone = (parsed.phone || "").replace(/\D/g, "").slice(-10);
        if (ADMIN_PHONES.includes(cleanPhone)) {
          parsed.isAdmin = true;
        }
        setUser(parsed);
      } catch {
        localStorage.removeItem("dar_al_rehan_customer");
      }
    }

    // 2. Check Supabase Google OAuth session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        const path = window.location.pathname;
        const isUserAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === data.session.user.email?.toLowerCase());
        if (isUserAdmin && path === "/admin/login") {
          navigate("/admin/dashboard");
        }
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const path = window.location.pathname;
        const isUserAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === session.user.email?.toLowerCase());
        if (event === "SIGNED_IN" && isUserAdmin && !path.startsWith("/admin/")) {
          navigate("/admin/dashboard");
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const openAuthModal = (redirectPath = "/") => {
    setAuthRedirectPath(redirectPath);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithGoogle = async (redirectPath = "/") => {
    const check = rateLimiter.check("login");
    if (!check.allowed) {
      alert(check.message || "Too many attempts. Please wait.");
      return;
    }
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + redirectPath,
      },
    });
  };

  /**
   * Send Phone OTP via Fast2SMS
   */
  const sendPhoneOtp = async (phoneNumber) => {
    const check = rateLimiter.check("login");
    if (!check.allowed) {
      return { success: false, message: check.message || "Too many attempts. Please wait." };
    }
    return await sendOtpToPhone(phoneNumber);
  };

  /**
   * Verify Phone OTP
   */
  const verifyPhoneOtp = async (phoneNumber, otp, fullName = "") => {
    const res = await verifyOtpCode(phoneNumber, otp, fullName);
    if (res.success) {
      const cleanPhone = phoneNumber.replace(/\D/g, "").slice(-10);
      const isUserAdmin = ADMIN_PHONES.includes(cleanPhone);
      const displayName = fullName.trim() || (isUserAdmin ? "Rehan Patel (Admin)" : `+91 ${cleanPhone}`);
      const phoneUser = {
        id: `phone_${cleanPhone}`,
        phone: `+91${cleanPhone}`,
        isPhoneVerified: true,
        isAdmin: isUserAdmin,
        user_metadata: {
          full_name: displayName,
          is_admin: isUserAdmin,
        },
      };

      localStorage.setItem("dar_al_rehan_customer", JSON.stringify(phoneUser));
      setUser(phoneUser);
      setIsAuthModalOpen(false);

      // 📥 Log verified customer to Supabase for Admin records
      supabase
        .from("verified_customers")
        .upsert([
          {
            phone: `+91${cleanPhone}`,
            name: fullName.trim() || (isUserAdmin ? "Rehan Patel" : null),
            status: "verified",
            last_verified_at: new Date().toISOString(),
          },
        ], { onConflict: "phone" })
        .then(({ error }) => {
          if (error) {
            console.warn("[VerifiedCustomers] Supabase log note:", error.message);
          }
        });

      if (isUserAdmin) {
        navigate("/admin/dashboard");
      } else if (authRedirectPath && authRedirectPath !== "/") {
        navigate(authRedirectPath);
      }
    }
    return res;
  };

  const signOut = async () => {
    localStorage.removeItem("dar_al_rehan_customer");
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendPhoneOtp,
        verifyPhoneOtp,
        signInWithGoogle,
        signOut,
        authRedirectPath,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}