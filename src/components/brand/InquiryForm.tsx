import { useState, type FormEvent } from "react";
import { Send, Check } from "lucide-react";

type Props = {
  productName?: string;
  variant?: "inline" | "card";
  showDimensions?: boolean;
  title?: string;
  subtitle?: string;
};

export function InquiryForm({
  productName,
  variant = "card",
  showDimensions = false,
  title = "Request a custom quote",
  subtitle = "We'll reply on WhatsApp within a few hours.",
}: Props) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const city = String(data.get("city") ?? "");
    const interest = productName ?? String(data.get("interest") ?? "");
    const dimensions = String(data.get("dimensions") ?? "");
    const message = String(data.get("message") ?? "");

    const text = [
      `Hi Hiba Sofa Works, I'd like a quote.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      city && `City: ${city}`,
      interest && `Interest: ${interest}`,
      dimensions && `Room / sofa dimensions: ${dimensions}`,
      message && `Notes: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/917019275831?text=${encodeURIComponent(text)}`,
      "_blank",
      "noreferrer",
    );
    setSent(true);
  }

  const wrap =
    variant === "card"
      ? "bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft"
      : "";

  return (
    <div className={wrap}>
      <div>
        <p className="eyebrow">Get in touch</p>
        <h3 className="text-2xl mt-1">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field name="name" label="Your name" required />
          <Field name="phone" label="Phone / WhatsApp" required type="tel" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field name="city" label="City" placeholder="Bengaluru" />
          {productName ? (
            <Field name="interest" label="Interested in" value={productName} readOnly />
          ) : (
            <Field name="interest" label="Interested in" placeholder="3-Seater, Reupholstery…" />
          )}
        </div>
        {showDimensions && (
          <Field name="dimensions" label="Room / sofa dimensions" placeholder="e.g. 8 ft × 3 ft" />
        )}
        <label className="grid gap-1.5 text-sm">
          <span className="text-foreground/80">Notes</span>
          <textarea
            name="message"
            rows={4}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            placeholder="Fabric preference, timeline, or anything else…"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm hover:brightness-110 transition"
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" /> Opened WhatsApp — thank you
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send via WhatsApp
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Prefer to call? <a href="tel:07019275831" className="underline">070192 75831</a>
          {" · "}9:30 AM – 9:30 PM, daily
        </p>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  placeholder,
  value,
  readOnly,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-foreground/80">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={value}
        readOnly={readOnly}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 read-only:bg-muted read-only:text-muted-foreground"
      />
    </label>
  );
}
