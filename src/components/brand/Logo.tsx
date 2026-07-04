import { Link } from "@tanstack/react-router";

export function SofaMark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 22c0-3 2-5 5-5h42c3 0 5 2 5 5v6H6v-6z" />
      <path d="M10 17V13c0-2 2-4 4-4h36c2 0 4 2 4 4v4" />
      <path d="M14 17c0-1.5 1-3 3-3h30c2 0 3 1.5 3 3v3" />
      <path d="M10 28v5M54 28v5" />
      <path d="M20 20h8M36 20h8" />
    </svg>
  );
}

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const color = variant === "light" ? "text-cream" : "text-espresso";
  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${color} group`}>
      <SofaMark className="h-9 w-auto transition-transform group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg tracking-[0.14em]">HIBA SOFA WORKS</span>
        <span className="text-[10px] tracking-[0.32em] mt-1 opacity-70 uppercase">
          Design with Dignity
        </span>
      </span>
    </Link>
  );
}
