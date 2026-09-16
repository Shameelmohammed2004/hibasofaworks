import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, setQuantity, depositSubtotal, estimatedSubtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-hiba py-24 text-center">
        <p className="eyebrow">Your Cart</p>
        <h1 className="mt-3 text-3xl">Nothing reserved yet</h1>
        <p className="mt-3 text-muted-foreground">
          Browse the catalog and reserve a piece with a small booking deposit.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-hiba py-12">
      <p className="eyebrow">Your Cart</p>
      <h1 className="mt-2 text-3xl">Review your reservation</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex gap-4 rounded-2xl border border-border p-4"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="h-24 w-24 shrink-0 rounded-xl bg-secondary" />
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.category}
                  </p>
                  <p className="mt-1 font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Booking deposit: ₹{item.depositAmount.toLocaleString("en-IN")} each
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-6 h-fit">
          <p className="font-medium">Order summary</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated total</span>
              <span>₹{estimatedSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
              <span>Booking deposit due today</span>
              <span>₹{depositSubtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            The estimated total assumes standard sizing. Your final price is confirmed with
            you directly based on exact dimensions and fabric before we begin work — the
            balance is due then, not today.
          </p>
          <Link
            to="/checkout"
            className="mt-5 block w-full rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground hover:brightness-110 transition"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
