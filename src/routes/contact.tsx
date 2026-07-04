import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/brand/InquiryForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Hiba Sofa Works, Bengaluru" },
      {
        name: "description",
        content:
          "Visit our Bengaluru workshop or reach us on WhatsApp at 070192 75831. Open 9:30 AM – 9:30 PM daily.",
      },
      { property: "og:title", content: "Contact Hiba Sofa Works" },
      {
        property: "og:description",
        content: "Visit our Bengaluru workshop or WhatsApp us at 070192 75831.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="container-hiba py-16">
        <p className="eyebrow">Say hello</p>
        <h1 className="mt-3 text-4xl md:text-5xl max-w-2xl">
          Come by the workshop, or{" "}
          <span className="italic text-terracotta">WhatsApp us</span> — either works.
        </h1>
      </section>

      <section className="container-hiba grid lg:grid-cols-2 gap-10 pb-16">
        <div className="grid gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-terracotta mt-0.5" />
              <div>
                <p className="eyebrow">Workshop</p>
                <p className="mt-2 text-sm leading-relaxed">
                  Veeranna Layout, 12/24 K, Kodigehalli - Thindlu Main Rd,<br />
                  GD Layout, Doddabommasandra, Vidyaranyapura,<br />
                  Bengaluru, Karnataka 560097
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="tel:07019275831"
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition"
            >
              <Phone className="h-5 w-5 text-terracotta" />
              <p className="eyebrow mt-3">Call</p>
              <p className="mt-1 text-lg">070192 75831</p>
            </a>
            <a
              href="https://wa.me/917019275831"
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition"
            >
              <MessageCircle className="h-5 w-5 text-terracotta" />
              <p className="eyebrow mt-3">WhatsApp</p>
              <p className="mt-1 text-lg">Chat now</p>
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <Clock className="h-5 w-5 text-terracotta" />
            <p className="eyebrow mt-3">Open</p>
            <p className="mt-1 text-sm">9:30 AM – 9:30 PM, every day</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border">
            <iframe
              title="Hiba Sofa Works location"
              src="https://www.google.com/maps?q=Veeranna+Layout+Kodigehalli+Thindlu+Main+Rd+Vidyaranyapura+Bengaluru+560097&output=embed"
              className="w-full h-72 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <InquiryForm showDimensions />
      </section>
    </>
  );
}
