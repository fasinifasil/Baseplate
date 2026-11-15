
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

type Service = {
  id: number;
  title: string;
  slug: string;
  short_tagline?: string;
  is_active?: boolean;
};

const navigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services", dropdown: true },
  { label: "Interior", href: "/interior" },
  { label: "Projects", href: "/our-projects" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");

  // LOAD SERVICES FROM DJANGO BACKEND
  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch(`${API}/services/`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Services API error: ${response.status}`);
        }

        const payload = await response.json();

        const rows: Service[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        const activeServices = rows
          .filter(
            (service) =>
              service &&
              service.title &&
              service.slug &&
              service.is_active !== false
          );

        setServices(activeServices);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Failed to load services:", error);
          setServices([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    }

    loadServices();

    return () => controller.abort();
  }, []);

  // CLOSE MOBILE MENU
  function closeMenu() {
    setMenuOpen(false);
    setActiveDropdown("");
  }

  // OPEN OR CLOSE SERVICES DROPDOWN
  function toggleDropdown() {
    setActiveDropdown((current) =>
      current === "Services" ? "" : "Services"
    );
  }

  // BUILD SERVICE LINKS USING DJANGO SLUGS
  const serviceItems = services.map((service) => ({
    id: service.id,
    label: service.title,
    description: service.short_tagline,
    href: `/services/${encodeURIComponent(service.slug)}`,
  }));

  return (
    <header className="site-header">
      <div className="site-header-inner">

        {/* LOGO */}
        <Link
          href="/"
          className="site-logo"
          onClick={closeMenu}
        >
          <img
            src="/images/design.jpeg"
            alt="Baseplate Group"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-navigation">
          {navigation.map((item) => (
            <div
              key={item.label}
              className="nav-item"
              onMouseEnter={() =>
                item.dropdown &&
                setActiveDropdown(item.label)
              }
              onMouseLeave={() =>
                item.dropdown &&
                setActiveDropdown("")
              }
            >
              {item.dropdown ? (
                <button
                  type="button"
                  className="nav-link"
                  onClick={toggleDropdown}
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  <span className="nav-chevron">
                    {activeDropdown === item.label ? "⌃" : "⌄"}
                  </span>
                </button>
              ) : (
                <Link
                  className="nav-link"
                  href={item.href}
                >
                  {item.label}
                </Link>
              )}

              {/* SERVICES DROPDOWN */}
              {item.dropdown && (
                <div
                  className={`nav-dropdown ${
                    activeDropdown === item.label ? "open" : ""
                  }`}
                >
                  <div className="dropdown-heading">
                    <span>EXPLORE OUR SERVICES</span>
                  </div>

                  {servicesLoading ? (
                    <p className="dropdown-message">
                      Loading services...
                    </p>
                  ) : serviceItems.length > 0 ? (
                    serviceItems.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href}
                        onClick={closeMenu}
                        className="service-dropdown-link"
                      >
                        <span>
                          <strong>{service.label}</strong>
                          {service.description && (
                            <small>{service.description}</small>
                          )}
                        </span>
                        <span className="dropdown-arrow">↗</span>
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="/services"
                      onClick={closeMenu}
                      className="service-dropdown-link"
                    >
                      Explore all services ↗
                    </Link>
                  )}

                  <div className="dropdown-footer">
                    <Link
                      href="/services"
                      onClick={closeMenu}
                    >
                      View All Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* HEADER ACTIONS */}
        <div className="header-actions">
          <Link
            href="/contact"
            className="quote-button"
          >
            Get a Quote ↗
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className={`mobile-toggle ${
              menuOpen ? "active" : ""
            }`}
            onClick={() => {
              setMenuOpen((current) => !current);
              setActiveDropdown("");
            }}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className={`mobile-navigation ${
          menuOpen ? "open" : ""
        }`}
      >
        {navigation.map((item) => (
          <div
            key={item.label}
            className="mobile-nav-item"
          >
            {item.dropdown ? (
              <>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  <span>
                    {activeDropdown === item.label ? "⌃" : "⌄"}
                  </span>
                </button>

                {activeDropdown === item.label && (
                  <div className="mobile-submenu">
                    {servicesLoading ? (
                      <p className="dropdown-message">
                        Loading services...
                      </p>
                    ) : serviceItems.length > 0 ? (
                      serviceItems.map((service) => (
                        <Link
                          key={service.id}
                          href={service.href}
                          onClick={closeMenu}
                        >
                          {service.label} ↗
                        </Link>
                      ))
                    ) : (
                      <Link
                        href="/services"
                        onClick={closeMenu}
                      >
                        Explore all services ↗
                      </Link>
                    )}

                    <Link
                      href="/services"
                      onClick={closeMenu}
                      className="mobile-all-services"
                    >
                      View All Services →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}

        <Link
          href="/contact"
          className="mobile-quote"
          onClick={closeMenu}
        >
          Get a Quote ↗
        </Link>
      </div>
    </header>
  );
}
