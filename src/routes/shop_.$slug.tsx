import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowLeft, ShoppingBag } from "lucide-react";
import { fetchProductBySlug, fetchProducts } from "@/data/products";
import { InquiryForm } from "@/components/brand/InquiryForm";
import { ProductCard } from "@/components/brand/ProductCard";
import { useCart, getEffectiveDeposit } from "@/lib/cart";
import { Reveal } from "@/components/brand/Reveal";

export const Route = createFileRoute("/shop_/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    const all = await fetchProducts();
    const related = all.filter((p) => p.slug !== product.slug).slice(0, 3);
    return { product, related };
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
  const { product, related } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const deposit = getEffectiveDeposit(product);

  function handleAddToCart() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

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
        <Reveal>
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
        </Reveal>

        <Reveal delay={0.15}>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-5xl md:text-6xl leading-[1.03] tracking-tight">{product.name}</h1>
          <p className="mt-3 text-lg italic text-muted-foreground">{product.tagline}</p>

                  <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl">
                {product.startingPrice
                  ? `From ₹${product.startingPrice.toLocaleString("en-IN")}`
                  : "Price on request"}
              </span>
              {product.compareAtPrice && product.startingPrice && product.compareAtPrice > product.startingPrice && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Final price may vary based on size, fabric &amp; customization
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
              >
                <ShoppingBag className="h-4 w-4" />
                {added ? "Added to cart" : "Add to cart"}
              </button>
              <button
                onClick={() => {
                  addItem(product, 1);
                  navigate({ to: "/cart" });
                }}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary transition"
              >
                Reserve now
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Reserving pays a ₹{deposit.toLocaleString("en-IN")} booking deposit today — the
              balance is settled with us directly once your final quote is confirmed.
            </p>
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
        </Reveal>
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
