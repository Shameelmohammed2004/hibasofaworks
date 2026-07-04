import { createFileRoute } from "@tanstack/react-router";
import { Check, Upload } from "lucide-react";
import beforeAfter from "@/assets/before-after.jpg";
import workshop from "@/assets/workshop.jpg";
import { InquiryForm } from "@/components/brand/InquiryForm";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Reupholstery & Repair — Hiba Sofa Works" },
      {
        name: "description",
        content:
          "Give old furniture new life. Frame repair, foam replacement, reupholstery — done in our Bengaluru workshop. Design with Dignity.",
      },
      { property: "og:title", content: "Reupholstery & Repair — Hiba Sofa Works" },
      {
        property: "og:description",
        content:
          "Frame repair, foam replacement, reupholstery — done in our Bengaluru workshop since 2016.",
      },
    ],
  }),
  component: Services,
});

const steps = [
  {
    n: "01",
    title: "Send us a photo",
    body: "WhatsApp a photo of your sofa and describe the issue. We'll reply with a rough estimate the same day.",
  },
  {
    n: "02",
    title: "Free home inspection",
    body: "Within Bengaluru, we visit to inspect the frame, foam and fabric — and share a firm quote and fabric swatches.",
  },
  {
    n: "03",
    title: "Workshop transformation",
    body: "We restore the frame, replace foam if needed, and re-cover in your chosen fabric. Usually 5–10 days.",
  },
  {
    n: "04",
    title: "Delivered back home",
    body: "We return your sofa — cleaned, wrapped, and ready to sit on. Pan-India dispatch also available.",
  },
];

function Services() {
  return (
    <>
      <section className="container-hiba py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Reupholstery & Repair</p>
          <h1 className="mt-3 text-4xl md:text-5xl">
            Design with Dignity —{" "}
            <span className="italic text-terracotta">for the sofa you already love.</span>
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            A worn sofa isn't a lost sofa. We rebuild frames, replace sagging foam,
            and re-cover in fabrics that actually last — often for a fraction of the
            cost of new. Every piece we restore leaves the workshop feeling like it
            deserves another decade.
          </p>
          <a
            href="https://wa.me/917019275831?text=Hi%2C%20I%27d%20like%20a%20reupholstery%20estimate.%20I%27ll%20share%20a%20photo."
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:brightness-110 transition"
          >
            <Upload className="h-4 w-4" /> Send a photo for an estimate
          </a>
        </div>
        <img
          src={beforeAfter}
          alt="Before and after reupholstery"
          width={1400}
          height={800}
          loading="lazy"
          className="rounded-2xl shadow-warm w-full object-cover aspect-[7/4]"
        />
      </section>

      <section className="bg-secondary/50">
        <div className="container-hiba py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Everything a good sofa needs.</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {[
              "Full reupholstery in fabric or leatherette",
              "Foam replacement (HR / memory / firm)",
              "Frame reinforcement & repair",
              "Recliner mechanism repair",
              "Deep cleaning & fabric protection",
              "Custom slipcovers made to fit",
            ].map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4"
              >
                <Check className="h-4 w-4 text-terracotta shrink-0" />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-hiba py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Four simple steps.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="p-6 rounded-2xl border border-border bg-card">
              <span className="font-serif text-3xl italic text-terracotta">{s.n}</span>
              <h3 className="mt-3 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-hiba pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <img
          src={workshop}
          alt="Hand-stitching in the workshop"
          width={1400}
          height={900}
          loading="lazy"
          className="rounded-2xl shadow-soft w-full object-cover aspect-[3/2]"
        />
        <InquiryForm
          title="Get a reupholstery estimate"
          subtitle="Tell us about the sofa. Share a photo directly on WhatsApp after submitting."
          showDimensions
        />
      </section>
    </>
  );
}
