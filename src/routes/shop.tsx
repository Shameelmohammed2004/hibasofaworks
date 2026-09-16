import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductCategory } from "@/data/products";
import { ProductCard } from "@/components/brand/ProductCard";
import { Reveal } from "@/components/brand/Reveal";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Catalog — Hiba Sofa Works" },
      {
        name: "description",
        content:
          "Browse custom sofa styles: 3-seaters, corner sofas, 3+1+1 and 3+2 sets, lounge chaises. Made-to-measure in Bengaluru, delivered pan-India.",
      },
      { property: "og:title", content: "Catalog — Hiba Sofa Works" },
      {
        property: "og:description",
        content: "Custom sofa styles, made-to-measure in Bengaluru since 2016.",
      },
    ],
  }),
  component: Shop,
});

type Filter = "All" | ProductCategory;

function Shop() {
  const [filter, setFilter] = useState<Filter>("All");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const filtered = useMemo(
    () => (filter === "All" ? products : products.filter((p) => p.category === filter)),
    [filter, products],
  );

  const chips: Filter[] = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category))).sort();
    return ["All", ...unique];
  }, [products]);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-hiba py-16">
          <p className="eyebrow">The Catalog</p>
          <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">
            Every piece here is a starting point.{" "}
            <span className="italic text-terracotta">Yours is made to measure.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Prices shown are starting prices for standard sizes. Final quote depends on
            dimensions, fabric and configuration. Ask us — we're friendly on WhatsApp.
          </p>
        </div>
      </section>

      <section className="container-hiba py-10">
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs tracking-wide uppercase rounded-full px-4 py-2 border transition ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        {isLoading && (
          <p className="mt-16 text-center text-muted-foreground">Loading the catalog…</p>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No pieces in this category yet — WhatsApp us to build one.
          </p>
        )}
      </section>
    </>
  );
}
