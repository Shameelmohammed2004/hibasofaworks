import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Booking Confirmed — Hiba Sofa Works" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  return (
    <div className="container-hiba py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-terracotta" />
      <p className="eyebrow mt-6">Booking Confirmed</p>
      <h1 className="mt-3 text-4xl">Your deposit is in — thank you.</h1>
      <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
        We've received your booking deposit. Our team will reach out on WhatsApp shortly to
        confirm dimensions, fabric, and your final quote before we begin work.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://wa.me/917019275831"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
        >
          Message us on WhatsApp
        </a>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary transition"
        >
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
