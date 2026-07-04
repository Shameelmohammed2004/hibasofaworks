import { createFileRoute } from "@tanstack/react-router";
import workshop from "@/assets/workshop.jpg";
import hero from "@/assets/hero-sofa.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Hiba Sofa Works" },
      {
        name: "description",
        content:
          "A Bengaluru workshop crafting custom sofas and restoring old ones since 2016. What Design with Dignity means to us.",
      },
      { property: "og:title", content: "Our Story — Hiba Sofa Works" },
      {
        property: "og:description",
        content:
          "A Bengaluru workshop crafting custom sofas and restoring old ones since 2016.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="container-hiba py-16 grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 text-4xl md:text-5xl">
            A workshop built on <span className="italic text-terracotta">dignity</span>,
            not scale.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Hiba Sofa Works began in a small unit in Vidyaranyapura in 2016. What
            started with a single reupholstery job has grown into a full custom
            workshop — but the philosophy hasn't changed. We take fewer orders, spend
            more time on each, and treat every sofa (new or old) with the same care.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            "Design with Dignity" is our shorthand for that: the dignity of honest
            materials, the dignity of a fair, transparent price, and the dignity of a
            customer conversation that doesn't feel like a sales pitch.
          </p>
        </div>
        <img
          src={workshop}
          alt="Workshop craftsman"
          width={1400}
          height={900}
          loading="lazy"
          className="lg:col-span-2 rounded-2xl shadow-warm w-full object-cover aspect-[4/5]"
        />
      </section>

      <section className="bg-secondary/50">
        <div className="container-hiba py-20 grid md:grid-cols-3 gap-6">
          {[
            { n: "2016", label: "Workshop founded in Bengaluru" },
            { n: "4.6★", label: "Google rating across 75+ reviews" },
            { n: "Pan-India", label: "Delivery, packed with care" },
          ].map((s) => (
            <div key={s.n} className="p-8 rounded-2xl border border-border bg-card">
              <p className="font-serif text-4xl text-terracotta">{s.n}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-hiba py-20 grid lg:grid-cols-2 gap-12 items-center">
        <img
          src={hero}
          alt="Finished custom sofa in a home"
          width={1600}
          height={1100}
          loading="lazy"
          className="rounded-2xl shadow-soft w-full object-cover aspect-[5/4]"
        />
        <div>
          <p className="eyebrow">What we believe</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Fewer sofas. Made properly.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Mass furniture is designed to be thrown away in five years. We design ours
            to be re-covered instead — same frame, new life. If you'd rather keep the
            sofa you already own, we're just as happy to restore it as to build you a
            new one.
          </p>
        </div>
      </section>
    </>
  );
}
