import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ruler, Wrench, Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero-sofa.jpg";
import beforeAfter from "@/assets/before-after.jpg";
import workshop from "@/assets/workshop.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/data/products";
import { fetchReviews } from "@/data/reviews";
import { ProductCard } from "@/components/brand/ProductCard";
import { TrustBar } from "@/components/brand/TrustBar";
import { InquiryForm } from "@/components/brand/InquiryForm";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="container-hiba grid lg:grid-cols-2 gap-10 lg:gap-16 py-14 lg:py-24 items-center">
          <div>
            <p className="eyebrow">Since 2016 · Bengaluru</p>
            <h1 className="mt-4 text-4xl md:text-6xl leading-[1.05]">
              Sofas made to fit <br />
              <span className="italic text-terracotta">your room</span>,<br /> not the other way around.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
              Hand-built custom sofas, reupholstery and repair from a small
              Bengaluru workshop. Nearly a decade of quiet, careful craft —
              delivered across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:brightness-110 transition"
              >
                Get a custom quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/917019275831"
                className="inline-flex items-center gap-2 rounded-full border border-input px-6 py-3 text-sm hover:bg-secondary transition"
              >
                WhatsApp us
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
                <span className="ml-1">4.6 · 75+ Google reviews</span>
              </div>
              <span className="hidden sm:inline">Pan-India delivery</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-terracotta/10 rounded-3xl -z-10" />
            <img
              src={hero}
              alt="Custom Hiba sofa in a warm living room"
              width={1600}
              height={1100}
              className="rounded-2xl shadow-warm w-full object-cover aspect-[5/4]"
            />
            <div className="absolute -bottom-6 -left-6 bg-cream border border-border rounded-2xl px-5 py-4 shadow-soft hidden md:block">
              <p className="eyebrow">Design with</p>
              <p className="font-serif text-2xl italic text-terracotta">Dignity.</p>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Why */}
      <section className="container-hiba py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Hiba Sofa Works</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            A workshop, not a factory. A sofa, not a shipment.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Ruler,
              title: "Sized to your room",
              body: "We measure in inches, not sizes. Every sofa is made to the exact dimensions of your space.",
            },
            {
              icon: Wrench,
              title: "Reupholstery & repair",
              body: "Tired frame, sagging seats, faded fabric? We restore what you already own — often for a fraction of new.",
            },
            {
              icon: Sparkles,
              title: "Craft that lasts",
              body: "Seasoned hardwood, high-density foam, hand-finished stitching. Built to be re-covered a decade later.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="p-6 rounded-2xl border border-border bg-card">
              <Icon className="h-6 w-6 text-terracotta" />
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-secondary/50">
        <div className="container-hiba py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow">The Catalog</p>
              <h2 className="mt-2 text-3xl md:text-4xl">Recently made</h2>
            </div>
            <Link to="/shop" className="text-sm text-accent hover:underline">
              View full catalog →
            </Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="container-hiba py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Reupholstery & Repair</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            Old sofa. New life. <span className="italic text-terracotta">Same dignity.</span>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Some of our proudest work isn't new at all. We rebuild frames,
            replace foam, and re-cover heirloom sofas so they feel — and last —
            like new. Send us a photo on WhatsApp for a free estimate.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm hover:brightness-110 transition"
            >
              See the transformation
            </Link>
            <a
              href="https://wa.me/917019275831?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20reupholstery."
              className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-3 text-sm hover:bg-secondary transition"
            >
              Send a photo
            </a>
          </div>
        </div>
        <img
          src={beforeAfter}
          alt="Before and after reupholstery"
          width={1400}
          height={800}
          loading="lazy"
          className="rounded-2xl shadow-soft w-full object-cover aspect-[7/4]"
        />
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
      <section className="bg-espresso text-cream"><div className="container-hiba py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Google Reviews</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Words from our customers</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">            {reviews.map((r) => (
              <blockquote
                key={r.id ?? r.authorName}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-terracotta text-terracotta" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cream/85">"{r.text}"</p>
                <footer className="mt-6 text-xs text-cream/60">
                  {r.authorName} · {r.city}
                </footer>
              </blockquote>
            ))}
          </div>
               </div>
      </section>
      )}

      {/* CTA */}
      <section className="container-hiba py-20 grid lg:grid-cols-2 gap-10 items-center">
        <img
          src={workshop}
          alt="Craftsman working in the Hiba workshop"
          width={1400}
          height={900}
          loading="lazy"
          className="rounded-2xl shadow-soft w-full object-cover aspect-[3/2]"
        />
        <InquiryForm
          title="Tell us about your space"
          subtitle="Share your room size and taste — we'll come back with a made-to-measure quote."
          showDimensions
        />
      </section>
    </>
  );
}
