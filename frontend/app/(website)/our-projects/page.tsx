"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
process.env.NEXT_PUBLIC_API_BASE_URL || "https://baseplate-0ahp.onrender.com/api";
type Project = {
  id: number;
  title: string;
  slug: string;
  service?: number | null;
  service_title?: string;
  client_name?: string;
  event_or_venue?: string;
  location?: string;
  stand_area?: string;
  completion_year?: number | null;
  hero_image_url?: string | null;
  summary?: string;
  challenge?: string;
  solution?: string;
  is_featured?: boolean;
  gallery_images?: {
    id: number;
    image_url: string;
    caption?: string;
    is_wide?: boolean;
    order?: number;
  }[];
};

function readList<T>(payload: unknown): T[] {
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

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeService, setActiveService] = useState("All");

  async function loadProjects(signal?: AbortSignal) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/projects/`, {
        signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Projects could not be loaded (HTTP ${response.status}).`);
      }

      const payload: unknown = await response.json();
      const rows = readList<Project>(payload);

      // The public Django endpoint already returns published projects only.
      // Filter featured status only for the featured section, not the full listing.
      setProjects(rows);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Unable to load projects. Please try again.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadProjects(controller.signal);
    return () => controller.abort();
  }, []);

  const serviceFilters = useMemo(() => {
    const names = projects
      .map((project) => project.service_title?.trim())
      .filter((name): name is string => Boolean(name));

    return ["All", ...Array.from(new Set(names)).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesService =
        activeService === "All" || project.service_title === activeService;

      const searchableText = [
        project.title,
        project.service_title,
        project.client_name,
        project.event_or_venue,
        project.location,
        project.summary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesService && (!term || searchableText.includes(term));
    });
  }, [projects, search, activeService]);

  const featuredProject = projects.find((project) => project.is_featured);
  const otherProjects = filteredProjects;

  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#263321]">
      

      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-[#24321f] lg:min-h-[650px]">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200"
          alt="Contemporary designed brand and workspace environment"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#172414]/90 via-[#172414]/60 to-[#172414]/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#172414]/55 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-6 pb-20 pt-32 text-[#f8f5ec] lg:px-12 lg:pb-28">
          <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d0d9a1]">
            BASEPLATE GROUP · OUR PORTFOLIO
          </p>
          <h1 className="max-w-4xl font-serif text-6xl font-light leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Work that makes
            <br />
            <span className="italic text-[#d0d9a1]">an impression.</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
            Explore selected projects across exhibition, interior and brand
            environments. Every project begins with an idea and is shaped
            around the people and brands it serves.
          </p>
          <a
            href="#project-list"
            className="mt-10 inline-flex rounded-full bg-[#f6f3eb] px-8 py-4 text-sm font-semibold text-[#29391c] transition hover:bg-[#d0d9a1]"
          >
            Explore projects ↓
          </a>
        </div>
      </section>

      {featuredProject && (
        <section className="mx-auto max-w-[1500px] px-6 py-16 lg:px-12 lg:py-24">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[#87945c]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#87945c]">
              Featured project
            </p>
          </div>

          <a
            href={`/our-projects/${featuredProject.slug}`}
            className="group grid overflow-hidden rounded-[1.5rem] bg-[#e9e8dc] lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[510px]">
              <img
                src={featuredProject.hero_image_url || fallbackImage}
                alt={featuredProject.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#87945c]">
                {featuredProject.service_title || "Selected work"}
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                {featuredProject.title}
              </h2>
              {featuredProject.summary && (
                <p className="mt-6 text-sm leading-8 text-[#68705a]">
                  {featuredProject.summary}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#68705a]">
                {featuredProject.client_name && <span>Client · {featuredProject.client_name}</span>}
                {featuredProject.location && <span>Location · {featuredProject.location}</span>}
                {featuredProject.completion_year && <span>Year · {featuredProject.completion_year}</span>}
              </div>
              <span className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#53643a]">
                Discover this project <span className="transition group-hover:translate-x-2">↗</span>
              </span>
            </div>
          </a>
        </section>
      )}

      <section id="project-list" className="bg-[#e9e8dc] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#87945c]">
                The portfolio
              </p>
              <h2 className="mt-5 font-serif text-5xl sm:text-6xl">Explore our projects.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#68705a]">
              Browse our published work by service or search for a project,
              client, venue or location.
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {serviceFilters.map((service) => (
                <button
                  type="button"
                  key={service}
                  onClick={() => setActiveService(service)}
                  className={`rounded-full border px-5 py-3 text-xs font-semibold transition ${
                    activeService === service
                      ? "border-[#29391c] bg-[#29391c] text-white"
                      : "border-[#c9cbb9] bg-transparent text-[#536047] hover:border-[#87945c] hover:bg-[#f6f3eb]"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>

            <label className="flex w-full items-center gap-3 rounded-full border border-[#c9cbb9] bg-[#f6f3eb] px-5 py-3 lg:max-w-[320px]">
              <span className="text-[#87945c]">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#969887]"
              />
            </label>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[420px] animate-pulse rounded-2xl bg-[#dcdccd]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#d0cebf] bg-[#f6f3eb] p-8">
              <p className="text-sm text-[#68705a]">{error}</p>
              <button
                type="button"
                onClick={() => loadProjects()}
                className="mt-5 rounded-full bg-[#29391c] px-6 py-3 text-xs font-semibold text-white hover:bg-[#71813c]"
              >
                Try again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-[#d0cebf] bg-[#f6f3eb] p-10 text-center">
              <h3 className="font-serif text-3xl">No projects found.</h3>
              <p className="mt-3 text-sm leading-7 text-[#68705a]">
                Try another search or select a different service.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveService("All");
                }}
                className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#647344]"
              >
                Clear filters ↗
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-xs text-[#7b806d]">
                Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <a
                    href={`/our-projects/${project.slug}`}
                    key={project.id}
                    className="group overflow-hidden rounded-2xl bg-[#f8f6ef] shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-[290px] overflow-hidden bg-[#dcdccd]">
                      <img
                        src={project.hero_image_url || fallbackImage}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-5 top-5 rounded-full bg-[#f6f3eb]/90 px-4 py-2 text-[10px] font-bold tracking-[0.15em] text-[#29391c]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {project.is_featured && (
                        <span className="absolute right-5 top-5 rounded-full bg-[#d0d9a1] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#29391c]">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-7">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#87945c]">
                        {project.service_title || "Baseplate project"}
                      </p>
                      <h3 className="mt-3 font-serif text-2xl leading-snug">{project.title}</h3>
                      {project.summary && (
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#747966]">
                          {project.summary}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e1dfd3] pt-5 text-[11px] text-[#777d69]">
                        {project.client_name && <span>{project.client_name}</span>}
                        {project.location && <span>{project.location}</span>}
                        {project.completion_year && <span>{project.completion_year}</span>}
                      </div>
                      <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-[#53643a]">
                        <span>View project</span>
                        <span className="transition duration-300 group-hover:translate-x-2">↗</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-[#29391c] px-6 py-24 text-center text-[#f6f3eb] lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d0d9a1]">
            Have a project in mind?
          </p>
          <h2 className="mt-7 font-serif text-5xl leading-tight sm:text-6xl">
            Let's build your
            <br />
            <span className="italic text-[#d0d9a1]">next big idea.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70">
            Tell us about your vision and our team will help bring it to life.
          </p>
          <a
            href="/contact"
            className="mt-9 inline-flex rounded-full bg-[#f6f3eb] px-9 py-4 text-sm font-bold text-[#29391c] transition hover:bg-[#d0d9a1]"
          >
            Start a conversation ↗
          </a>
        </div>
      </section>

      <footer className="bg-[#e9e8dc] px-6 py-8 text-center text-xs text-[#69705c]">
© 2026 Baseplate Group. All rights reserved.      </footer>
    </main>
  );
}
