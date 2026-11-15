

"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://baseplate-0ahp.onrender.com/api"
).replace(/\/$/, "");
/* =========================================
   HERO CAROUSEL
========================================= */

const heroSlides = [
  {
    eyebrow: "EXHIBITION | INTERIOR | EVENT SPACES",
    title: "Designing",
    second: "Experiences",
    highlight: "Beyond Spaces.",
    description:
      "A creative design and build partner for exhibition stands, interior spaces and brand environments.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200",
  },
  {
    eyebrow: "EXHIBITION | CUSTOM STANDS",
    title: "Creating",
    second: "Extraordinary",
    highlight: "Exhibition Spaces.",
    description:
      "Innovative exhibition concepts that bring brands and people together.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2200",
  },
  {
    eyebrow: "INTERIOR | COMMERCIAL | RETAIL",
    title: "Inspired",
    second: "Interior",
    highlight: "Experiences.",
    description:
      "Thoughtfully designed interiors combining creativity, functionality and elegance.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2200",
  },
  {
    eyebrow: "EVENTS | BRAND EXPERIENCES",
    title: "Bringing",
    second: "Ideas to",
    highlight: "Life.",
    description:
      "Creative event spaces and brand environments that create memorable experiences.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2200",
  },
];

type ServiceItem = {
  id: number;
  title: string;
  slug: string;
  short_tagline: string;
  description: string;
  cover_image_url: string | null;
  order: number;
  is_active?: boolean;
};

