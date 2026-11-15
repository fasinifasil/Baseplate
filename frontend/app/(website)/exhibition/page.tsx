
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Project = {
  id?: number;
  title: string;
  slug: string;
  service_title?: string | null;
  client_name?: string | null;
  event_or_venue?: string | null;
  location?: string | null;
  stand_area?: string | number | null;
  completion_year?: number | string | null;
  hero_image_url?: string | null;
  summary?: string | null;
  is_featured?: boolean;
};

type ApiResponse = Project[] | { results?: Project[] };

function getImageUrl(image?: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `http://127.0.0.1:8000${image.startsWith("/") ? "" : "/"}${image}`;
}

async function getExhibitionProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE}/projects/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Unable to load exhibition projects:", response.status);
      return [];
    }

    const data: ApiResponse = await response.json();
    const projects = Array.isArray(data) ? data : data.results || [];

    return projects.filter((project) => {
      const service = project.service_title?.toLowerCase() || "";

      return (
        service.includes("exhibition") ||
        service.includes("stand") ||
        service.includes("event")
      );
    });
  } catch (error) {
    console.error("Exhibition API error:", error);
    return [];
  }
}

export default async function ExhibitionPage() {
  const projects = await getExhibitionProjects();

  return (
    <main className="min-h-screen bg-[#f7f6f0] text-[#303b2b]">
      {/* HERO */}
      <section className="relative flex min-h-[470px] items-center overflow-hidden bg-[#303d2c] px-6 py-24 text-white md:min-h-[550px] md:px-16">
        <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-10 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#c5cba7]">
            BASEPLATE UAE · OUR WORK
          </p>

          <h1 className="max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            Exhibition Projects
            <span className="block text-[#c5cba7]">
              Made to Stand Out.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            Explore our exhibition stands and event spaces, designed to
            create memorable brand experiences.
          </p>

          <a
            href="#projects"
            className="mt-9 inline-flex rounded-full bg-[#c5cba7] px-7 py-4 text-sm font-semibold text-[#303d2c] transition hover:bg-white"
          >
            Explore Projects <span className="ml-3">↓</span>
          </a>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#89936c]">
              OUR PORTFOLIO
            </p>

            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-5xl">
              Spaces that bring brands to life.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-8 text-stone-600 md:justify-self-end md:text-base">
            From concept to completion, discover exhibition projects
            created to connect brands with people through thoughtful
            design and execution.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#deded2] pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#89936c]">
              SELECTED WORK
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Our Exhibition Portfolio
            </h2>
          </div>

          <p className="text-sm text-stone-500">
            {projects.length} {projects.length === 1 ? "Project" : "Projects"}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-[#e5e3d9] bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-2xl">
              Exhibition projects coming soon
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-500">
              Published exhibition projects from the admin panel will appear
              here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const imageUrl = getImageUrl(project.hero_image_url);

              return (
                <Link
                  key={project.id ?? project.slug}
                  href={`/exhibition/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e7dc]">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-500">
                        Project image unavailable
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-[#f7f6f0]/95 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#303d2c]">
                      Exhibition
                    </span>

                    <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#c5cba7] text-xl text-[#303d2c] transition group-hover:bg-white">
                      ↗
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#89936c]">
                        {project.client_name || "Baseplate UAE"}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl transition group-hover:text-[#78845c]">
                        {project.title}
                      </h3>

                      {project.event_or_venue && (
                        <p className="mt-2 text-sm text-stone-500">
                          {project.event_or_venue}
                        </p>
                      )}

                      {project.location && (
                        <p className="mt-1 text-xs text-stone-400">
                          {project.location}
                        </p>
                      )}
                    </div>

                    <span className="pt-1 text-xs text-stone-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#e9eadf] px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#78845c]">
          HAVE A PROJECT IN MIND?
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
          Let&apos;s create something remarkable.
        </h2>

        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-[#303d2c] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#78845c]"
        >
          Discuss Your Project →
        </Link>
      </section>
    </main>
  );
}
