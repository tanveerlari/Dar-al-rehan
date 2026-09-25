import { useState, useCallback } from "react";
import { rateLimiter } from "../utils/rateLimiter";

/**
 * 🛡️ React Hook — kisi bhi component me rate limiting lagao
 *
 * Usage:
 *   const { checkLimit, isBlocked, blockMessage } = useRateLimiter("login");
 *
 *   const handleLogin = () => {
 *     const result = checkLimit();
 *     if (!result.allowed) return;
 *     // ... proceed
 *   };
 */
export function useRateLimiter(action) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);

  const checkLimit = useCallback(() => {
    const result = rateLimiter.check(action);

    if (!result.allowed) {
      setIsBlocked(true);
      setBlockMessage(result.message || "Too many requests.");
      setRetryAfter(result.retryAfter || 0);

      // Auto-unblock after cooldown
      setTimeout(() => {
        setIsBlocked(false);
        setBlockMessage("");
        setRetryAfter(0);
      }, (result.retryAfter || 10) * 1000);
    }

    return result;
  }, [action]);

  const resetLimit = useCallback(() => {
    rateLimiter.reset(action);
    setIsBlocked(false);
    setBlockMessage("");
    setRetryAfter(0);
  }, [action]);

  const remainingAttempts = rateLimiter.remaining(action);

  return {
    checkLimit,
    resetLimit,
    isBlocked,
    blockMessage,
    retryAfter,
    remainingAttempts,
  };
}
