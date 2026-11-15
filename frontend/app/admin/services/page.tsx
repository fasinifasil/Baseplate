
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Service = {
  id: number;
  title: string;
  slug: string;
  short_tagline: string;
  description: string;
  cover_image_url: string | null;
  order: number;
  is_active: boolean;
};

const API_URL = "https://baseplate-0ahp.onrender.com/api/admin/services/";

const emptyForm = {
  title: "",
  slug: "",
  short_tagline: "",
  description: "",
  order: "0",
  is_active: true,
};

export default function ServicesManagement() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const getToken = () => sessionStorage.getItem("baseplate_access");

  const loadServices = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("baseplate_access");
        sessionStorage.removeItem("baseplate_refresh");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load services.");
      }

      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(service: Service) {
    setEditingId(service.id);
    setForm({
      title: service.title,
      slug: service.slug,
      short_tagline: service.short_tagline || "",
      description: service.description || "",
      order: String(service.order),
      is_active: service.is_active,
    });
    setImageFile(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setImageFile(null);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const body = new FormData();
    body.append("title", form.title);
    body.append("slug", form.slug);
    body.append("short_tagline", form.short_tagline);
    body.append("description", form.description);
    body.append("order", form.order);
    body.append("is_active", String(form.is_active));

    if (imageFile) {
      body.append("cover_image", imageFile);
    }

    try {
      const url = editingId
        ? `${API_URL}${editingId}/`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
        const message =
          typeof data === "object"
            ? Object.entries(data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" | ")
            : "Unable to save service.";

        throw new Error(message || "Unable to save service.");
      }

      setSuccess(
        editingId
          ? "Service updated successfully."
          : "New service added successfully."
      );

      closeForm();
      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save service."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Delete "${service.title}"? This cannot be undone.`)) {
      return;
    }

    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}${service.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("baseplate_access");
        sessionStorage.removeItem("baseplate_refresh");
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not delete this service.");
      }

      setSuccess("Service deleted successfully.");
      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete service."
      );
    }
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
  {/* Overview */}
  <a href="/admin" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
    Overview
  </a>

  {/* Services - Active */}
  <a href="/admin/services" className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#78845c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5 M12 12v9" />
    </svg>
    Services
    <span className="ml-auto h-2 w-2 rounded-full bg-[#dce5c6]"></span>
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
              BASEPLATE UAE / CONTENT
            </p>
            <h1 className="mt-3 font-serif text-4xl">
              Services
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Manage your company services and descriptions.
            </p>
          </div>

          <button
            onClick={openNewForm}
            className="rounded-lg bg-[#35452c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#526442]"
          >
            + Add New Service
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
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Total Services</p>
            <p className="mt-3 font-serif text-4xl">{services.length}</p>
          </div>
          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Active Services</p>
            <p className="mt-3 font-serif text-4xl">
              {services.filter((service) => service.is_active).length}
            </p>
          </div>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-[#e5e3d9] bg-white p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                {editingId ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={closeForm}
                type="button"
                className="text-sm text-stone-500 hover:text-black"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Service Name *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Exhibition Stands"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  URL Slug *
                </label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="exhibition-stands"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Tagline
                </label>
                <input
                  value={form.short_tagline}
                  onChange={(e) =>
                    setForm({ ...form, short_tagline: e.target.value })
                  }
                  placeholder="Stand Out. Make an Impact."
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe this service..."
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Service Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-stone-300 bg-[#faf9f5] p-3 text-sm"
                />
                <p className="mt-2 text-xs text-stone-400">
                  Choose an image from your computer. Leave empty to keep the existing image.
                </p>
                {imageFile && (
                  <p className="mt-2 text-sm text-[#78845c]">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#526442]"
                />
                Show this service on the public website
              </label>

              <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#35452c] px-7 py-3 text-sm font-semibold text-white hover:bg-[#526442] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Service"}
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

        {/* Services list */}
        <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
          <div className="mb-6">
            <h2 className="font-serif text-2xl">All Services</h2>
            <p className="mt-1 text-xs text-stone-500">
              Services currently stored in Django.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-sm text-stone-400">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="py-8 text-sm text-stone-400">
              No services found. Click Add New Service to get started.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="overflow-hidden rounded-xl border border-[#e9e7dd] bg-[#faf9f5]"
                >
                  {service.cover_image_url ? (
                    <img
                      src={service.cover_image_url}
                      alt={service.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-[#e7e8d9] text-sm text-[#89936c]">
                      No service image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wider text-[#89936c]">
                        {service.slug}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] ${
                          service.is_active
                            ? "bg-[#e6ecdc] text-[#526442]"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm text-stone-500">
                      {service.short_tagline || service.description || "No description yet."}
                    </p>

                    <div className="mt-5 flex gap-3 border-t border-stone-200 pt-4">
                      <button
                        onClick={() => openEditForm(service)}
                        className="text-sm font-semibold text-[#65734c] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
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
