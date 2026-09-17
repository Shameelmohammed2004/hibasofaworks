import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkProjects } from "@/data/ourWork";
import { InquiryForm } from "@/components/brand/InquiryForm";
import {
  Reveal,
  HeadlineReveal,
  SliceReveal,
} from "@/components/motion/motion";

export const Route = createFileRoute("/our-work")({
  head: () => ({
    meta: [
      { title: "Our Work — Hiba Sofa Works" },
      {
        name: "description",
        content:
          "Before and after photos of reupholstery and repair projects from our Bengaluru workshop.",
      },
    ],
  }),
  component: OurWork,
});

function OurWork() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["our-work"],
    queryFn: fetchWorkProjects,
  });

  return (
    <>
      {/* Header */}
      <section className="container-hiba pt-14 lg:pt-20">
        <p className="eyebrow">Reupholstery &amp; Repair</p>
        <HeadlineReveal
          className="mt-4 text-4xl md:text-6xl leading-[1.05] max-w-3xl"
          lines={[
            "Every restoration",
            <span className="italic text-terracotta" key="l2">
              tells a story.
            </span>,
          ]}
        />
        <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
          Frames rebuilt, foam replaced, fabric reborn. Hover any project to see
          how it came out.
        </p>
      </section>

      {/* Projects */}
      <section className="container-hiba py-14 lg:py-20">
        {isLoading && (
          <p className="py-16 text-center text-muted-foreground">
            Loading projects…
          </p>
        )}

        {isError && (
          <p className="py-16 text-center text-muted-foreground">
            We couldn't load the projects just now. Please refresh the page.
          </p>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Our project gallery is being photographed right now.
            </p>
            <a
              href="https://wa.me/917019275831?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20reupholstery."
              className="hiba-lift mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:brightness-110 transition"
            >
              Send us a photo for an estimate
            </a>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.id ?? project.title} delay={i * 90}>
              <article className="hiba-lift rounded-2xl border border-border bg-card overflow-hidden h-full">
                <SliceReveal
                  className="aspect-[4/3]"
                  base={
                    <>
                      <img
                        src={project.beforeUrl}
                        alt={`${project.title}, before restoration`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">
                        Before
                      </span>
                    </>
                  }
                  overlay={
                    <>
                      <img
                        src={project.afterUrl}
                        alt={`${project.title}, after restoration`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">
                        After
                      </span>
                    </>
                  }
                />
                <div className="p-5">
                  <h2 className="text-xl">{project.title}</h2>
                  {project.description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-espresso text-cream">
        <div className="container-hiba py-16 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <p className="eyebrow">Free estimate</p>
              <h2 className="mt-3 text-3xl md:text-4xl">
                Send a photo of your sofa.
              </h2>
              <p className="mt-4 text-cream/80 leading-relaxed max-w-md">
                Most reupholstery quotes come back the same day. Message us on
                WhatsApp with a photo and rough dimensions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/917019275831?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20reupholstery."
                  className="hiba-lift inline-flex items-center gap-2 rounded-full bg-terracotta text-white px-6 py-3 text-sm hover:brightness-110 transition"
                >
                  WhatsApp us
                </a>
                <Link
                  to="/shop"
                  className="hiba-lift inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/5 transition"
                >
                  Browse the catalog
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <InquiryForm
              title="Or tell us here"
              subtitle="Share what needs restoring and we'll come back with an estimate."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
