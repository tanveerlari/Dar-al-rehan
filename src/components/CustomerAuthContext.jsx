import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { rateLimiter } from "../utils/rateLimiter";
import { sendOtpToPhone, verifyOtpCode } from "../utils/smsService";

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
        if (data.session.user.email?.toLowerCase() === "laritanveer55@gmail.com" && path === "/admin/login") {
          navigate("/admin/dashboard");
        }
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const path = window.location.pathname;
        if (event === "SIGNED_IN" && session.user.email?.toLowerCase() === "laritanveer55@gmail.com" && !path.startsWith("/admin/")) {
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
  const verifyPhoneOtp = (phoneNumber, otp) => {
    const res = verifyOtpCode(phoneNumber, otp);
    if (res.success) {
      const cleanPhone = phoneNumber.replace(/\D/g, "").slice(-10);
      const phoneUser = {
        id: `phone_${cleanPhone}`,
        phone: `+91${cleanPhone}`,
        isPhoneVerified: true,
        user_metadata: {
          full_name: `+91 ${cleanPhone}`,
        },
      };

      localStorage.setItem("dar_al_rehan_customer", JSON.stringify(phoneUser));
      setUser(phoneUser);
      setIsAuthModalOpen(false);

      // 📥 Log verified customer to Supabase for Admin records
      supabase
        .from("verified_customers")
        .insert([
          {
            phone: `+91${cleanPhone}`,
            created_at: new Date().toISOString(),
            status: "verified",
          },
        ])
        .then(({ error }) => {
          if (error) {
            console.warn("[VerifiedCustomers] Supabase log note:", error.message);
          }
        });

      if (authRedirectPath && authRedirectPath !== "/") {
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