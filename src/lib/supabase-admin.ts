import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this from a component or anything that runs in
// the browser — the service role key bypasses Row Level Security entirely.
//
// The values here come from Cloudflare's RUNTIME "Variables and Secrets"
// (Settings -> Runtime), not the build-time VITE_ variables. Cloudflare
// exposes those to the worker via a global set by the Nitro cloudflare
// preset at request time.
function getRuntimeEnv(): Record<string, string | undefined> {
  const env = (globalThis as unknown as { __env__?: Record<string, string> }).__env__;
  return env ?? (process.env as Record<string, string | undefined>);
}

export function getSupabaseAdmin() {
  const env = getRuntimeEnv();
  const url = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY runtime variables. " +
        "Add them under Cloudflare -> Settings -> Runtime -> Variables and Secrets.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export function getRazorpayCredentials() {
  const env = getRuntimeEnv();
  const keyId = env.RAZORPAY_KEY_ID;
  const keySecret = env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET runtime variables. " +
        "Add them under Cloudflare -> Settings -> Runtime -> Variables and Secrets.",
    );
  }

  return { keyId, keySecret };
}
