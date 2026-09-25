import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../components/AdminAuthContext";
import { useCustomerAuth } from "../../components/CustomerAuthContext";
import { Lock, ShieldAlert, Shield } from "lucide-react";
import { useRateLimiter } from "../../hooks/useRateLimiter";

const ADMIN_EMAIL = "laritanveer55@gmail.com";
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 Minutes

export function AdminLogin() {
  const { login } = useAdminAuth();
  const { signInWithGoogle } = useCustomerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const { checkLimit, isBlocked, blockMessage } = useRateLimiter("login");

  useEffect(() => {
    const savedLock = localStorage.getItem("admin_lockout");
    if (savedLock && new Date().getTime() < Number(savedLock)) {
      setLockoutUntil(Number(savedLock));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🛡️ Rate Limit Check (global protection)
    const rateResult = checkLimit();
    if (!rateResult.allowed) {
      setError(rateResult.message);
      return;
    }

    // Lockout Check
    if (lockoutUntil && new Date().getTime() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - new Date().getTime()) / 60000);
      setError(`Too many failed attempts. Login locked for ${minutesLeft} minute(s).`);
      return;
    }

    // Email Check
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      handleFailedAttempt();
      setError("Invalid credentials.");
      return;
    }

    const { error: authError } = await login(email, password);
    if (authError) {
      handleFailedAttempt();
      setError("Invalid credentials.");
      return;
    }

    // Reset attempts on successful login
    setAttempts(0);
    localStorage.removeItem("admin_lockout");
    navigate("/admin/dashboard");
  };

  const handleFailedAttempt = () => {
    const newCount = attempts + 1;
    setAttempts(newCount);
    if (newCount >= MAX_ATTEMPTS) {
      const lockTime = new Date().getTime() + LOCKOUT_TIME;
      setLockoutUntil(lockTime);
      localStorage.setItem("admin_lockout", String(lockTime));
      setError("Too many failed attempts. Locked for 15 minutes.");
    }
  };

  const isLocked = lockoutUntil && new Date().getTime() < lockoutUntil;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-amber-950/10 bg-white p-8 shadow-xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-800">
          <Lock className="h-6 w-6" />
        </div>

        <h1 className="text-center font-serif text-2xl text-neutral-900">Dar Al Rehan Admin</h1>
        <p className="mt-1 mb-6 text-center text-xs text-neutral-500">Restricted Management Portal</p>

        {isBlocked && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-xs text-orange-700 border border-orange-200">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>🛡️ {blockMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-neutral-600">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLocked}
            required
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-amber-700 disabled:bg-neutral-100"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-xs font-medium text-neutral-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLocked}
            required
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-amber-700 disabled:bg-neutral-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLocked}
          className="w-full rounded-full bg-neutral-900 py-3 text-xs font-semibold tracking-wider text-white hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {isLocked ? "PORTAL LOCKED" : "AUTHENTICATE"}
        </button>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Or Quick Admin Entry
          </span>
        </div>

        <button
          type="button"
          onClick={() => signInWithGoogle("/admin/dashboard")}
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
          <span>Sign In with Admin Google</span>
        </button>
      </form>
    </div>
  );
}