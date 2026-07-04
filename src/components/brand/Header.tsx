import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalog" },
  { to: "/services", label: "Reupholstery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-espresso text-cream border-b border-white/10">
      <div className="container-hiba flex items-center justify-between py-4">
        <Logo variant="light" />
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="opacity-80 hover:opacity-100 transition-opacity"
              activeProps={{ className: "opacity-100 text-terracotta" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:07019275831"
            className="inline-flex items-center gap-2 text-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/5 transition"
          >
            <Phone className="h-3.5 w-3.5" /> 070192 75831
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm bg-terracotta text-terracotta-foreground rounded-full px-4 py-2 hover:brightness-110 transition"
          >
            Get a Quote
          </Link>
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-white/20"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-espresso">
          <div className="container-hiba flex flex-col py-4 gap-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm opacity-90"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="tel:07019275831"
              className="mt-2 inline-flex items-center justify-center gap-2 text-sm bg-terracotta text-terracotta-foreground rounded-full px-4 py-3"
            >
              <Phone className="h-4 w-4" /> Call 070192 75831
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
