import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin, getRazorpayCredentials } from "@/lib/supabase-admin";
import type { CartItem } from "@/lib/cart";

type CreateOrderInput = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  items: CartItem[];
};

type CreateOrderResult = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  keyId: string;
};

export const createCheckoutOrder = createServerFn({ method: "POST" })
  .validator((data: CreateOrderInput) => data)
  .handler(async ({ data }): Promise<CreateOrderResult> => {
    if (!data.customerName?.trim() || !data.phone?.trim() || !data.address?.trim()) {
      throw new Error("Name, phone, and address are required.");
    }
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const { keyId, keySecret } = getRazorpayCredentials();
    const supabaseAdmin = getSupabaseAdmin();

    // Recompute the deposit total on the server — never trust a client-sent
    // total directly, only the per-item deposit amounts and quantities.
    const depositSubtotal = data.items.reduce(
      (sum, item) => sum + Math.max(0, item.depositAmount) * Math.max(1, item.quantity),
      0,
    );

    if (depositSubtotal <= 0) {
      throw new Error("Nothing to charge — check the cart's deposit amounts.");
    }

    const receipt = `hiba-${Date.now()}`;
    const amountPaise = Math.round(depositSubtotal * 100);

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt,
      }),
    });

    if (!razorpayRes.ok) {
      const text = await razorpayRes.text();
      throw new Error(`Razorpay order creation failed: ${text}`);
    }

    const razorpayOrder = (await razorpayRes.json()) as { id: string };

    const { data: orderRow, error } = await supabaseAdmin
      .from("orders")
      .insert({
        razorpay_order_id: razorpayOrder.id,
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        items: data.items,
        subtotal: depositSubtotal,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !orderRow) {
      throw new Error(`Failed to save order: ${error?.message ?? "unknown error"}`);
    }

    return {
      orderId: orderRow.id as string,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      keyId,
    };
  });

type VerifyInput = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const verifyCheckoutPayment = createServerFn({ method: "POST" })
  .validator((data: VerifyInput) => data)
  .handler(async ({ data }): Promise<{ success: true }> => {
    const { keySecret } = getRazorpayCredentials();

    const expectedSignature = await hmacSha256Hex(
      `${data.razorpayOrderId}|${data.razorpayPaymentId}`,
      keySecret,
    );

    if (expectedSignature !== data.razorpaySignature) {
      throw new Error("Payment verification failed — signature mismatch.");
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: data.razorpayPaymentId })
      .eq("id", data.orderId);

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return { success: true };
  });
