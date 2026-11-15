
import Link from "next/link";
import { notFound } from "next/navigation";
export const instant = false;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://baseplate-0ahp.onrender.com/api";

type GalleryImage =
  | string
  | {
      image_url?: string;
      image?: string;
      url?: string;
    };

type Project = {
  title: string;
  slug: string;
  service_title?: string | null;
  client_name?: string | null;
  event_or_venue?: string | null;
  location?: string | null;
  stand_area?: string | number | null;
  completion_year?: string | number | null;
  hero_image_url?: string | null;
  gallery_images?: GalleryImage[];
  summary?: string | null;
  challenge?: string | null;
  solution?: string | null;
};

function getImageUrl(image?: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `http://127.0.0.1:8000${image.startsWith("/") ? "" : "/"}${image}`;
}

function getGalleryImageUrl(image: GalleryImage): string | null {
  if (typeof image === "string") {
    return getImageUrl(image);
  }

  return getImageUrl(image.image_url || image.image || image.url);
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(
      `${API_BASE}/projects/${encodeURIComponent(slug)}/`,
      { cache: "no-store" }
    );

    if (response.status === 404) return null;

    if (!response.ok) {
      console.error("Project API error:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Unable to load project:", error);
    return null;
  }
}

export default async function ExhibitionProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const heroImage = getImageUrl(project.hero_image_url);

  const gallery = (project.gallery_images || [])
    .map(getGalleryImageUrl)
    .filter((image): image is string => Boolean(image));

  return (
    <main className="min-h-screen bg-[#f7f6f0] text-[#303b2b]">
      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-6 pt-8 md:px-12">
        <Link
          href="/exhibition"
          className="text-sm text-[#78845c] transition hover:text-[#303d2c]"
        >
          ← Back to Exhibition Projects
        </Link>
      </div>

      {/* PROJECT HERO */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:px-12 md:pt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#89936c]">
          {project.service_title || "EXHIBITION PROJECT"}
        </p>

        <h1 className="mt-5 max-w-5xl font-serif text-4xl leading-tight md:text-6xl">
          {project.title}
        </h1>

        {project.summary && (
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-600">
            {project.summary}
          </p>
        )}

        <div className="mt-9 grid gap-5 border-y border-[#deded2] py-7 sm:grid-cols-2 lg:grid-cols-4">
          {project.client_name && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Client
              </p>
              <p className="mt-2 text-sm font-medium">
                {project.client_name}
              </p>
            </div>
          )}

          {project.event_or_venue && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Event / Venue
              </p>
              <p className="mt-2 text-sm font-medium">
                {project.event_or_venue}
              </p>
            </div>
          )}

          {project.location && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Location
              </p>
              <p className="mt-2 text-sm font-medium">
                {project.location}
              </p>
            </div>
          )}

          {project.completion_year && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Year
              </p>
              <p className="mt-2 text-sm font-medium">
                {project.completion_year}
              </p>
            </div>
          )}

          {project.stand_area && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Stand Area
              </p>
              <p className="mt-2 text-sm font-medium">
                {project.stand_area}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MAIN IMAGE */}
      <section className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#e8e7dc]">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-500">
              Project image unavailable
            </div>
          )}
        </div>
      </section>

      {/* PROJECT STORY */}
      {(project.challenge || project.solution) && (
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:px-12">
          {project.challenge && (
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#89936c]">
                THE CHALLENGE
              </p>
              <h2 className="mt-4 font-serif text-3xl">
                Understanding the brief.
              </h2>
              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-stone-600">
                {project.challenge}
              </p>
            </div>
          )}

          {project.solution && (
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#89936c]">
                OUR SOLUTION
              </p>
              <h2 className="mt-4 font-serif text-3xl">
                Bringing the vision to life.
              </h2>
              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-stone-600">
                {project.solution}
              </p>
            </div>
          )}
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#89936c]">
              PROJECT PHOTOGRAPHY
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              More from this project
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e7dc]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${project.title} gallery image ${index + 1}`}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="bg-[#303d2c] px-6 py-20 text-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-[#c5cba7]">
          HAVE A SIMILAR PROJECT?
        </p>

        <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
          Let&apos;s build an experience worth remembering.
        </h2>

        <Link
          href="/contact"
          className="mt-9 inline-flex rounded-full bg-[#c5cba7] px-8 py-4 text-sm font-semibold text-[#303d2c] transition hover:bg-white"
        >
          Start a Conversation →
        </Link>
      </section>
    </main>
  );
}
