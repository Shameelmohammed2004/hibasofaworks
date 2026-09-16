import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { createCheckoutOrder, verifyCheckoutPayment } from "@/lib/checkout-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const { items, depositSubtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container-hiba py-24 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-3xl">Your cart is empty</h1>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const order = await createCheckoutOrder({ data: { ...form, items } });
      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "Hiba Sofa Works",
        description: "Booking deposit",
        order_id: order.razorpayOrderId,
        prefill: {
          name: form.customerName,
          contact: form.phone,
          email: form.email || undefined,
        },
        theme: { color: "#8a4a3a" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyCheckoutPayment({
              data: {
                orderId: order.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });
            clear();
            navigate({ to: "/order-confirmed" });
          } catch {
            setError(
              "Payment went through but we couldn't confirm it automatically. We'll verify manually and reach out on WhatsApp — no need to pay again.",
            );
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-hiba py-12">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-2 text-3xl">Confirm your reservation</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Full name</Label>
              <Input
                id="customerName"
                required
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (WhatsApp preferred)</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="address">Delivery address</Label>
            <Input
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? "Opening secure payment…"
              : `Pay ₹${depositSubtotal.toLocaleString("en-IN")} deposit`}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Payments are processed securely by Razorpay. We never see or store your card details.
          </p>
        </form>

        <div className="rounded-2xl border border-border bg-secondary/40 p-6 h-fit">
          <p className="font-medium">Order summary</p>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.slug} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.depositAmount * item.quantity).toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
            <span>Deposit due today</span>
            <span>₹{depositSubtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
