import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream mt-24">
      <div className="container-hiba py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-6 max-w-sm text-sm text-cream/70 leading-relaxed">
            A Bengaluru workshop crafting custom sofas, reupholstery and repair since 2016.
            Made to fit your room, delivered pan-India.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs">
            <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
            <span className="tracking-wide">4.6 · 75+ Google Reviews · Since 2016</span>
          </div>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4">Visit</p>
          <p className="flex gap-2 text-cream/80">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Veeranna Layout, 12/24 K,<br />
              Kodigehalli - Thindlu Main Rd,<br />
              GD Layout, Doddabommasandra,<br />
              Vidyaranyapura, Bengaluru 560097
            </span>
          </p>
          <p className="mt-4 flex items-center gap-2 text-cream/80">
            <Clock className="h-4 w-4" /> 9:30 AM – 9:30 PM, daily
          </p>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4">Reach us</p>
          <a href="tel:07019275831" className="flex items-center gap-2 text-cream/80 hover:text-cream">
            <Phone className="h-4 w-4" /> 070192 75831
          </a>
          <a
            href="https://wa.me/917019275831"
            className="mt-2 inline-block text-cream/80 hover:text-cream"
          >
            WhatsApp us
          </a>
          <nav className="mt-6 flex flex-col gap-2 text-cream/70">
            <Link to="/shop">Catalog</Link>
            <Link to="/services">Reupholstery & Repair</Link>
            <Link to="/about">Our Story</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-hiba py-6 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50 gap-2">
          <p>© {new Date().getFullYear()} Hiba Sofa Works · Design with Dignity</p>
          <p>Crafted in Bengaluru · Delivering across India</p>
        </div>
      </div>
    </footer>
  );
}
