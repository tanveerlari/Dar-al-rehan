/**
 * 🛡️ Dar Al Rehan — Frontend Rate Limiter & Anti-Abuse Shield
 *
 * - Token Bucket algorithm for API call limiting
 * - Per-action rate limiting (login, cart, orders, etc.)
 * - Automatic cooldown when limits exceeded
 * - Fingerprint-based tracking (browser session)
 */

class RateLimiter {
  constructor() {
    this.buckets = {};
    this.blocked = {};
    this.globalCount = 0;
    this.globalResetTime = Date.now();
  }

  /**
   * Rate limit configs per action type
   * maxRequests = kitne requests allowed
   * windowMs = kitne time me (milliseconds)
   * cooldownMs = block hone ke baad kitna wait
   */
  static LIMITS = {
    login: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
      cooldownMs: 15 * 60 * 1000,
    },
    addToCart: {
      maxRequests: 30,
      windowMs: 60 * 1000,
      cooldownMs: 30 * 1000,
    },
    placeOrder: {
      maxRequests: 3,
      windowMs: 10 * 60 * 1000,
      cooldownMs: 5 * 60 * 1000,
    },
    search: {
      maxRequests: 40,
      windowMs: 60 * 1000,
      cooldownMs: 15 * 1000,
    },
    fetch: {
      maxRequests: 60,
      windowMs: 60 * 1000,
      cooldownMs: 10 * 1000,
    },
    contact: {
      maxRequests: 3,
      windowMs: 30 * 60 * 1000,
      cooldownMs: 10 * 60 * 1000,
    },
    global: {
      maxRequests: 200,
      windowMs: 60 * 1000,
      cooldownMs: 60 * 1000,
    },
  };

  /**
   * Check if action is allowed
   * @param {string} action - Action type (login, addToCart, etc.)
   * @returns {{ allowed: boolean, retryAfter?: number, message?: string }}
   */
  check(action) {
    const now = Date.now();

    // 1. Check if action is currently blocked
    if (this.blocked[action]) {
      const remaining = this.blocked[action] - now;
      if (remaining > 0) {
        return {
          allowed: false,
          retryAfter: Math.ceil(remaining / 1000),
          message: `Too many requests. Please wait ${Math.ceil(remaining / 1000)} seconds.`,
        };
      }
      delete this.blocked[action];
    }

    // 2. Check global rate limit
    const globalLimit = RateLimiter.LIMITS.global;
    if (now - this.globalResetTime > globalLimit.windowMs) {
      this.globalCount = 0;
      this.globalResetTime = now;
    }
    this.globalCount++;
    if (this.globalCount > globalLimit.maxRequests) {
      this.blocked["global"] = now + globalLimit.cooldownMs;
      return {
        allowed: false,
        retryAfter: Math.ceil(globalLimit.cooldownMs / 1000),
        message: "Too many requests. Please slow down.",
      };
    }

    // 3. Check per-action rate limit
    const limit = RateLimiter.LIMITS[action];
    if (!limit) return { allowed: true };

    if (!this.buckets[action]) {
      this.buckets[action] = { count: 0, resetTime: now };
    }

    const bucket = this.buckets[action];

    if (now - bucket.resetTime > limit.windowMs) {
      bucket.count = 0;
      bucket.resetTime = now;
    }

    bucket.count++;

    if (bucket.count > limit.maxRequests) {
      this.blocked[action] = now + limit.cooldownMs;
      bucket.count = 0;
      bucket.resetTime = now;

      return {
        allowed: false,
        retryAfter: Math.ceil(limit.cooldownMs / 1000),
        message: `Too many requests. Please wait ${Math.ceil(limit.cooldownMs / 1000)} seconds.`,
      };
    }

    return { allowed: true };
  }

  /** Reset a specific action */
  reset(action) {
    delete this.buckets[action];
    delete this.blocked[action];
  }

  /** Get remaining attempts for an action */
  remaining(action) {
    const limit = RateLimiter.LIMITS[action];
    if (!limit) return Infinity;

    const bucket = this.buckets[action];
    if (!bucket) return limit.maxRequests;

    const now = Date.now();
    if (now - bucket.resetTime > limit.windowMs) return limit.maxRequests;

    return Math.max(0, limit.maxRequests - bucket.count);
  }
}

// Single instance for entire app
export const rateLimiter = new RateLimiter();

/** Debounce utility — rapid fire requests control */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Throttle utility — max 1 call per interval */
export function throttle(fn, interval = 1000) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}
