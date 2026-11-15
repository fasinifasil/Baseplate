
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/admin/pages/";

type PageItem = {
  id: number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  status: "draft" | "published";
};

const emptyForm = {
  title: "",
  slug: "",
  meta_title: "",
  meta_description: "",
  status: "draft" as "draft" | "published",
};

export default function PagesManagement() {
  const router = useRouter();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const getToken = () =>
    typeof window !== "undefined"
      ? sessionStorage.getItem("baseplate_access")
      : null;

  const loadPages = useCallback(async () => {
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
        throw new Error("Could not load website pages.");
      }

      const data = await response.json();

      setPages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load pages."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  function openNewPage() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditPage(page: PageItem) {
    setEditingId(page.id);

    setForm({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      status: page.status,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId
        ? `${API_URL}${editingId}/`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        sessionStorage.removeItem("baseplate_access");
        sessionStorage.removeItem("baseplate_refresh");
        router.replace("/admin/login");
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ");

        throw new Error(message || "Unable to save page.");
      }

      setSuccess(
        editingId
          ? "Page updated successfully."
          : "Page created successfully."
      );

      setShowForm(false);
      setEditingId(null);

      await loadPages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save page."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(page: PageItem) {
    if (!window.confirm(`Delete "${page.title}" permanently?`)) {
      return;
    }

    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${page.id}/`, {
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
        throw new Error("Unable to delete page.");
      }

      setSuccess("Page deleted successfully.");
      await loadPages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
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

  {/* Pages - Active */}
  <a href="/admin/pages" className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#78845c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M14 3v6h5 M8 13h8 M8 17h8" />
    </svg>
    Pages
    <span className="ml-auto h-2 w-2 rounded-full bg-[#dce5c6]"></span>
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

      {/* Main Content */}
      <section className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">

        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#92977e]">
              BASEPLATE UAE / CONTENT
            </p>

            <h1 className="mt-3 font-serif text-4xl">
              Pages Management
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Create and manage your website pages.
            </p>
          </div>

          <button
            onClick={openNewPage}
            className="rounded-lg bg-[#35452c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#526442]"
          >
            + Add New Page
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
            <p className="text-sm text-stone-500">Total Pages</p>
            <p className="mt-3 font-serif text-4xl">{pages.length}</p>
          </div>

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Published Pages</p>
            <p className="mt-3 font-serif text-4xl">
              {pages.filter((page) => page.status === "published").length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
            <p className="text-sm text-stone-500">Draft Pages</p>
            <p className="mt-3 font-serif text-4xl">
              {pages.filter((page) => page.status === "draft").length}
            </p>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-[#e5e3d9] bg-white p-6 md:p-8">

            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#89936c]">
                  WEBSITE CONTENT
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  {editingId ? "Edit Page" : "Create New Page"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                type="button"
                className="text-sm text-stone-500"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Page Title *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="About Us"
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
                  placeholder="about-us"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  SEO Meta Title
                </label>

                <input
                  value={form.meta_title}
                  onChange={(e) =>
                    setForm({ ...form, meta_title: e.target.value })
                  }
                  placeholder="About Baseplate UAE"
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  SEO Meta Description
                </label>

                <textarea
                  rows={4}
                  value={form.meta_description}
                  onChange={(e) =>
                    setForm({ ...form, meta_description: e.target.value })
                  }
                  placeholder="Describe this page for search engines..."
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Page Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none focus:border-[#78834e]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#35452c] px-7 py-3 text-sm font-semibold text-white hover:bg-[#526442] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Page"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-stone-300 px-7 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pages List */}
        <div className="rounded-xl border border-[#e5e3d9] bg-white p-6">
          <h2 className="font-serif text-2xl">All Website Pages</h2>

          <p className="mb-6 mt-1 text-xs text-stone-500">
            Your website pages stored in Django.
          </p>

          {loading ? (
            <p className="py-8 text-sm text-stone-400">
              Loading pages...
            </p>
          ) : pages.length === 0 ? (
            <p className="py-8 text-sm text-stone-400">
              No pages found. Add your first page.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pages.map((page) => (
                <article
                  key={page.id}
                  className="rounded-xl border border-[#e9e7dd] bg-[#faf9f5] p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] ${
                        page.status === "published"
                          ? "bg-[#e6ecdc] text-[#526442]"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {page.status === "published" ? "Published" : "Draft"}
                    </span>

                    <span className="text-xs text-stone-400">
                      ID: {page.id}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl">
                    {page.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#89936c]">
                    /{page.slug}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm text-stone-500">
                    {page.meta_description || "No SEO description added."}
                  </p>

                  <div className="mt-5 flex gap-4 border-t border-stone-200 pt-4">
                    <button
                      onClick={() => openEditPage(page)}
                      className="text-sm font-semibold text-[#65734c] hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePage(page)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
