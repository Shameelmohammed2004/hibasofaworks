import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

/* ------------------------------------------------------------------ */
/* useInView — shared IntersectionObserver hook                        */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or SSR hydration edge) → just show it.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Reveal — fade + slide up when scrolled into view                    */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={`hiba-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* HeadlineReveal — lines rise up on mount, staggered                  */
/* ------------------------------------------------------------------ */

export function HeadlineReveal({
  lines,
  className = "",
  as: Tag = "h1",
  stagger = 90,
}: {
  /** each array item becomes one animated line */
  lines: ReactNode[];
  className?: string;
  as?: ElementType;
  /** ms between each line */
  stagger?: number;
}) {
  return (
    <Tag className={`hiba-headline ${className}`}>
      {lines.map((line, i) => (
        <span className="hiba-headline-line" key={i}>
          <span style={{ animationDelay: `${i * stagger}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite horizontal ticker                                */
/* ------------------------------------------------------------------ */

export function Marquee({
  items,
  className = "",
  duration = 20,
}: {
  items: string[];
  className?: string;
  /** seconds for one full loop */
  duration?: number;
}) {
  // Duplicated so the -50% translate loops seamlessly.
  const doubled = [...items, ...items];

  return (
    <div className={`hiba-marquee ${className}`} aria-hidden="true">
      <div
        className="hiba-marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — number counts from 0 when scrolled into view              */
/* ------------------------------------------------------------------ */

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1200,
  className = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  /** ms */
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Respect reduced motion: jump straight to the final value.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
      else setValue(to);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SliceReveal — vertical strips wipe open on hover                    */
/* ------------------------------------------------------------------ */

export function SliceReveal({
  base,
  overlay,
  strips = 7,
  className = "",
}: {
  /** what shows by default */
  base: ReactNode;
  /** what the strips wipe open to reveal */
  overlay: ReactNode;
  strips?: number;
  className?: string;
}) {
  return (
    <div className={`hiba-slice ${className}`}>
      <div className="hiba-slice-base">{base}</div>

      <div className="hiba-slice-strips" aria-hidden="true">
        {Array.from({ length: strips }).map((_, i) => (
          <span
            key={i}
            className="hiba-slice-strip"
            style={{ transitionDelay: `${i * 45}ms` }}
          />
        ))}
      </div>

      <div className="hiba-slice-overlay">{overlay}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ParallaxTilt — child shifts a few px toward the cursor              */
/* ------------------------------------------------------------------ */

export function ParallaxTilt({
  children,
  strength = 12,
  className = "",
}: {
  children: ReactNode;
  /** max px of travel */
  strength?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // Pointer-based parallax is a mouse affordance; skip on touch.
    if (!window.matchMedia?.("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      inner.style.transform = `translate3d(${dx * strength}px, ${
        dy * strength * 0.7
      }px, 0)`;
    };

    const onLeave = () => {
      inner.style.transform = "translate3d(0, 0, 0)";
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={innerRef} className="hiba-parallax-inner">
        {children}
      </div>
    </div>
  );
}
