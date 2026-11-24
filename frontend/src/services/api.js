// Rate-limited API client for server-side actions.
// This module is intentionally kept free of secret keys.
// Real backend calls (auth admin, email sends, data deletion)
// should go through your own backend endpoints, not directly
// from the browser with a service-role key.

import { SITE_CONFIG } from "../config/site";

const pendingRequests = new Map(); // key -> { count, resetAt }

function windowKey(endpoint) {
  const now = Date.now();
  const windowStart = Math.floor(
    now / (SITE_CONFIG.limits.rateLimitWindowSeconds * 1000)
  );
  return `${endpoint}:${windowStart}`;
}

export async function rateLimitedFetch(endpoint, options = {}) {
  const key = windowKey(endpoint);
  const entry = pendingRequests.get(key) || { count: 0, resetAt: 0 };

  const now = Date.now();
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + SITE_CONFIG.limits.rateLimitWindowSeconds * 1000;
  }

  if (entry.count >= SITE_CONFIG.limits.rateLimitMaxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    throw new Error(
      `Rate limit exceeded. Please try again in ${retryAfter} second(s).`
    );
  }

  entry.count += 1;
  pendingRequests.set(key, entry);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        body || `Request failed with status ${response.status}`
      );
    }

    return await response.json().catch(() => ({}));
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getRateLimitStatus(endpoint) {
  const key = windowKey(endpoint);
  const entry = pendingRequests.get(key);
  if (!entry) return { remaining: SITE_CONFIG.limits.rateLimitMaxRequests, resetAt: 0 };
  return {
    remaining: Math.max(0, SITE_CONFIG.limits.rateLimitMaxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

export default {
  rateLimitedFetch,
  getRateLimitStatus,
};