type ProjectItem = {
  id: number;
  title: string;
  slug: string;
  service_title: string | null;
  hero_image_url: string | null;
  is_featured: boolean;
  summary?: string;
};

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  // These lists are populated only from the Django public API.
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  /* =========================================
     LOAD SERVICES FROM DJANGO
  ========================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services/`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Services request failed (${response.status})`);
        }

        const payload: unknown = await response.json();
        const rows = Array.isArray(payload)
          ? payload
          : payload &&
              typeof payload === "object" &&
              "results" in payload &&
              Array.isArray((payload as { results: unknown }).results)
            ? (payload as { results: unknown[] }).results
            : [];

        const data = rows as ServiceItem[];
        setServices(
          data
            .filter((service) => service && service.is_active !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Services API error:", error);
          setServices([]);
        }
      } finally {
        if (!controller.signal.aborted) setServicesLoading(false);
      }
    };

    fetchServices();
    return () => controller.abort();
  }, []);

  /* =========================================
     LOAD PROJECTS FROM DJANGO
  ========================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Projects request failed (${response.status})`);
        }

        const payload: unknown = await response.json();
        const rows = Array.isArray(payload)
          ? payload
          : payload &&
              typeof payload === "object" &&
              "results" in payload &&
              Array.isArray((payload as { results: unknown }).results)
            ? (payload as { results: unknown[] }).results
            : [];

        const data = rows as ProjectItem[];
        setProjects(data.filter((project) => project?.is_featured));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Projects API error:", error);
          setProjects([]);
        }
      } finally {
        if (!controller.signal.aborted) setProjectsLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  /* =========================================
     AUTOMATIC CAROUSEL
  ========================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  /* =========================================
     SCROLL REVEAL
  ========================================= */

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  /* =========================================
     SUBTLE CURSOR + HERO PARALLAX
  ========================================= */

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }

      const hero = heroRef.current;
      const image = heroImageRef.current;

      if (!hero || !image) return;

      const rect = hero.getBoundingClientRect();

      const insideHero =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (insideHero) {
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        image.style.transform =
          `scale(1.08) translate(${x * 12}px, ${y * 12}px)`;
      } else {
        image.style.transform = "scale(1.04) translate(0, 0)";
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("a, button")) {
        cursorRef.current?.classList.add("cursor-active");
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const related = event.relatedTarget as HTMLElement | null;

      if (
        target.closest("a, button") &&
        !related?.closest("a, button")
      ) {
        cursorRef.current?.classList.remove("cursor-active");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  /* =========================================
     MAGNETIC BUTTONS
  ========================================= */

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const buttons = document.querySelectorAll<HTMLElement>(
      "[data-magnetic]"
    );

    const handleMove = (event: PointerEvent) => {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform =
        `translate(${x * 0.1}px, ${y * 0.1}px)`;
    };

    const handleLeave = (event: PointerEvent) => {
      const button = event.currentTarget as HTMLElement;
      button.style.transform = "";
    };

    buttons.forEach((button) => {
      button.addEventListener("pointermove", handleMove);
      button.addEventListener("pointerleave", handleLeave);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("pointermove", handleMove);
        button.removeEventListener("pointerleave", handleLeave);
      });
    };
  }, []);

  /* =========================================
     FLOATING SCROLL DEPTH EFFECT
  ========================================= */

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-float]")
    );
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
          const movement = Math.max(-28, Math.min(28, distanceFromCenter * -0.035));
          item.style.setProperty("--float-shift", `${movement}px`);
        });
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* =========================================
     FLOATING PROJECT REVEAL + SCROLL PARALLAX
  ========================================= */

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-float]"));
    if (!cards.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("project-card-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    cards.forEach((card) => revealObserver.observe(card));

    let frame = 0;
    const updateFloat = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight * 0.52;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const progress = (cardCenter - viewportCenter) / window.innerHeight;
          const shift = Math.max(-34, Math.min(34, progress * -42));
          const tilt = Math.max(-1.2, Math.min(1.2, progress * -1.5));
          card.style.setProperty("--float-y", `${shift}px`);
          card.style.setProperty("--float-tilt", `${tilt}deg`);
        });
      });
    };

    updateFloat();
    window.addEventListener("scroll", updateFloat, { passive: true });
    window.addEventListener("resize", updateFloat);

    return () => {
      cancelAnimationFrame(frame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateFloat);
      window.removeEventListener("resize", updateFloat);
    };
  }, [projects]);

  /* =========================================
     HELPERS
  ========================================= */

  const getServiceHref = (service: ServiceItem) => {
    const value = `${service.slug} ${service.title}`.toLowerCase();
    const basePath = value.includes("exhibition")
      ? "/exhibition"
      : value.includes("interior") || value.includes("exterior")
        ? "/interior"
        : "/services";

    return `${basePath}?service=${encodeURIComponent(service.slug)}`;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1e5] text-[#28351d]">

      {/* SUBTLE CURSOR - NO TEXT */}

      <div ref={cursorRef} className="custom-cursor hidden md:block" />

      {/* =====================================
          HERO — IMMERSIVE EXHIBITION EXPERIENCE
      ===================================== */}

      <section
        ref={heroRef}
        className="hero-section relative flex min-h-[720px] items-center overflow-hidden bg-[#1d2b17] lg:min-h-[820px]"
      >
        <div className="absolute inset-0">
          <img
            ref={heroImageRef}
            key={heroSlides[activeSlide].image}
            src={heroSlides[activeSlide].image}
            alt={heroSlides[activeSlide].highlight}
            className="hero-image h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172414]/95 via-[#172414]/75 to-[#172414]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172414]/75 via-transparent to-[#172414]/20" />
        </div>

        <div className="pointer-events-none absolute -right-24 top-20 h-[520px] w-[520px] rounded-full border border-white/15 lg:right-[-90px] lg:top-[-90px]" />
        <div className="pointer-events-none absolute -right-10 top-36 h-[360px] w-[360px] rounded-full border border-[#d1d89a]/25" />

        <div
          key={activeSlide}
          className="hero-content relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 pb-28 pt-32 lg:grid-cols-[1.2fr_0.8fr] lg:px-16 lg:pb-36 lg:pt-40"
        >
          <div className="max-w-4xl text-[#f7f2e7]">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#c6cf83]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d4dc9b] sm:text-xs">
                {heroSlides[activeSlide].eyebrow}
              </p>
            </div>

            <h1 className="max-w-4xl text-[clamp(3.5rem,7vw,7.6rem)] font-light leading-[0.94] tracking-[-0.055em]">
              {heroSlides[activeSlide].title}
              <br />
              {heroSlides[activeSlide].second}
              <br />
              <span className="font-serif italic text-[#c6cf83]">
                {heroSlides[activeSlide].highlight}
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {heroSlides[activeSlide].description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-7">
              <a
               href="/our-projects"
                data-magnetic
                className="group inline-flex items-center rounded-full bg-[#f6f1e5] px-8 py-4 text-sm font-bold text-[#29391c] shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#c6cf83]"
              >
                Explore Our Work
                <span className="ml-4 inline-block transition-transform duration-300 group-hover:translate-x-2">
                  ↗
                </span>
              </a>

              <a
                href="/contact"
                className="group inline-flex items-center gap-3 text-sm font-medium text-white/90 transition hover:text-[#c6cf83]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition duration-300 group-hover:border-[#c6cf83] group-hover:bg-[#c6cf83] group-hover:text-[#29391c]">
                  ↗
                </span>
                Start a project
              </a>
            </div>
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="relative w-[300px] rounded-2xl border border-white/25 bg-white/10 p-7 text-[#f7f2e7] shadow-2xl backdrop-blur-md xl:w-[350px]">
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#d4dc9b]">
                BASEPLATE GROUP
              </p>
              <div className="my-7 h-px bg-white/25" />
              <p className="font-serif text-3xl leading-tight">
                From vision
                <br />
                <span className="italic text-[#c6cf83]">to reality.</span>
              </p>
              <p className="mt-4 text-xs leading-6 text-white/70">
                Creative thinking. Thoughtful design. Seamless execution.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/20 pt-5">
                {["DESIGN", "BUILD", "DELIVER"].map((item) => (
                  <span key={item} className="text-[8px] font-bold tracking-[0.2em] text-white/75">
                    {item}
                  </span>
                ))}
              </div>
              <span className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c6cf83] text-xl text-[#29391c] shadow-lg">
                ↗
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-[#172414]/35 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-6 py-5 lg:px-16">
            <div className="hidden items-center gap-8 sm:flex">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/65">Exhibition</span>
              <span className="h-1 w-1 rounded-full bg-[#c6cf83]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/65">Interior</span>
              <span className="h-1 w-1 rounded-full bg-[#c6cf83]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/65">Events</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="mr-2 text-[10px] tabular-nums text-white/70">
                0{activeSlide + 1} <span className="text-white/35">/ 0{heroSlides.length}</span>
              </span>
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeSlide === index ? "w-10 bg-[#c6cf83]" : "w-4 bg-white/45 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          HORIZONTAL SERVICES STRIP — BACKEND DATA
      ===================================== */}

      <section className="services-strip border-y border-[#ded8c7] bg-[#f6f1e5]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service, index) => {
            const serviceIcons: Record<string, string> = {
              "exhibition-stands": "/images/services/exhibition-stands.png",
              "interior-solutions": "/images/services/interior-solutions.png",
              "event-spaces": "/images/services/event-spaces.png",
              "design-build": "/images/services/design-build.png",
            };
            const icon = serviceIcons[service.slug] || serviceIcons["exhibition-stands"];
            const href = getServiceHref(service);

            return (
              <a
                key={service.id}
                href={href}
                className={`service-strip-item group flex min-h-[104px] items-center gap-5 px-5 py-5 transition-colors duration-300 hover:bg-[#eeeddf] sm:px-8 lg:min-h-[104px] lg:px-10 ${
                  index % 2 === 0 ? "border-r border-[#d8d1bf]" : ""
                } ${index < 2 ? "border-b border-[#d8d1bf]" : ""} lg:border-b-0 ${
                  index !== 3 ? "lg:border-r lg:border-[#d8d1bf]" : ""
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="service-strip-icon h-10 w-10 object-contain opacity-80 transition duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:h-11 sm:w-11"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-5 text-[#29391c] sm:text-base">
                    {service.title}
                  </span>
                  <span className="mt-1 block line-clamp-1 text-[11px] leading-5 text-[#777765] sm:text-xs">
                    {service.short_tagline}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* =====================================
          MODERN SERVICES & EXHIBITION SHOWCASE
      ===================================== */}

      <section className="bg-[#f6f1e5] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
                What We Create
              </p>
              <h2 className="font-serif text-5xl leading-tight sm:text-7xl">
                Spaces that
                <br />
                <span className="italic text-[#788449]">make an impact.</span>
              </h2>
            </div>

            <div className="md:justify-self-end md:max-w-md">
              <p className="text-base leading-8 text-[#6e705e]">
                From bespoke exhibition stands to inspiring interiors, we
                create distinctive environments that bring brands and ideas
                to life.
              </p>
              <a
                href="/services"
                className="mt-6 inline-flex items-center gap-3 border-b border-[#788449] pb-2 text-sm font-bold text-[#29391c] transition-all duration-300 hover:gap-5"
              >
                Explore all services <span>↗</span>
              </a>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const fallbackImages: Record<string, string> = {
                "exhibition-stands":
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
                "interior-solutions":
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
                "event-spaces":
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
                "design-build":
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
              };

              const image =
                service.cover_image_url ||
                fallbackImages[service.slug] ||
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200";

              return (
                <a
  href={getServiceHref(service)}
  key={service.id}
                  className="group relative block overflow-hidden rounded-[1.35rem] bg-[#29391c] shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative h-[420px] overflow-hidden">
                    <img
                      src={image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172310] via-[#172310]/25 to-transparent" />

                    <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-black/20 px-4 py-2 text-[10px] tracking-[0.2em] text-white backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4dc9b]">
                        {service.short_tagline}
                      </p>

                      <h3 className="font-serif text-2xl leading-tight sm:text-3xl">
                        {service.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/75">
                        {service.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-white/30 pt-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                          Discover more
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 transition duration-300 group-hover:border-[#c6cf83] group-hover:bg-[#c6cf83] group-hover:text-[#29391c]">
                          ↗
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          {!servicesLoading && services.length === 0 && (
            <p className="mt-8 text-sm text-[#777765]">
              Services are currently unavailable. Please try again later.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          FLOATING PROJECT SHOWCASE
      ===================================== */}

      <section className="project-showcase relative overflow-hidden bg-[#f8f8f5] py-24 lg:py-32">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#dce5c8]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[#e8d9bd]/40 blur-3xl" />

        <div className="relative mx-auto max-w-[1700px]">
          <div className="project-heading mb-16 flex flex-col justify-between gap-8 px-6 lg:flex-row lg:items-end lg:px-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-[#87945c]">
                SELECTED WORK · BASEPLATE GROUP
              </p>
              <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.04em] text-[#202820] sm:text-7xl lg:text-8xl">
                Projects with
                <br />
                <span className="italic text-[#87945c]">presence.</span>
              </h2>
            </div>
            <a href="/our-projects" className="project-view-all group inline-flex w-fit items-center gap-5 border-b border-[#29391c] pb-3 text-[10px] font-bold uppercase tracking-[0.2em]">
              View all projects <span className="text-lg transition-transform group-hover:translate-x-2">→</span>
            </a>
          </div>

          <div className="project-floating-grid">
            {projects.map((project, index) => (
              <a
                href={`/our-projects/${project.slug}`}
                key={project.id}
                className={`project-float-card project-float-card-${index % 3}`}
                data-project-float
              >
                <div className="project-float-media">
                  <img
                    src={project.hero_image_url || "/images/project-placeholder.jpg"}
                    alt={project.title}
                    loading="lazy"
                  />
                  <span className="project-float-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="project-float-popup">
                    <span className="project-popup-kicker">BASEPLATE · SELECTED PROJECT</span>
                    <h3>{project.title}</h3>
                    <p>{project.summary || project.service_title || "Design · Build · Deliver"}</p>
                    <span className="project-popup-link">EXPLORE PROJECT <b>↗</b></span>
                  </div>
                  <span className="project-float-plus">↗</span>
                </div>
                <div className="project-float-caption">
                  <div>
                    <p>{project.service_title || "BASEPLATE PROJECT"}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <span className="project-caption-arrow">↗</span>
                </div>
              </a>
            ))}
          </div>

          {!projectsLoading && projects.length === 0 && (
            <p className="px-6 text-sm text-[#777765]">Featured projects will appear here once they are published and marked as featured.</p>
          )}
        </div>
      </section>

      {/* =====================================
          ABOUT
      ===================================== */}

      <section className="scroll-reveal overflow-hidden bg-[#e9e7d8] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
              About Baseplate
            </p>

            <h2 className="font-serif text-4xl leading-[1.15] sm:text-6xl">
              Ideas transformed
              <br />
              into <span className="italic text-[#788449]">experiences.</span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#666b57]">
              We bring creative ideas to life through thoughtful design,
              carefully planned spaces and quality execution. From exhibition
              stands to interior environments, we aim to create spaces that
              leave a lasting impression.
            </p>

            <a
              href="/about"
              data-magnetic
              className="group mt-9 inline-flex rounded-full bg-[#29391c] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#71813c]"
            >
              Discover More
              <span className="ml-3 transition-transform group-hover:translate-x-2">
                ↗
              </span>
            </a>
          </div>

          <div className="about-image-wrap image-depth-wrap group relative h-[380px] overflow-hidden rounded-2xl sm:h-[500px]" data-scroll-float>
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400"
              alt="Contemporary interior design"
              className="about-image h-full w-full object-cover" data-scroll-float
            />
            <div className="absolute inset-0 bg-[#29391c]/10 transition duration-500 group-hover:bg-transparent" />
          </div>
        </div>
      </section>

      {/* =====================================
          CREATIVE STATEMENT
      ===================================== */}

      <section className="scroll-reveal bg-[#f6f1e5] px-6 py-24 text-center lg:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
            Our Approach
          </p>

          <h2 className="mt-8 font-serif text-4xl leading-tight sm:text-6xl">
            Every space tells a story.
            <br />
            <span className="italic text-[#788449]">
              Let's create yours.
            </span>
          </h2>

          <div className="mx-auto mt-9 h-px w-20 bg-[#9aa56d]" />
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="scroll-reveal relative overflow-hidden bg-[#29391c] px-6 py-24 text-center text-[#f6f1e5] lg:py-32">
        <div className="cta-circle cta-circle-one" />
        <div className="cta-circle cta-circle-two" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c6cf83]">
            Have a project in mind?
          </p>

          <h2 className="mt-8 font-serif text-4xl leading-tight sm:text-6xl">
            Let's create something
            <br />
            <span className="italic text-[#c6cf83]">exceptional.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/65">
            Tell us about your next project and let's explore the possibilities
            together.
          </p>

          <a
            href="/contact"
            data-magnetic
            className="mt-10 inline-flex rounded-full bg-[#f6f1e5] px-10 py-4 text-sm font-bold text-[#29391c] transition-colors duration-300 hover:bg-[#c6cf83] hover:shadow-2xl"
          >
            Get a Quote ↗
          </a>
        </div>
      </section>

      {/* =====================================
          GLOBAL ANIMATIONS
      ===================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
        }

        /* SCROLL REVEAL */

        .scroll-reveal {
          opacity: 0;
          transform: translateY(25px);
          transition:
            opacity 0.8s ease,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* HERO ANIMATION */

        .hero-image {
          animation: heroZoom 8s ease both;
          transition: transform 0.25s ease-out;
          will-change: transform;
        }

        .hero-content {
          animation: heroTextReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes heroZoom {
          from {
            transform: scale(1.13);
          }

          to {
            transform: scale(1.04);
          }
        }

        @keyframes heroTextReveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* NAVIGATION */

        .nav-link {
          transition: color 0.25s ease;
        }

        .nav-link:hover {
          color: #788449;
        }

        .dropdown-menu {
          visibility: hidden;
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            visibility 0.25s ease;
        }

        .dropdown-menu.dropdown-open {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-link {
          transition:
            background-color 0.25s ease,
            padding-left 0.25s ease,
            color 0.25s ease;
        }

        .dropdown-link:hover {
          background: #eeeddf;
          padding-left: 24px;
          color: #788449;
        }

        /* MOBILE MENU */

        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition:
            max-height 0.5s ease,
            opacity 0.35s ease;
        }

        .mobile-menu-open {
          max-height: 750px;
          opacity: 1;
          border-top: 1px solid #ded8c7;
        }

        /* FLOATING SCROLL DEPTH */

        [data-scroll-float] {
          --float-shift: 0px;
          transform: translate3d(0, var(--float-shift), 0);
          transition: transform 0.35s ease-out;
          will-change: transform;
        }

        .image-depth-wrap {
          transform-style: preserve-3d;
        }

        .image-depth-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          border: 1px solid rgba(246, 241, 229, 0.35);
          border-radius: inherit;
          pointer-events: none;
          transition: inset 0.6s ease;
        }

        .image-depth-wrap:hover::after {
          inset: 12px;
        }

        /* 3D FLIP CARDS */

        .flip-card {
          perspective: 1200px;
          min-height: 100%;
          transform-style: preserve-3d;
        }

        .flip-card-inner {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          min-height: 150px;
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.2, 0.75, 0.2, 1);
        }

        .flip-card:hover .flip-card-inner,
        .flip-card:focus-visible .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-face {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-front {
          position: relative;
          min-height: 100%;
        }

        .flip-card-back {
          position: absolute;
          inset: 0;
          transform: rotateY(180deg);
        }

        .project-flip-inner {
          min-height: 430px;
        }

        .project-flip-inner .flip-card-face {
          min-height: 430px;
        }

        /* FLOATING DECORATIVE MOTION */

        .cta-circle-one {
          animation: floatSlow 9s ease-in-out infinite;
        }

        .cta-circle-two {
          animation: floatSlow 11s ease-in-out infinite reverse;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -18px, 0); }
        }

        /* HORIZONTAL SERVICES STRIP */

        .services-strip {
          position: relative;
          z-index: 5;
        }

        .service-strip-item {
          min-width: 0;
        }

        @media (max-width: 640px) {
          .service-strip-item {
            gap: 10px;
            padding-left: 12px;
            padding-right: 12px;
          }

          .service-strip-item img {
            width: 32px;
            height: 32px;
          }
        }

        /* SERVICE ICONS */

        .service-card {
          transition:
            background-color 0.35s ease,
            transform 0.35s ease;
        }

        .service-card:hover {
          background-color: #eeeddf;
          transform: translateY(-4px);
        }

        .service-icon {
          transition:
            transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            filter 0.4s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.13) rotate(-6deg);
          filter: saturate(1.2);
        }

        /* PROJECT IMAGES */

        .project-card {
          transition:
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.5s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 45px rgba(41, 57, 28, 0.12);
        }

        .project-image {
          transition:
            transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1),
            filter 0.5s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.1);
          filter: saturate(1.12);
        }

        .project-overlay {
          background: rgba(29, 43, 19, 0);
          transition: background 0.5s ease;
        }

        .project-card:hover .project-overlay {
          background: rgba(29, 43, 19, 0.12);
        }

        .project-arrow {
          transition: transform 0.3s ease;
        }

        .project-card:hover .project-arrow {
          transform: translate(4px, -4px);
        }

        /* FLOATING PROJECT CARDS — SCROLL POP + HOVER REVEAL */
        .project-showcase { isolation: isolate; }
        .project-floating-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: start;
          gap: clamp(18px, 3vw, 48px);
          padding: 0 clamp(20px, 4vw, 64px) 30px;
        }
        .project-float-card {
          display: block;
          min-width: 0;
          color: #202820;
          text-decoration: none;
          opacity: 0;
          transform: translate3d(0, 85px, 0) scale(.91) rotate(var(--float-tilt, 0deg));
          filter: blur(5px);
          transition: opacity .8s ease, transform 1s cubic-bezier(.16,1,.3,1), filter .8s ease;
          will-change: transform, opacity;
        }
        .project-float-card-1 { margin-top: 82px; }
        .project-float-card-2 { margin-top: 32px; }
        .project-float-card.project-card-in {
          opacity: 1;
          filter: blur(0);
          transform: translate3d(0, var(--float-y, 0px), 0) scale(1) rotate(var(--float-tilt, 0deg));
        }
        .project-float-card-1.project-card-in { transition-delay: .12s; }
        .project-float-card-2.project-card-in { transition-delay: .23s; }
        .project-float-media {
          position: relative;
          height: clamp(280px, 31vw, 470px);
          overflow: hidden;
          border-radius: 8px;
          background: #dfe3d6;
          box-shadow: 0 18px 55px rgba(37,49,30,.10);
          isolation: isolate;
        }
        .project-float-media > img {
          width: 100%; height: 100%; object-fit: cover;
          filter: grayscale(78%) saturate(.55) brightness(.88);
          transform: scale(1.04);
          transition: filter .8s ease, transform 1.2s cubic-bezier(.2,.8,.2,1);
        }
        .project-float-card:hover .project-float-media > img,
        .project-float-card:focus-visible .project-float-media > img {
          filter: grayscale(0%) saturate(1.12) brightness(.78);
          transform: scale(1.13);
        }
        .project-float-number {
          position: absolute; z-index: 3; top: 18px; left: 18px;
          display: grid; place-items: center; width: 42px; height: 42px;
          border: 1px solid rgba(255,255,255,.65); border-radius: 50%;
          color: white; background: rgba(28,40,25,.22); backdrop-filter: blur(10px);
          font-size: 10px; letter-spacing: .12em;
        }
        .project-float-plus {
          position: absolute; z-index: 3; right: 18px; top: 18px;
          display: grid; place-items: center; width: 42px; height: 42px;
          border-radius: 50%; color: #29391c; background: #d9e3b8;
          font-size: 20px; transition: transform .45s ease, background .45s ease;
        }
        .project-float-card:hover .project-float-plus { transform: rotate(45deg) scale(1.12); background: #fff; }
        .project-float-popup {
          position: absolute; z-index: 2; inset: 0;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: clamp(22px, 3vw, 38px); color: #fff;
          background: linear-gradient(180deg, rgba(30,45,26,0) 8%, rgba(31,49,29,.18) 38%, rgba(31,49,29,.96) 100%);
          opacity: 0; transform: translateY(24px) scale(.98);
          transition: opacity .55s ease, transform .65s cubic-bezier(.2,.8,.2,1);
        }
        .project-float-card:hover .project-float-popup,
        .project-float-card:focus-visible .project-float-popup { opacity: 1; transform: translateY(0) scale(1); }
        .project-popup-kicker { color: #d5e3a5; font-size: 9px; font-weight: 800; letter-spacing: .25em; }
        .project-float-popup h3 { max-width: 95%; margin-top: 16px; font-family: Georgia,serif; font-size: clamp(25px,2.6vw,38px); line-height: 1.08; }
        .project-float-popup p { margin-top: 12px; max-width: 34ch; color: rgba(255,255,255,.76); font-size: 12px; line-height: 1.8; }
        .project-popup-link { display: flex; align-items: center; justify-content: space-between; margin-top: 25px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,.42); font-size: 9px; font-weight: 800; letter-spacing: .2em; }
        .project-popup-link b { font-size: 19px; font-weight: 400; }
        .project-float-caption { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 22px 2px 0; }
        .project-float-caption p { color: #87945c; font-size: 9px; font-weight: 800; letter-spacing: .2em; }
        .project-float-caption h3 { margin-top: 8px; font-family: Georgia,serif; font-size: clamp(18px,1.8vw,25px); line-height: 1.25; }
        .project-caption-arrow { display: grid; flex: 0 0 40px; width: 40px; height: 40px; place-items: center; border: 1px solid #cbd3bd; border-radius: 50%; transition: color .35s ease, background .35s ease, transform .35s ease; }
        .project-float-card:hover .project-caption-arrow { color: #fff; background: #687c4e; transform: rotate(45deg); }
        .project-view-all { transition: color .3s ease; }
        .project-view-all:hover { color: #87945c; }
        @media (max-width: 900px) {
          .project-floating-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .project-float-card-1, .project-float-card-2 { margin-top: 0; }
          .project-float-card:nth-child(even) { margin-top: 55px; }
        }
        @media (max-width: 600px) {
          .project-floating-grid { grid-template-columns: 1fr; gap: 42px; padding: 0 20px; }
          .project-float-card:nth-child(even) { margin-top: 0; }
          .project-float-media { height: 390px; }
          .project-float-popup { opacity: 1; transform: none; padding: 24px; background: linear-gradient(180deg, transparent 20%, rgba(31,49,29,.92) 100%); }
          .project-float-plus { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-float-card, .project-float-media > img, .project-float-popup { transition: none !important; }
          .project-float-card { opacity: 1; filter: none; transform: none; }
        }

        /* ABOUT IMAGE */

        .about-image {
          transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .about-image-wrap:hover .about-image {
          transform: scale(1.12) rotate(1deg);
        }

        .about-image-wrap .about-image {
          will-change: transform;
        }

        .project-card:hover .project-image {
          transform: scale(1.13) rotate(1deg);
        }

        /* CTA DECORATION */

        .cta-circle {
          position: absolute;
          border: 1px solid rgba(198, 207, 131, 0.2);
          border-radius: 50%;
          pointer-events: none;
          transition: transform 1s ease;
        }

        .cta-circle-one {
          width: 400px;
          height: 400px;
          right: -130px;
          top: -190px;
        }

        .cta-circle-two {
          width: 500px;
          height: 500px;
          left: -230px;
          bottom: -300px;
        }

        /* FOOTER HOVER */

        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition:
            color 0.3s ease,
            transform 0.3s ease;
        }

        .footer-link:hover {
          color: #788449;
          transform: translateX(5px);
        }

        .footer-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .footer-link:hover .footer-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* MAGNETIC BUTTONS */

        [data-magnetic] {
          transition:
            transform 0.25s ease,
            background-color 0.3s ease,
            box-shadow 0.3s ease;
          will-change: transform;
        }

        /* MINIMAL CURSOR - NO VIEW TEXT */

        .custom-cursor {
          position: fixed;
          z-index: 100;
          left: 0;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #c6cf83;
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition:
            width 0.3s ease,
            height 0.3s ease,
            opacity 0.2s ease;
          will-change: left, top;
        }

        .custom-cursor.cursor-active {
          width: 24px;
          height: 24px;
          opacity: 0.55;
        }

        /* ACCESSIBILITY */

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }

          .scroll-reveal {
            opacity: 1;
            transform: none;
          }

          [data-scroll-float] {
            transform: none !important;
          }

          .flip-card-inner {
            transition: none !important;
          }
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .hero-section {
            min-height: 620px;
          }

          .cta-circle-one {
            width: 250px;
            height: 250px;
          }

          .cta-circle-two {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </main>
  );
}