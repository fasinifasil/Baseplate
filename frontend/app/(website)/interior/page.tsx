"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Service = {
  id: number;
  title: string;
  slug: string;
  short_tagline?: string;
  description?: string;
  cover_image_url?: string | null;
  order?: number;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  service?: number | null;
  service_title?: string;
  client_name?: string;
  event_or_venue?: string;
  location?: string;
  stand_area?: string | number | null;
  completion_year?: number | null;
  hero_image_url?: string | null;
  summary?: string;
  is_featured?: boolean;
};

function getList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === "object" &&
    "results" in payload &&
    Array.isArray((payload as { results: unknown }).results)
  ) {
    return (payload as { results: T[] }).results;
  }
  return [];
}

const interiorImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400",
];

export default function InteriorPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadInteriorContent() {
      try {
        setLoading(true);
        setError("");

        const [servicesResponse, projectsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/services/`, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/projects/`, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!servicesResponse.ok || !projectsResponse.ok) {
          throw new Error("The website content could not be loaded. Please try again.");
        }

        const [servicesPayload, projectsPayload] = await Promise.all([
          servicesResponse.json(),
          projectsResponse.json(),
        ]);

        const allServices = getList<Service>(servicesPayload).sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
        const allProjects = getList<Project>(projectsPayload);

        const interiorServices = allServices.filter((service) => {
          const identity = `${service.slug} ${service.title}`.toLowerCase();
          return (
            identity.includes("interior") ||
            identity.includes("fit-out") ||
            identity.includes("fitout")
          );
        });

        const interiorServiceIds = new Set(interiorServices.map((service) => service.id));

        setServices(interiorServices);
        setProjects(
          allProjects.filter(
            (project) => project.service != null && interiorServiceIds.has(project.service),
          ),
        );
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Something went wrong while loading this page.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInteriorContent();
    return () => controller.abort();
  }, []);

  const serviceIntro = useMemo(
    () =>
      services.length === 1
        ? services[0].description || services[0].short_tagline
        : "From contemporary workplaces to refined retail and hospitality environments, we shape interiors around the people who use them and the brands they represent.",
    [services],
  );

  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#263321]">

      <section className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-[#263321] lg:min-h-[740px]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2200"
          alt="Elegant contemporary interior with warm natural materials"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#182317]/90 via-[#182317]/55 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#182317]/55 to-transparent" />
        <div className="mx-auto w-full max-w-[1500px] px-6 pb-24 pt-36 text-[#f8f5ec] lg:px-12 lg:pb-32">
          <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d0d9a1]">
            BASEPLATE GROUP · INTERIOR DESIGN & BUILD
          </p>
          <h1 className="max-w-4xl font-serif text-6xl font-light leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Interiors with
            <br />
            <span className="italic text-[#d0d9a1]">purpose & presence.</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
            We create thoughtful commercial spaces that bring your brand to life,
            support the way people work and make every experience feel considered.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#interior-services"
              className="rounded-full bg-[#f6f3eb] px-8 py-4 text-sm font-semibold text-[#29391c] transition hover:bg-[#d0d9a1]"
            >
              Explore interior solutions ↗
            </a>
            <a
              href="/contact"
              className="rounded-full border border-white/60 px-8 py-4 text-sm font-semibold text-white transition hover:border-[#d0d9a1] hover:bg-white/10"
            >
              Discuss your project
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden w-[330px] border-l border-t border-white/30 bg-[#263321]/55 p-7 text-white backdrop-blur-md lg:block">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#d0d9a1]">Our philosophy</p>
          <p className="mt-4 font-serif text-2xl leading-snug">Beautifully considered. Built to perform.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#87945c]">Interior design & build</p>
          <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">
            Space to make
            <br />
            <span className="italic text-[#87945c]">your mark.</span>
          </h2>
        </div>
        <div className="max-w-2xl lg:pt-8">
          <p className="text-lg leading-9 text-[#626b55]">
            {serviceIntro}
          </p>
          <p className="mt-5 text-sm leading-8 text-[#777b69]">
            We bring design thinking, material choices and practical execution
            together to create spaces that feel distinctive, work beautifully
            and reflect your identity.
          </p>
        </div>
      </section>

      <section id="interior-services" className="bg-[#e9e8dc] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#87945c]">What we do</p>
              <h2 className="mt-5 font-serif text-5xl sm:text-6xl">Interior solutions.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#69705c]">
              A considered approach to every detail, from the first idea to the finished space.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#d6d5c8] bg-[#f6f3eb] p-10 text-sm text-[#69705c]">
              Loading interior solutions…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#d6d5c8] bg-[#f6f3eb] p-8 text-sm text-[#69705c]">
              {error}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-[#d6d5c8] bg-[#f6f3eb] p-8 text-sm leading-7 text-[#69705c]">
              No active interior service divisions are currently available. Add or activate an Interior service in the existing admin panel to show it here.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {services.map((service, index) => (
                <article key={service.id} className="group relative min-h-[360px] overflow-hidden rounded-2xl bg-[#29391c]">
                  <img
                    src={service.cover_image_url || interiorImages[index % interiorImages.length]}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172414]/95 via-[#172414]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d0d9a1]">
                      {service.short_tagline || "INTERIOR DESIGN & BUILD"}
                    </p>
                    <h3 className="mt-4 font-serif text-3xl sm:text-4xl">{service.title}</h3>
                    {service.description && (
                      <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">{service.description}</p>
                    )}
                    <a
                      href={`/interior?service=${encodeURIComponent(service.slug)}`}
                      className="mt-6 inline-flex items-center gap-3 border-b border-[#d0d9a1] pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e2e8c1]"
                    >
                      Explore solution <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#87945c]">Selected work</p>
            <h2 className="mt-5 font-serif text-5xl sm:text-6xl">Interior projects.</h2>
          </div>
          <a href="/projects" className="text-sm font-semibold text-[#647344] hover:text-[#29391c]">
            View all projects ↗
          </a>
        </div>

        {loading ? (
          <p className="text-sm text-[#69705c]">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-[#e0ddcf] p-8 text-sm leading-7 text-[#69705c]">
            Interior projects will appear here when published projects are assigned to an active Interior service division.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <a
                href={`/projects/${project.slug}`}
                key={project.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-[300px] overflow-hidden bg-[#e9e8dc]">
                  <img
                    src={project.hero_image_url || interiorImages[0]}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87945c]">
                    {project.service_title || "Interior"}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl">{project.title}</h3>
                  {project.location && <p className="mt-2 text-xs text-[#777b69]">{project.location}</p>}
                  <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-[#647344]">
                    View project ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden bg-[#29391c] px-6 py-24 text-center text-[#f6f3eb] lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d0d9a1]">Let's create something meaningful</p>
          <h2 className="mt-7 font-serif text-5xl leading-tight sm:text-6xl">
            Your next space
            <br />
            <span className="italic text-[#d0d9a1]">starts here.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70">
            Tell us what you have in mind. We would love to help shape the next chapter of your space.
          </p>
          <a
            href="/contact"
            className="mt-9 inline-flex rounded-full bg-[#f6f3eb] px-9 py-4 text-sm font-bold text-[#29391c] transition hover:bg-[#d0d9a1]"
          >
            Talk to our team ↗
          </a>
        </div>
      </section>

    </main>
  );
}