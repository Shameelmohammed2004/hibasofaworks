import { Star, Truck, ShieldCheck } from "lucide-react";

export function TrustBar() {
  return (
    <div className="border-y border-border bg-secondary/60">
      <div className="container-hiba py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs md:text-sm text-foreground/70">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" /> Trusted Since 2016
        </span>
        <span className="inline-flex items-center gap-2">
          <Star className="h-4 w-4 fill-accent text-accent" /> 4.6 ★ · 75+ Google Reviews
        </span>
        <span className="inline-flex items-center gap-2">
          <Truck className="h-4 w-4 text-accent" /> Pan-India Delivery
        </span>
      </div>
    </div>
  );
}
