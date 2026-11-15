
const articles = [
  {
    category: "EXHIBITION",
    title: "Creating Exhibition Stands That Make Brands Stand Out",
    description:
      "Explore how thoughtful design, creative concepts and carefully planned spaces help brands make a lasting impression.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
    date: "DESIGN & INNOVATION",
  },
  {
    category: "INTERIOR DESIGN",
    title: "The Importance of Thoughtful Commercial Interiors",
    description:
      "Discover how materials, lighting and spatial planning can transform the way people experience a space.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
    date: "INTERIOR SPACES",
  },
  {
    category: "EVENTS",
    title: "Designing Memorable Brand Experiences",
    description:
      "Learn how creative event environments bring brands and audiences together through meaningful experiences.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    date: "BRAND EXPERIENCES",
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e5] text-[#29391c]">

      {/* HERO */}
      <section className="relative flex min-h-[580px] items-end overflow-hidden bg-[#1d2b17]">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200"
          alt="Creative design workspace"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172414]/95 via-[#172414]/65 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-24 pt-36 lg:px-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4dc9b]">
            BASEPLATE GROUP · IDEAS & INSPIRATION
          </p>

          <h1 className="mt-8 max-w-4xl font-serif text-6xl font-light leading-[1.02] text-[#f7f2e7] sm:text-7xl lg:text-8xl">
            Ideas that shape
            <br />
            <span className="italic text-[#c6cf83]">better spaces.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/75">
            Discover ideas, creative perspectives and inspiration from the
            world of exhibition design, interiors and brand experiences.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 py-24 lg:grid-cols-2 lg:px-12 lg:py-28">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
            OUR JOURNAL
          </p>
          <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">
            Thoughts,
            <br />
            <span className="italic text-[#788449]">ideas & inspiration.</span>
          </h2>
        </div>

        <p className="max-w-xl self-end text-base leading-8 text-[#6e705e]">
          At Baseplate Group, we believe great spaces begin with great ideas.
          Explore our perspectives on creative design, exhibition environments,
          interior solutions and the experiences that bring brands to life.
        </p>
      </section>

      {/* ARTICLES */}
      <section className="bg-[#eeeddf] px-6 py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#788449]">
                EXPLORE OUR JOURNAL
              </p>
              <h2 className="mt-5 font-serif text-5xl sm:text-6xl">
                Latest insights.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#6e705e]">
              Inspiration and ideas from the spaces we imagine and create.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={article.title}
                className="group overflow-hidden rounded-2xl bg-[#f9f7f0]"
              >
                <div className="relative h-[280px] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-[#f6f1e5] px-4 py-2 text-[9px] font-bold tracking-[0.15em]">
                    {article.category}
                  </span>
                </div>

                <div className="p-7">
                  <p className="text-[9px] font-bold tracking-[0.2em] text-[#899267]">
                    {article.date}
                  </p>

                  <h3 className="mt-5 font-serif text-2xl leading-snug">
                    {article.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#6e705e]">
                    {article.description}
                  </p>

                  <div className="mt-7 border-t border-[#dedbce] pt-5">
                    <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#647344]">
                      Article coming soon
                      <span>↗</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#29391c] px-6 py-24 text-center text-[#f6f1e5] lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c6cf83]">
            HAVE A PROJECT IN MIND?
          </p>

          <h2 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl">
            Let's create something
            <br />
            <span className="italic text-[#c6cf83]">remarkable.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/70">
            Have an idea you would like to bring to life? Let's start a
            conversation.
          </p>

          <a
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-[#f6f1e5] px-10 py-4 text-sm font-bold text-[#29391c] transition hover:-translate-y-1 hover:bg-[#c6cf83]"
          >
            Start a Project ↗
          </a>
        </div>
      </section>

    </main>
  );
}
