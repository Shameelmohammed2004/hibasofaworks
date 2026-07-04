import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { products } from "@/data/products";
import { InquiryForm } from "@/components/brand/InquiryForm";
import { ProductCard } from "@/components/brand/ProductCard";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Hiba Sofa Works` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.name} — Hiba Sofa Works` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-hiba py-24 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 text-3xl">This sofa isn't in the catalog</h1>
      <Link to="/shop" className="mt-6 inline-block text-accent hover:underline">
        ← Back to catalog
      </Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="container-hiba py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Catalog
        </Link>
      </section>

      <section className="container-hiba grid lg:grid-cols-2 gap-12 pb-16">
        <div>
          <div className="aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-secondary">
            <img
              src={product.gallery[active]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 flex gap-3">
            {product.gallery.map((g: string, i: number) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-20 w-24 rounded-lg overflow-hidden border-2 transition ${
                  i === active ? "border-terracotta" : "border-transparent opacity-70"
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-lg italic text-muted-foreground">{product.tagline}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-2xl">
              {product.startingPrice
                ? `From ₹${product.startingPrice.toLocaleString("en-IN")}`
                : "Price on request"}
            </span>
            <span className="text-xs text-muted-foreground">final quote based on size & fabric</span>
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd className="mt-1">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fabric</dt>
              <dd className="mt-1">{product.fabric}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Seating</dt>
              <dd className="mt-1">{product.seating}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="mt-1">Pan-India</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2 text-sm">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-terracotta mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/60 p-5 text-sm">
            <p className="font-medium">Care & warranty</p>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              10-year hardwood frame warranty. Removable covers washable per fabric care card.
              Free reupholstery consultation at year 5.
            </p>
          </div>
        </div>
      </section>

      <section className="container-hiba pb-20">
        <InquiryForm
          productName={product.name}
          showDimensions
          title={`Customise the ${product.name}`}
          subtitle="Tell us your room dimensions and fabric taste. We'll reply on WhatsApp with options and a quote."
        />
      </section>

      <section className="bg-secondary/50">
        <div className="container-hiba py-16">
          <h2 className="text-2xl">You may also like</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
