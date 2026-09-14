import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.compareAtPrice &&
    product.startingPrice &&
    product.compareAtPrice > product.startingPrice;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.startingPrice!) / product.compareAtPrice!) * 100
      )
    : 0;

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-warm transition-shadow"
    >
      <div className="aspect-[5/4] overflow-hidden bg-secondary relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {discountPercent}% off
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="eyebrow">{product.category}</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug">{product.name}</h3>
          <ArrowUpRight className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-accent transition" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{product.tagline}</p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-foreground/80">
              {product.startingPrice ? (
                <span className="flex items-baseline gap-2">
                  <span className="text-base font-medium text-foreground">
                    ₹{product.startingPrice.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.compareAtPrice!.toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              ) : (
                "Price on request"
              )}
            </span>
            <span className="text-accent">Enquire →</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Final price may vary based on size, fabric &amp; customization
          </p>
        </div>
      </div>
    </Link>
  );
}