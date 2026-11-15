
"use client";

import { useEffect, useState } from "react";

type ServiceItem = {
  id: number;
  title: string;
  slug: string;
  short_tagline: string;
  description: string;
  cover_image_url: string | null;
  order: number;
};

type ProjectItem = {
  id: number;
  title: string;
  slug: string;
  service_title: string;
  hero_image_url: string | null;
  is_featured: boolean;
};

const API = "http://127.0.0.1:8000/api";

const fallbackCapabilities = [
  {
    title: "Exhibition Stands",
    description: "Creative exhibition environments designed to showcase brands and connect with audiences.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
  },
  {
    title: "Interior Solutions",
    description: "Thoughtfully designed interiors that balance functionality, identity and atmosphere.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
  },
  {
    title: "Event Spaces",
    description: "Distinctive spaces for events, activations and memorable brand experiences.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
  },
  {
    title: "Design & Build",
    description: "A considered journey from creative concept through fabrication and execution.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
  },
];

export default function AboutPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [serviceResponse, projectResponse] = await Promise.all([
          fetch(`${API}/services/`),
          fetch(`${API}/projects/`),
        ]);

        if (serviceResponse.ok) {
          const data = await serviceResponse.json();
          if (active) setServices(Array.isArray(data) ? data : data.results || []);
        }

        if (projectResponse.ok) {
          const data = await projectResponse.json();
          const list = Array.isArray(data) ? data : data.results || [];
          if (active) setProjects(list.filter((item: ProjectItem) => item.is_featured).slice(0, 3));
        }
      } catch (error) {
        console.error("About page content could not be loaded:", error);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const capabilities = services.length
    ? services.slice(0, 4).map((service) => ({
        title: service.title,
        description: service.description || service.short_tagline,
        image: service.cover_image_url || fallbackCapabilities.find(
          (item) => item.title.toLowerCase() === service.title.toLowerCase()
        )?.image || fallbackCapabilities[0].image,
      }))
    : fallbackCapabilities;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1e5] text-[#29391c]">

      {/* ABOUT HERO */}
      <section className="relative flex min-h-[620px] items-end overflow-hidden bg-[#1d2b17] lg:min-h-[740px]">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200"
          alt="Creative workspace and design environment"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172414]/95 via-[#172414]/65 to-[#172414]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172414]/75 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-20 pt-36 lg:px-16 lg:pb-28">
          <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4dc9b]">
            About Baseplate Group
          </p>
          <h1 className="max-w-5xl font-serif text-6xl font-light leading-[0.98] tracking-tight text-[#f7f2e7] sm:text-7xl lg:text-[104px]">
            We shape spaces.
            <br />
            <span className="italic text-[#c6cf83]">We build experiences.</span>
          </h1>
          <div className="mt-9 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-8 text-white/75 sm:text-lg">
              A creative design and build partner for exhibition stands, interior spaces and brand environments.
            </p>
            <a href="#our-story" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f7f2e7]">
              Discover our story
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-lg">↓</span>
            </a>
          </div>
        </div>
        <div className="absolute right-8 top-28 hidden h-64 w-64 rounded-full border border-white/20 lg:block" />
        <div className="absolute right-20 top-40 hidden h-40 w-40 rounded-full border border-[#c6cf83]/30 lg:block" />
      </section>

      {/* INTRO / STORY */}
      <section id="our-story" className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
              Who We Are
            </p>
            <h2 className="mt-7 font-serif text-5xl leading-[1.06] sm:text-6xl">
              Thoughtful design.
              <br />
              <span className="italic text-[#788449]">Purposeful spaces.</span>
            </h2>
          </div>
          <div className="pt-1">
            <p className="font-serif text-2xl leading-relaxed text-[#39452e] sm:text-3xl">
              BASEPLATE GROUP is a creative design and build partner specialising in exhibition stands, interior solutions and brand environments.
            </p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#6e705e]">
              We bring ideas to life through thoughtful design, precision fabrication and seamless execution. Every space is an opportunity to communicate a brand, welcome people and create a lasting impression.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#6e705e]">
              From the first conversation to the final details on site, our focus is on creating environments that are considered, functional and memorable.
            </p>
            <a href="/contact" className="mt-9 inline-flex items-center gap-4 border-b border-[#788449] pb-3 text-sm font-bold transition hover:gap-6">
              Work with us <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* FULL BLEED IMAGE BREAK */}
      <section className="relative h-[420px] overflow-hidden sm:h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000"
          alt="Contemporary architectural interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1d2b17]/25" />
        <div className="absolute bottom-8 left-6 right-6 mx-auto max-w-[1400px] sm:bottom-12 lg:left-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white">
            Our point of view
          </p>
          <p className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl">
            Good spaces do more than look impressive. They make people feel something.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="bg-[#eeeddf] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
                What We Do
              </p>
              <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-7xl">
                Our <span className="italic text-[#788449]">Capabilities.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#6e705e]">
              Connected creative and delivery capabilities, shaped around the spaces and experiences brands need.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <a
                href="/services"
                key={`${item.title}-${index}`}
                className="group relative min-h-[390px] overflow-hidden rounded-2xl bg-[#29391c]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172414]/95 via-[#172414]/25 to-transparent" />
                <span className="absolute left-5 top-5 text-xs font-bold tracking-[0.25em] text-white/80">
                  0{index + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#f7f2e7]">
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4dc9b]">
                    Explore <span className="transition group-hover:translate-x-2">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
            How We Work
          </p>
          <div className="mt-6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
              From first idea
              <br />
              to <span className="italic text-[#788449]">final detail.</span>
            </h2>
            <div className="grid gap-0 sm:grid-cols-2">
              {[
                ["01", "Understand", "We start by listening, learning about your goals and understanding the people who will use the space."],
                ["02", "Create", "Ideas take shape through creative thinking, considered planning and design development."],
                ["03", "Deliver", "Design moves into production, coordination and on-site execution with care for the details."],
                ["04", "Complete", "We focus on the final experience, ensuring the finished environment reflects the original intent."],
              ].map(([number, title, description]) => (
                <div key={number} className="border-t border-[#d8d3c2] py-7 sm:px-6">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#8b9565]">
                    {number}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6e705e]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK FROM DJANGO */}
      {projects.length > 0 && (
        <section className="bg-[#e9e7d8] px-6 py-24 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
                  A Selection of Our Work
                </p>
                <h2 className="mt-5 font-serif text-5xl sm:text-6xl">
                  Made <span className="italic text-[#788449]">real.</span>
                </h2>
              </div>
              <a href="/projects" className="text-sm font-bold hover:text-[#788449]">
                View all projects ↗
              </a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {projects.map((project, index) => (
                <a
                  href={project.slug ? `/projects/${project.slug}` : "/projects"}
                  key={project.id}
                  className={`group ${index === 1 ? "md:mt-12" : ""}`}
                >
                  <div className="relative h-[300px] overflow-hidden rounded-xl bg-[#d8d5c5] sm:h-[380px]">
                    {project.hero_image_url && (
                      <img
                        src={project.hero_image_url}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f1e5] text-[#29391c]">
                      ↗
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#899267]">
                    {project.service_title}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{project.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden bg-[#29391c] px-6 py-24 text-center text-[#f6f1e5] lg:py-32">
        <div className="pointer-events-none absolute -right-24 -top-48 h-[440px] w-[440px] rounded-full border border-[#c6cf83]/20" />
        <div className="pointer-events-none absolute -bottom-64 -left-32 h-[500px] w-[500px] rounded-full border border-[#c6cf83]/20" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c6cf83]">
            Let's Create Together
          </p>
          <h2 className="mt-8 font-serif text-4xl leading-tight sm:text-6xl">
            Have a space in mind?
            <br />
            <span className="italic text-[#c6cf83]">Let's bring it to life.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/65">
            Tell us about your next project and let's explore the possibilities together.
          </p>
          <a
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-[#f6f1e5] px-10 py-4 text-sm font-bold text-[#29391c] transition hover:-translate-y-1 hover:bg-[#c6cf83]"
          >
            Get a Quote ↗
          </a>
        </div>
      </section>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: no-preference) {
          .about-page-reveal {
            animation: aboutFade 0.9s ease both;
          }
        }

        @keyframes aboutFade {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
