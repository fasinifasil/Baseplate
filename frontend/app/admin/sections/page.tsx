"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = "http://127.0.0.1:8000/api";
type PageItem = {
  id: number;
  title: string;
  slug: string;
};

type SectionItem = {
  id: number;
  page: number;
  section_type: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  image_url: string | null;
  background_color: string;
  text_color: string;
  custom_settings: Record<string, unknown>;
  order: number;
  is_visible: boolean;
};

type SectionForm = {
  page: string;
  section_type: string;
  title: string;
  subtitle: string;
  description: string;
  background_color: string;
  text_color: string;
  custom_settings: string;
  order: string;
  is_visible: boolean;
};

const emptyForm: SectionForm = {
  page: "",
  section_type: "hero",
  title: "",
  subtitle: "",
  description: "",
  background_color: "#F4F1E8",
  text_color: "#30382B",
  custom_settings: "{}",
  order: "0",
  is_visible: true,
};

const sectionTypes = [
  "hero",
  "text",
  "image",
  "services",
  "projects",
  "gallery",
  "about",
  "testimonials",
  "contact",
  "cta",
];

export default function SectionsPage() {
  const router = useRouter();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [form, setForm] = useState<SectionForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getToken() {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("baseplate_access");
  }

  function getAuthHeaders(): HeadersInit {
    const token = getToken();

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }

  function handleUnauthorized() {
    sessionStorage.removeItem("baseplate_access");
    sessionStorage.removeItem("baseplate_refresh");
    router.replace("/admin/login");
  }

  function signOut() {
    sessionStorage.removeItem("baseplate_access");
    sessionStorage.removeItem("baseplate_refresh");
    router.replace("/admin/login");
  }

  const loadPages = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API}/admin/pages/`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load website pages.");
      }

      const data = await response.json();

      const pageList: PageItem[] = Array.isArray(data)
        ? data
        : data.results || [];

      setPages(pageList);

      setSelectedPage((current) => {
        if (current && pageList.some((page) => String(page.id) === current)) {
          return current;
        }

        return pageList.length > 0 ? String(pageList[0].id) : "";
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load pages. Please check Django."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadSections = useCallback(
    async (pageId: string) => {
      if (!pageId) {
        setSections([]);
        setSectionsLoading(false);
        return;
      }

      setSectionsLoading(true);
      setErrorMessage("");

      try {
        const token = getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response = await fetch(
          `${API}/admin/sections/?page_id=${encodeURIComponent(pageId)}`,
          {
            headers: getAuthHeaders(),
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load sections for this page.");
        }

        const data = await response.json();

        setSections(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load sections."
        );
      } finally {
        setSectionsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (selectedPage) {
      loadSections(selectedPage);
    } else {
      setSections([]);
    }
  }, [selectedPage, loadSections]);

  function updateField(
    name: keyof SectionForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      page: selectedPage,
    });

    setImageFile(null);
    setEditingId(null);
  }

  function editSection(section: SectionItem) {
    setEditingId(section.id);

    setForm({
      page: String(section.page),
      section_type: section.section_type,
      title: section.title || "",
      subtitle: section.subtitle || "",
      description: section.description || "",
      background_color: section.background_color || "#F4F1E8",
      text_color: section.text_color || "#30382B",
      custom_settings: JSON.stringify(
        section.custom_settings || {},
        null,
        2
      ),
      order: String(section.order ?? 0),
      is_visible: section.is_visible,
    });

    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!form.page) {
      setErrorMessage("Please select a website page.");
      return;
    }

    let settings: Record<string, unknown>;

    try {
      settings = JSON.parse(form.custom_settings || "{}");

      if (
        settings === null ||
        Array.isArray(settings) ||
        typeof settings !== "object"
      ) {
        throw new Error("Settings must be a JSON object.");
      }
    } catch {
      setErrorMessage("Custom Settings must contain valid JSON.");
      return;
    }

    setSaving(true);

    const body = new FormData();

    body.append("page", form.page);
    body.append("section_type", form.section_type);
    body.append("title", form.title);
    body.append("subtitle", form.subtitle);
    body.append("description", form.description);
    body.append("background_color", form.background_color);
    body.append("text_color", form.text_color);
    body.append("custom_settings", JSON.stringify(settings));
    body.append("order", form.order);
    body.append("is_visible", String(form.is_visible));

    if (imageFile) {
      body.append("image", imageFile);
    }

    try {
      if (!getToken()) {
        handleUnauthorized();
        return;
      }

      const url = editingId
        ? `${API}/admin/sections/${editingId}/`
        : `${API}/admin/sections/`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: getAuthHeaders(),
        body,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let errorText = "Unable to save this section.";

        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
        } catch {
          // Keep the default error message.
        }

        throw new Error(errorText);
      }

      setMessage(
        editingId
          ? "Section updated successfully!"
          : "Section created successfully!"
      );

      resetForm();
      await loadSections(selectedPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSection(id: number) {
    if (
      !window.confirm("Are you sure you want to delete this section?")
    ) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      if (!getToken()) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API}/admin/sections/${id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to delete this section.");
      }

      setMessage("Section deleted successfully!");

      if (editingId === id) {
        resetForm();
      }

      await loadSections(selectedPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete section."
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#e2e0d6] bg-white px-4 py-3 text-sm text-[#303b2b] outline-none transition focus:border-[#78845c] focus:ring-2 focus:ring-[#78845c]/15";

  const labelClass =
    "block text-sm font-medium text-[#35452c]";

  return (
    <main className="min-h-screen bg-[#f5f4ee] text-[#303b2b] md:flex">

      {/* SIDEBAR - SAME DESIGN AS DASHBOARD */}
      <aside className="flex w-full flex-col bg-[#303d2c] px-6 py-7 text-white md:min-h-screen md:w-[245px] md:shrink-0">

        {/* LOGO */}
        <div className="mb-10 border-b border-white/15 pb-7">
          <Image
            src="/images/design.jpeg"
            alt="Baseplate UAE"
            width={180}
            height={90}
            priority
            className="max-h-[70px] w-[155px] object-contain"
          />

          <p className="mt-4 text-[10px] tracking-[0.3em] text-[#c3c9a5]">
            WEBSITE CONTROL PANEL
          </p>
        </div>

        {/* WORKSPACE MENU */}
        <div>
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

  {/* Pages */}
  <a href="/admin/pages" className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M14 3v6h5 M8 13h8 M8 17h8" />
    </svg>
    Pages
  </a>

  {/* Page Sections - Active */}
  <a href="/admin/sections" className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#78845c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10">
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18 M9 9v12 M15 9v12" />
    </svg>
    Page Sections
    <span className="ml-auto h-2 w-2 rounded-full bg-[#dce5c6]"></span>
  </a>
</nav>

        </div>

        {/* SIGN OUT */}
        <button
          onClick={signOut}
          className="mt-8 rounded-lg px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/10 md:mt-auto"
        >
          ↗ &nbsp; Sign out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <section className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">

        {/* PAGE HEADING */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#92977e]">
            BASEPLATE UAE / CONTENT MANAGEMENT
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#303b2b]">
            Page Section Editor
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Manage banners, text, images and content sections on your website.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-6 rounded-lg border border-[#d9e1d0] bg-[#edf1e7] px-5 py-4 text-sm text-[#35452c]">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* SELECT WEBSITE PAGE */}
        <div className="mb-7 rounded-xl border border-[#e5e3d9] bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#92977e]">
            Website Content
          </p>

          <h2 className="mt-2 font-serif text-2xl text-[#303b2b]">
            Select Website Page
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Choose the page where you want to manage sections.
          </p>

          {loading ? (
            <p className="mt-5 text-sm text-stone-500">
              Loading website pages...
            </p>
          ) : pages.length === 0 ? (
            <p className="mt-5 text-sm text-stone-500">
              No website pages found. Please create a page first.
            </p>
          ) : (
            <select
              value={selectedPage}
              onChange={(event) => {
                const pageId = event.target.value;

                setSelectedPage(pageId);
                setForm({
                  ...emptyForm,
                  page: pageId,
                });
                setEditingId(null);
                setImageFile(null);
                setMessage("");
                setErrorMessage("");
              }}
              className={`${inputClass} max-w-xl`}
            >
              <option value="">Select a page</option>

              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ADD / EDIT SECTION FORM */}
        <div className="mb-10 rounded-xl border border-[#e5e3d9] bg-white p-6 md:p-8">

          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#92977e]">
              Section Details
            </p>

            <h2 className="mt-2 font-serif text-2xl text-[#303b2b]">
              {editingId ? "Edit Section" : "Add New Section"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Add or update content for your selected website page.
            </p>
          </div>

          <form onSubmit={saveSection} className="space-y-5">

            {/* SECTION TYPE */}
            <div>
              <label className={labelClass}>
                Section Type
              </label>

              <select
                value={form.section_type}
                onChange={(event) =>
                  updateField("section_type", event.target.value)
                }
                className={inputClass}
              >
                {sectionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* SECTION TITLE */}
            <div>
              <label className={labelClass}>
                Section Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                className={inputClass}
                placeholder="Example: Spaces That Make an Impact"
              />
            </div>

            {/* SUBTITLE */}
            <div>
              <label className={labelClass}>
                Subtitle
              </label>

              <input
                type="text"
                value={form.subtitle}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                className={inputClass}
                placeholder="Enter section subtitle"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={5}
                className={inputClass}
                placeholder="Enter section description"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className={labelClass}>
                Section Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#edf0e7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#35452c]`}
              />

              {imageFile && (
                <p className="mt-2 text-xs text-stone-500">
                  Selected image: {imageFile.name}
                </p>
              )}

              {editingId && !imageFile && (
                <p className="mt-2 text-xs text-stone-500">
                  Leave empty to keep the existing image.
                </p>
              )}
            </div>

            {/* COLOURS */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Background Colour
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#e2e0d6] p-3">
                  <input
                    type="color"
                    value={form.background_color}
                    onChange={(event) =>
                      updateField("background_color", event.target.value)
                    }
                    className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
                  />

                  <span className="text-sm text-stone-600">
                    {form.background_color}
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Text Colour
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#e2e0d6] p-3">
                  <input
                    type="color"
                    value={form.text_color}
                    onChange={(event) =>
                      updateField("text_color", event.target.value)
                    }
                    className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
                  />

                  <span className="text-sm text-stone-600">
                    {form.text_color}
                  </span>
                </div>
              </div>

            </div>

            {/* DISPLAY ORDER */}
            <div>
              <label className={labelClass}>
                Display Order
              </label>

              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(event) =>
                  updateField("order", event.target.value)
                }
                className={inputClass}
              />

              <p className="mt-1 text-xs text-stone-400">
                Lower numbers appear earlier on the page.
              </p>
            </div>

            {/* CUSTOM SETTINGS */}
            <div>
              <label className={labelClass}>
                Custom Settings (JSON)
              </label>

              <textarea
                value={form.custom_settings}
                onChange={(event) =>
                  updateField("custom_settings", event.target.value)
                }
                rows={5}
                className={`${inputClass} font-mono text-xs`}
                placeholder='{"button_text": "Contact Us"}'
              />

              <p className="mt-1 text-xs text-stone-400">
                Enter valid JSON settings for this section.
              </p>
            </div>

            {/* VISIBILITY */}
            <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#f5f4ee] p-4">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(event) =>
                  updateField("is_visible", event.target.checked)
                }
                className="h-4 w-4 accent-[#35452c]"
              />

              <span className="text-sm font-medium text-[#35452c]">
                Show this section on the website
              </span>
            </label>

            {/* SAVE BUTTONS */}
            <div className="flex flex-wrap gap-3 border-t border-[#eeece4] pt-6">

              <button
                type="submit"
                disabled={saving || !selectedPage || loading}
                className="rounded-lg bg-[#35452c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#526442] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Section"
                    : "Create Section"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-[#dcdacf] bg-white px-6 py-3 text-sm font-medium text-[#35452c] transition hover:bg-[#f5f4ee]"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </div>

        {/* EXISTING SECTIONS */}
        <div>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#92977e]">
                Content Library
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#303b2b]">
                Existing Sections
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                View and manage the sections created for this page.
              </p>
            </div>

            <span className="rounded-full bg-[#e9ebdf] px-4 py-2 text-xs font-medium text-[#526442]">
              {sections.length} Sections
            </span>
          </div>

          {sectionsLoading ? (
            <div className="rounded-xl border border-[#e5e3d9] bg-white p-8 text-center text-sm text-stone-500">
              Loading sections...
            </div>
          ) : !selectedPage ? (
            <div className="rounded-xl border border-[#e5e3d9] bg-white p-8 text-center text-sm text-stone-500">
              Select a website page to view its sections.
            </div>
          ) : sections.length === 0 ? (
            <div className="rounded-xl border border-[#e5e3d9] bg-white p-10 text-center">
              <h3 className="font-serif text-xl text-[#303b2b]">
                No sections yet
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Add your first section using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">

              {sections.map((section) => (
                <article
                  key={section.id}
                  className="flex flex-col gap-5 rounded-xl border border-[#e5e3d9] bg-white p-5 md:flex-row md:items-center"
                >

                  {/* IMAGE */}
                  {section.image_url ? (
                    <img
                      src={section.image_url}
                      alt={section.title || "Section image"}
                      className="h-40 w-full rounded-lg object-cover md:h-28 md:w-40"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[#f0efe8] text-xs uppercase tracking-widest text-[#92977e] md:w-40">
                      No Image
                    </div>
                  )}

                  {/* DETAILS */}
                  <div className="min-w-0 flex-1">

                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#edf0e7] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#526442]">
                        {section.section_type}
                      </span>

                      <span className="text-xs text-stone-400">
                        Order: {section.order}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-[#303b2b]">
                      {section.title || "Untitled Section"}
                    </h3>

                    {section.subtitle && (
                      <p className="mt-1 text-sm text-stone-500">
                        {section.subtitle}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-medium">
                      <span
                        className={
                          section.is_visible
                            ? "text-[#526442]"
                            : "text-red-600"
                        }
                      >
                        {section.is_visible
                          ? "Visible on website"
                          : "Hidden from website"}
                      </span>
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex shrink-0 gap-2">

                    <button
                      type="button"
                      onClick={() => editSection(section)}
                      className="rounded-lg bg-[#78845c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#65734e]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSection(section.id)}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
