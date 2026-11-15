
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const PROJECT_API = "https://baseplate-0ahp.onrender.com/api/admin/projects/";
const SERVICE_API = "https://baseplate-0ahp.onrender.com/api/services/";
type Service = {
  id: number;
  title: string;
};

type GalleryImage = {
  id: number;
  image_url: string;
  caption: string;
  order: number;
  is_wide: boolean;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  service: number | null;
  service_title: string | null;
  client_name: string;
  event_or_venue: string;
  location: string;
  stand_area: string;
  completion_year: number | null;
  hero_image_url: string | null;
  summary: string;
  challenge: string;
  solution: string;
  is_featured: boolean;
  is_published: boolean;
  gallery_images: GalleryImage[];
};

const emptyForm = {
  title: "",
  slug: "",
  service: "",
  client_name: "",
  event_or_venue: "",
  location: "",
  stand_area: "",
  completion_year: "",
  summary: "",
  challenge: "",
  solution: "",
  is_featured: false,
  is_published: false,
};

export default function ProjectsManagement() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryCaption, setGalleryCaption] = useState("");

  const token = () =>
    typeof window !== "undefined"
      ? sessionStorage.getItem("baseplate_access")
      : null;

  const loadData = useCallback(async () => {
    const accessToken = token();

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [projectResponse, serviceResponse] = await Promise.all([
        fetch(PROJECT_API, { headers }),
        fetch(SERVICE_API),
      ]);

      if (
        projectResponse.status === 401
      ) {
        sessionStorage.removeItem("baseplate_access");
        sessionStorage.removeItem("baseplate_refresh");
        router.replace("/admin/login");
        return;
      }

      if (!projectResponse.ok) {
        throw new Error("Could not load projects.");
      }

      if (!serviceResponse.ok) {
        throw new Error("Could not load service categories.");
      }

      const projectData = await projectResponse.json();
      const serviceData = await serviceResponse.json();

      setProjects(
        Array.isArray(projectData)
          ? projectData
          : projectData.results || []
      );

      setServices(
        Array.isArray(serviceData)
          ? serviceData
          : serviceData.results || []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load data."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openNewProject() {
    setEditingId(null);
    setForm(emptyForm);
    setHeroFile(null);
    setGalleryFiles([]);
    setGalleryCaption("");
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditProject(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      slug: project.slug,
      service: project.service ? String(project.service) : "",
      client_name: project.client_name || "",
      event_or_venue: project.event_or_venue || "",
      location: project.location || "",
      stand_area: project.stand_area || "",
      completion_year: project.completion_year
        ? String(project.completion_year)
        : "",
      summary: project.summary || "",
      challenge: project.challenge || "",
      solution: project.solution || "",
      is_featured: project.is_featured,
      is_published: project.is_published,
    });

    setHeroFile(null);
    setGalleryFiles([]);
    setGalleryCaption("");
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setHeroFile(null);
    setGalleryFiles([]);
  }

  async function uploadGalleryImages(projectId: number) {
    const accessToken = token();

    for (let i = 0; i < galleryFiles.length; i++) {
      const body = new FormData();

      body.append("image", galleryFiles[i]);
      body.append("caption", galleryCaption);
      body.append("order", String(i));

      const response = await fetch(
        `${PROJECT_API}${projectId}/gallery/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Gallery upload failed for ${galleryFiles[i].name}.`
        );
      }
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const accessToken = token();

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const body = new FormData();

    body.append("title", form.title);
    body.append("slug", form.slug);
    body.append("client_name", form.client_name);
    body.append("event_or_venue", form.event_or_venue);
    body.append("location", form.location);
    body.append("stand_area", form.stand_area);
    body.append("summary", form.summary);
    body.append("challenge", form.challenge);
    body.append("solution", form.solution);
    body.append("is_featured", String(form.is_featured));
    body.append("is_published", String(form.is_published));

    if (form.service) {
      body.append("service", form.service);
    }

    if (form.completion_year) {
      body.append("completion_year", form.completion_year);
    }

    if (heroFile) {
      body.append("hero_image", heroFile);
    }

    try {
      const url = editingId
        ? `${PROJECT_API}${editingId}/`
        : PROJECT_API;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        sessionStorage.removeItem("baseplate_access");
        sessionStorage.removeItem("baseplate_refresh");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        const message = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ");

        throw new Error(message || "Unable to save project.");
      }

      const projectId = editingId || data.id;

      if (galleryFiles.length > 0) {
        await uploadGalleryImages(projectId);
      }

      setSuccess(
        editingId
          ? "Project updated successfully."
          : "Project created successfully."
      );

      closeForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete "${project.title}" permanently?`)) {
      return;
    }

    const accessToken = token();

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${PROJECT_API}${project.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to delete project.");
      }

      setSuccess("Project deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
      );
    }
  }

  async function deleteGalleryImage(
    projectId: number,
    imageId: number
  ) {
    if (!window.confirm("Delete this gallery image?")) return;

    const response = await fetch(
      `${PROJECT_API}${projectId}/gallery/${imageId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      }
    );

    if (!response.ok) {
      setError("Could not delete gallery image.");
      return;
    }

    setSuccess("Gallery image deleted.");
    await loadData();
  }

  function updateField(
    field: keyof typeof emptyForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
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
  <a href="/admin" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
    Overview
  </a>

  <a href="/admin/services" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5 M12 12v9" />
    </svg>
    Services
  </a>

  <a href="/admin/projects" className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#78845c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16 M8 9h13" />
    </svg>
    Projects
    <span className="ml-auto h-2 w-2 rounded-full bg-[#dce5c6]"></span>
  </a>

  <a href="/admin/pages" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M14 3v6h5 M8 13h8 M8 17h8" />
    </svg>
    Pages
  </a>

  <a href="/admin/sections" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18 M9 9v12 M15 9v12" />
    </svg>
    Page Sections
  </a>
</nav>


        <button
          onClick={() => {
            sessionStorage.removeItem("baseplate_access");
            sessionStorage.removeItem("baseplate_refresh");
            router.replace("/admin/login");
          }}
          className="mt-8 rounded-lg px-4 py-3 text-left text-sm text-white/70 hover:bg-white/10 md:mt-auto"
        >
          ↗ &nbsp; Sign out
        </button>
      </aside>

      {/* Main content */}
      <section className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">

        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#92977e]">
              BASEPLATE UAE / PORTFOLIO
            </p>
            <h1 className="mt-3 font-serif text-4xl">
              Projects
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Manage your portfolio and project photography.
            </p>
          </div>

          <button
            onClick={openNewProject}
            className="rounded-lg bg-[#35452c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#526442]"
          >
            + Add New Project
          </button>
        </header>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {success}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Total Projects</p>
            <p className="mt-3 font-serif text-4xl">{projects.length}</p>
          </div>

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Published</p>
            <p className="mt-3 font-serif text-4xl">
              {projects.filter((p) => p.is_published).length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Featured</p>
            <p className="mt-3 font-serif text-4xl">
              {projects.filter((p) => p.is_featured).length}
            </p>
          </div>
        </div>

        {/* Project form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-[#e5e3d9] bg-white p-6 md:p-8">

            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#89936c]">
                  PROJECT DETAILS
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  {editingId ? "Edit Project" : "Create New Project"}
                </h2>
              </div>

              <button onClick={closeForm} className="text-sm text-stone-500">
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">Project Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Premium Exhibition Stand – Dubai"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">URL Slug *</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="premium-exhibition-stand-dubai"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Service Category</label>
                <select
                  value={form.service}
                  onChange={(e) => updateField("service", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Client Name</label>
                <input
                  value={form.client_name}
                  onChange={(e) => updateField("client_name", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Venue / Event</label>
                <input
                  value={form.event_or_venue}
                  onChange={(e) => updateField("event_or_venue", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Dubai, UAE"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Stand Area</label>
                <input
                  value={form.stand_area}
                  onChange={(e) => updateField("stand_area", e.target.value)}
                  placeholder="120 sqm"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Completion Year</label>
                <input
                  type="number"
                  value={form.completion_year}
                  onChange={(e) => updateField("completion_year", e.target.value)}
                  placeholder="2026"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Main Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-stone-300 bg-[#faf9f5] p-3 text-sm"
                />
                <p className="mt-2 text-xs text-stone-400">
                  Select a cover image. Leave empty to keep the current image.
                </p>
                {heroFile && (
                  <p className="mt-2 text-sm text-[#78845c]">
                    Selected: {heroFile.name}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Project Summary</label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Challenge</label>
                <textarea
                  rows={3}
                  value={form.challenge}
                  onChange={(e) => updateField("challenge", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Solution</label>
                <textarea
                  rows={3}
                  value={form.solution}
                  onChange={(e) => updateField("solution", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              {/* Gallery upload */}
              <div className="rounded-xl bg-[#f5f4ee] p-5 md:col-span-2">
                <h3 className="font-serif text-xl">Project Gallery</h3>
                <p className="mb-4 mt-1 text-xs text-stone-500">
                  Add multiple photographs to this project.
                </p>

                <label className="mb-2 block text-sm font-medium">
                  Gallery Images
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setGalleryFiles(Array.from(e.target.files || []))
                  }
                  className="block w-full rounded-lg border border-stone-300 bg-white p-3 text-sm"
                />

                {galleryFiles.length > 0 && (
                  <p className="mt-3 text-sm text-[#78845c]">
                    {galleryFiles.length} image(s) selected.
                  </p>
                )}

                <input
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                  placeholder="Caption for selected gallery images (optional)"
                  className="mt-4 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#78834e]"
                />
              </div>

              {/* Existing gallery */}
              {editingId && (
                <div className="md:col-span-2">
                  <h3 className="mb-4 font-serif text-xl">Existing Gallery</h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {(projects.find((p) => p.id === editingId)?.gallery_images || []).map((image) => (
                      <div key={image.id} className="overflow-hidden rounded-lg border border-stone-200">
                        <img
                          src={image.image_url}
                          alt={image.caption || "Project gallery"}
                          className="h-36 w-full object-cover"
                        />
                        <div className="flex items-center justify-between gap-2 p-3">
                          <span className="truncate text-xs text-stone-500">
                            {image.caption || "Gallery image"}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteGalleryImage(editingId, image.id)}
                            className="shrink-0 text-xs font-semibold text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-6 md:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => updateField("is_featured", e.target.checked)}
                    className="h-4 w-4 accent-[#526442]"
                  />
                  Featured Project
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => updateField("is_published", e.target.checked)}
                    className="h-4 w-4 accent-[#526442]"
                  />
                  Publish on Website
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#35452c] px-7 py-3 text-sm font-semibold text-white hover:bg-[#526442] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Project"
                    : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-stone-300 px-7 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Project list */}
        <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
          <h2 className="font-serif text-2xl">All Projects</h2>
          <p className="mb-6 mt-1 text-xs text-stone-500">
            Your portfolio projects stored in Django.
          </p>

          {loading ? (
            <p className="py-8 text-sm text-stone-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="py-8 text-sm text-stone-400">
              No projects found. Add your first project.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-xl border border-[#e9e7dd] bg-[#faf9f5]"
                >
                  {project.hero_image_url ? (
                    <img
                      src={project.hero_image_url}
                      alt={project.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-[#e7e8d9] text-sm text-[#89936c]">
                      No project image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#e6ecdc] px-3 py-1 text-[10px] text-[#526442]">
                        {project.is_published ? "Published" : "Draft"}
                      </span>

                      {project.is_featured && (
                        <span className="rounded-full bg-[#eee9d9] px-3 py-1 text-[10px] text-[#81734a]">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs uppercase tracking-wider text-[#89936c]">
                      {project.service_title || "Uncategorised"}
                    </p>

                    <h3 className="mt-2 font-serif text-xl">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-stone-500">
                      {project.location || project.event_or_venue || "Project"}
                    </p>

                    <div className="mt-5 flex gap-4 border-t border-stone-200 pt-4">
                      <button
                        onClick={() => openEditProject(project)}
                        className="text-sm font-semibold text-[#65734c] hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProject(project)}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
