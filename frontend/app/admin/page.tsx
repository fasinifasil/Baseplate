
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROJECT_API = "https://baseplate-0ahp.onrender.com/api/admin/projects/";
const SERVICE_API = "https://baseplate-0ahp.onrender.com/api/services/";
type DashboardStats = {
  projects: number;
  services: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    services: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const token = sessionStorage.getItem("baseplate_access");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const [projectResponse, serviceResponse] = await Promise.all([
          fetch(PROJECT_API, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(SERVICE_API),
        ]);

        if (projectResponse.status === 401) {
          sessionStorage.removeItem("baseplate_access");
          sessionStorage.removeItem("baseplate_refresh");
          router.replace("/admin/login");
          return;
        }

        if (projectResponse.ok && serviceResponse.ok) {
          const projectData = await projectResponse.json();
          const serviceData = await serviceResponse.json();

          const projects = Array.isArray(projectData)
            ? projectData
            : projectData.results || [];

          const services = Array.isArray(serviceData)
            ? serviceData
            : serviceData.results || [];

          setStats({
            projects: projects.length,
            services: services.length,
          });
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("baseplate_access");
    sessionStorage.removeItem("baseplate_refresh");
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f5f4ee] text-[#303b2b] md:flex">

      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-[#303d2c] px-6 py-7 text-white md:min-h-screen md:w-[245px] md:shrink-0">

        <div className="mb-10 border-b border-white/15 pb-7">
          <Image
            src="/images/design.jpeg"
            alt="Baseplate UAE"
            width={180}
            height={90}
            priority
            className="max-h-[70px] w-[155px] object-contain"
          />

          <p className="mt-3 text-[10px] tracking-[0.3em] text-[#c3c9a5]">
            WEBSITE CONTROL PANEL
          </p>
        </div>

        <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/45">
          Workspace
        </p>


<nav className="flex flex-wrap gap-2 md:flex-col">
  {/* Overview - Active */}
  <a
    href="/admin"
    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#78845c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10"
  >
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
    Overview
    <span className="ml-auto h-2 w-2 rounded-full bg-[#dce5c6]"></span>
  </a>

  {/* Services */}
  <a href="/admin/services" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5 M12 12v9" />
    </svg>
    Services
  </a>

  {/* Projects */}
  <a href="/admin/projects" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16 M8 9h13" />
    </svg>
    Projects
  </a>

  {/* Pages */}
  <a href="/admin/pages" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M14 3v6h5 M8 13h8 M8 17h8" />
    </svg>
    Pages
  </a>

  {/* Page Sections */}
  <a href="/admin/sections" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18 M9 9v12 M15 9v12" />
    </svg>
    Page Sections
  </a>
</nav>


        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg px-4 py-3 text-left text-sm text-white/70 hover:bg-white/10 md:mt-auto"
        >
          ↗ &nbsp; Sign out
        </button>

      </aside>

      {/* Dashboard Content */}
      <section className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">

        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#92977e]">
            BASEPLATE UAE / ADMINISTRATION
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Manage your website content, services and project portfolio.
          </p>
        </header>

        {/* Statistics */}
        <div className="mb-9 grid gap-5 sm:grid-cols-2">

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-7">
            <p className="text-sm text-stone-500">
              Total Projects
            </p>

            <p className="mt-3 font-serif text-5xl">
              {loading ? "..." : stats.projects}
            </p>

            <Link
              href="/admin/projects"
              className="mt-5 inline-block text-sm font-semibold text-[#65734c] hover:underline"
            >
              Manage Projects →
            </Link>
          </div>

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-7">
            <p className="text-sm text-stone-500">
              Total Services
            </p>

            <p className="mt-3 font-serif text-5xl">
              {loading ? "..." : stats.services}
            </p>

            <Link
              href="/admin/services"
              className="mt-5 inline-block text-sm font-semibold text-[#65734c] hover:underline"
            >
              Manage Services →
            </Link>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[#e5e3d9] bg-white p-7">

          <p className="text-xs uppercase tracking-[0.2em] text-[#89936c]">
            CONTENT MANAGEMENT
          </p>

          <h2 className="mt-2 font-serif text-2xl">
            Quick Actions
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Choose what you want to manage.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <Link
              href="/admin/projects"
              className="rounded-xl border border-[#e5e3d9] bg-[#faf9f5] p-6 transition hover:border-[#78845c] hover:bg-[#f1f1e8]"
            >
              <span className="text-2xl">▧</span>
              <h3 className="mt-3 font-serif text-xl">
                Projects
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Add, edit and manage your project portfolio.
              </p>
            </Link>

            <Link
              href="/admin/services"
              className="rounded-xl border border-[#e5e3d9] bg-[#faf9f5] p-6 transition hover:border-[#78845c] hover:bg-[#f1f1e8]"
            >
              <span className="text-2xl">◇</span>
              <h3 className="mt-3 font-serif text-xl">
                Services
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Manage service categories and images.
              </p>
            </Link>

            <Link
              href="/admin/pages"
              className="rounded-xl border border-[#e5e3d9] bg-[#faf9f5] p-6 transition hover:border-[#78845c] hover:bg-[#f1f1e8]"
            >
              <span className="text-2xl">▤</span>
              <h3 className="mt-3 font-serif text-xl">
                Website Pages
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Manage website pages and their content.
              </p>
            </Link>

          </div>
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">
          BASEPLATE UAE · WEBSITE CONTROL PANEL
        </p>

      </section>
    </main>
  );
}
