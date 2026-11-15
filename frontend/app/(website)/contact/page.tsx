
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const CONTACT = {
  phone: "+971 50 123 4567",
  email: "info@baseplateuae.com",
  hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
};

export default function ContactPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main className="contact-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="container hero-content">
          <span className="eyebrow light">
            BASEPLATE UAE · CONTACT
          </span>

          <h1>
            Let's create
            <br />
            something <em>remarkable.</em>
          </h1>

          <p>
            Have an exhibition, interior or event project in mind?
            Tell us what you are planning. We would love to hear from you.
          </p>

          <a href="#enquiry" className="primary-button">
            Start a conversation <span>↗</span>
          </a>

          <div className="hero-location">
            SHARJAH · UNITED ARAB EMIRATES
          </div>
        </div>

        <div className="hero-circle hero-circle-one" />
        <div className="hero-circle hero-circle-two" />
      </section>

      {/* INTRODUCTION */}
      <section className="container intro">
        <div>
          <span className="eyebrow">LET'S CONNECT</span>

          <h2>
            Good things start
            <br />
            with <em>hello.</em>
          </h2>
        </div>

        <p>
          From the first idea to the final detail, our team is ready
          to help shape your next space. Get in touch and let's talk
          about your goals, requirements and timeline.
        </p>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="container details">

        <a className="detail-card" href="tel:+971501234567">
          <div className="detail-icon">↗</div>
          <span>CALL OUR TEAM</span>
          <strong>{CONTACT.phone}</strong>
          <small>Speak with us about your project</small>
        </a>

        <a
          className="detail-card"
          href={`mailto:${CONTACT.email}`}
        >
          <div className="detail-icon">✉</div>
          <span>EMAIL US</span>
          <strong>{CONTACT.email}</strong>
          <small>Send us your project brief</small>
        </a>

        <div className="detail-card">
          <div className="detail-icon">⌖</div>
          <span>OUR LOCATION</span>
          <strong>Sharjah, UAE</strong>
          <small>{CONTACT.hours}</small>
        </div>

      </section>

      {/* UAE TO SHARJAH MAP ANIMATION */}
      <section className="map-section">
        <div className="container">

          <div className="map-heading">
            <div>
              <span className="eyebrow">OUR LOCATION</span>

              <h2>
                From the UAE
                <br />
                to <em>Sharjah.</em>
              </h2>
            </div>

            <p>
              Discover our location in the United Arab Emirates.
              Scroll down to see the map transition from the UAE
              overview to Sharjah.
            </p>
          </div>

          <div className="uae-zoom-map" ref={mapRef}>

            {/* UAE OVERVIEW MAP */}
            <iframe
              className="uae-map"
              title="United Arab Emirates overview map"
              src="https://www.google.com/maps?q=United%20Arab%20Emirates&z=6&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* SHARJAH MAP */}
            <iframe
              className="sharjah-map"
              title="Sharjah map"
              src="https://www.google.com/maps?q=Sharjah%2C%20United%20Arab%20Emirates&z=13&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* MAP LABELS */}
            <div className="zoom-caption">
              <span className="uae-caption">
                UNITED ARAB EMIRATES
              </span>

              <span className="sharjah-caption">
                SHARJAH · UAE
              </span>
            </div>

            {/* LOCATION MARKER */}
            <div className="zoom-marker">
              <span className="marker-dot" />
              BASEPLATE UAE
            </div>

            <div className="zoom-corner">
              LOCATION · 001
            </div>

          </div>

          <div className="map-bottom">
            <span>SHARJAH · UNITED ARAB EMIRATES</span>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Sharjah%2C%20United%20Arab%20Emirates"
              target="_blank"
              rel="noreferrer"
            >
              OPEN IN GOOGLE MAPS ↗
            </a>
          </div>

          <p className="map-disclaimer">
            Demo map location only. The marker does not represent a
            verified Baseplate office address.
          </p>

        </div>
      </section>

      {/* ENQUIRY SECTION */}
      <section className="container enquiry" id="enquiry">

        <div className="enquiry-info">
          <span className="eyebrow">START A PROJECT</span>

          <h2>
            Tell us what
            <br />
            you have in <em>mind.</em>
          </h2>

          <p className="enquiry-description">
            Share a few details about your project.
            Whether you have a clear brief or are just exploring
            an idea, we would be happy to hear from you.
          </p>

          <div className="quick-details">

            <div>
              <span>PHONE</span>
              <a href="tel:+971501234567">
                {CONTACT.phone}
              </a>
            </div>

            <div>
              <span>EMAIL</span>
              <a href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </div>

            <div>
              <span>WORKING HOURS</span>
              <strong>{CONTACT.hours}</strong>
            </div>

          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="form-card">

          <h3>Send an enquiry</h3>

          <p className="form-note">
            Tell us a little about your requirements.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <label>
                Your name *

                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </label>

              <label>
                Company

                <input
                  name="company"
                  type="text"
                  placeholder="Company name"
                />
              </label>

              <label>
                Email address *

                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </label>

              <label>
                Phone number

                <input
                  name="phone"
                  type="tel"
                  placeholder="+971 ..."
                />
              </label>

              <label className="full">
                Service

                <select name="service" defaultValue="">
                  <option value="">Select a service</option>
                  <option>Exhibition Stand Design & Build</option>
                  <option>Interior Design & Fit-out</option>
                  <option>Event Production</option>
                  <option>Custom Fabrication</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="full">
                Project details *

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project, requirements and timeline..."
                  required
                />
              </label>

            </div>

            <button type="submit" className="submit-button">
              Send enquiry <span>↗</span>
            </button>

            {submitted && (
              <p className="success-message">
                Thank you! This demo form has received your details
                on the page. It is not connected to Django yet.
              </p>
            )}

          </form>
        </div>

      </section>

      {/* ALL PAGE STYLES */}
      <style jsx>{`

        .contact-page {
          --ink: #29372e;
          --olive: #697d60;
          --sage: #e1e9dc;
          --cream: #f7f7f1;
          --muted: #738077;

          background: var(--cream);
          color: var(--ink);
          overflow: hidden;
        }

        .contact-page * {
          box-sizing: border-box;
        }

        .container {
          width: min(1160px, calc(100% - 48px));
          margin: auto;
        }

        .eyebrow {
          color: var(--olive);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .eyebrow.light {
          color: #d5e1ce;
        }

        h2 {
          font-size: clamp(40px, 5vw, 65px);
          line-height: 1.05;
          font-weight: 500;
          letter-spacing: -3px;
          margin: 20px 0;
        }

        h2 em {
          font-family: Georgia, serif;
          font-weight: 400;
          color: var(--olive);
        }

        /* HERO */

        .hero {
          min-height: 670px;
          display: flex;
          align-items: center;
          position: relative;
          isolation: isolate;
          color: white;

          background:
            url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85")
            center / cover no-repeat;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: -1;

          background: linear-gradient(
            90deg,
            rgba(24, 38, 29, .9),
            rgba(24, 38, 29, .35)
          );
        }

        .hero-content {
          padding-top: 100px;
          padding-bottom: 100px;
          animation: rise .9s ease both;
        }

        .hero h1 {
          font-size: clamp(54px, 8vw, 100px);
          line-height: .98;
          letter-spacing: -6px;
          font-weight: 500;
          margin: 30px 0;
        }

        .hero h1 em {
          font-family: Georgia, serif;
          font-weight: 400;
          color: #cbd9c2;
        }

        .hero p {
          max-width: 500px;
          color: rgba(255,255,255,.8);
          font-size: 15px;
          line-height: 1.9;
          margin-bottom: 30px;
        }

        .primary-button {
          display: inline-flex;
          gap: 20px;
          padding: 16px 25px;
          border-radius: 40px;
          background: var(--sage);
          color: var(--ink);
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          transition: .3s;
        }

        .primary-button:hover {
          transform: translateY(-4px);
          background: white;
        }

        .hero-location {
          margin-top: 55px;
          font-size: 10px;
          letter-spacing: 3px;
          color: #d5e1ce;
        }

        .hero-circle {
          position: absolute;
          z-index: -1;
          right: -160px;
          bottom: -300px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-circle-one {
          width: 500px;
          height: 500px;
        }

        .hero-circle-two {
          width: 680px;
          height: 680px;
          right: -250px;
          bottom: -390px;
        }

        /* INTRO */

        .intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: end;
          padding-top: 110px;
          padding-bottom: 70px;
        }

        .intro > p {
          max-width: 480px;
          color: var(--muted);
          font-size: 14px;
          line-height: 2;
        }

        /* CONTACT CARDS */

        .details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          padding-bottom: 110px;
        }

        .detail-card {
          min-height: 205px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: white;
          border: 1px solid #e5e9e1;
          border-radius: 18px;
          text-decoration: none;
          color: var(--ink);
          transition: .3s;
        }

        .detail-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 45px rgba(41,55,46,.08);
        }

        .detail-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          background: var(--sage);
          color: var(--olive);
          border-radius: 13px;
          font-size: 20px;
          margin-bottom: 22px;
        }

        .detail-card > span {
          font-size: 10px;
          letter-spacing: 2px;
          color: var(--muted);
          margin-bottom: 9px;
          font-weight: 800;
        }

        .detail-card strong {
          font-size: 16px;
          overflow-wrap: anywhere;
        }

        .detail-card small {
          margin-top: 9px;
          color: var(--muted);
          font-size: 12px;
        }

        /* MAP SECTION */

        .map-section {
          padding: 100px 0;
          background: #e9eee6;
        }

        .map-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
          margin-bottom: 40px;
        }

        .map-heading p {
          max-width: 350px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.9;
        }

        .uae-zoom-map {
          position: relative;
          height: 520px;
          overflow: hidden;
          border-radius: 24px;
          background: #dce5d7;
          box-shadow: 0 25px 70px rgba(35,50,38,.15);
          isolation: isolate;
        }

        .uae-zoom-map iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .uae-map {
          z-index: 1;
          opacity: 1;
          transform: scale(1);
        }

        .sharjah-map {
          z-index: 2;
          opacity: 0;
          transform: scale(1.5);
          transform-origin: 53% 55%;
        }

        /* START ANIMATION ON SCROLL */

        .uae-zoom-map.visible .uae-map {
          animation: uaeFadeOut 2.8s ease forwards;
        }

        .uae-zoom-map.visible .sharjah-map {
          animation: sharjahZoom 3.5s ease forwards;
        }

        .zoom-caption {
          position: absolute;
          z-index: 4;
          top: 25px;
          left: 25px;
          color: var(--ink);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .uae-caption {
          display: inline-block;
        }

        .uae-zoom-map.visible .uae-caption {
          animation: captionOut 1.8s ease forwards;
        }

        .sharjah-caption {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          white-space: nowrap;
        }

        .uae-zoom-map.visible .sharjah-caption {
          animation: captionIn 1s ease 2.5s forwards;
        }

        /* MARKER */

        .zoom-marker {
          position: absolute;
          z-index: 5;
          top: 52%;
          left: 53%;
          display: flex;
          align-items: center;
          gap: 12px;
          transform: translate(-50%, -50%) scale(.5);
          opacity: 0;
          padding: 13px 20px;
          border-radius: 50px;
          background: white;
          color: var(--ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          box-shadow: 0 10px 35px #0002;
          white-space: nowrap;
          pointer-events: none;
        }

        .marker-dot {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border-radius: 50%;
          background: var(--olive);
          box-shadow: 0 0 0 7px #697d6030;
        }

        .uae-zoom-map.visible .zoom-marker {
          animation:
            markerAppear .8s ease 3s forwards,
            markerPulse 2s ease-in-out 4s infinite;
        }

        .zoom-corner {
          position: absolute;
          z-index: 5;
          right: 25px;
          bottom: 25px;
          padding: 11px 15px;
          background: white;
          border-radius: 30px;
          font-size: 9px;
          letter-spacing: 2px;
          color: var(--ink);
          font-weight: 800;
        }

        .map-bottom {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-top: 20px;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 1px;
        }

        .map-bottom a {
          color: var(--olive);
          text-decoration: none;
          font-weight: 800;
        }

        .map-disclaimer {
          margin-top: 15px;
          font-size: 11px;
          color: var(--muted);
        }

        /* MAP KEYFRAMES */

        @keyframes uaeFadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          65% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        @keyframes sharjahZoom {
          0% {
            opacity: 0;
            transform: scale(1.5);
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes captionOut {
          to { opacity: 0; }
        }

        @keyframes captionIn {
          to { opacity: 1; }
        }

        @keyframes markerAppear {
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes markerPulse {
          50% {
            box-shadow: 0 12px 40px #0003;
          }
        }

        /* ENQUIRY */

        .enquiry {
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          gap: 80px;
          padding-top: 110px;
          padding-bottom: 110px;
          align-items: start;
        }

        .enquiry-info > p {
          max-width: 390px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.9;
        }

        .quick-details {
          display: grid;
          gap: 22px;
          margin-top: 40px;
        }

        .quick-details div {
          display: grid;
          gap: 6px;
        }

        .quick-details span {
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .quick-details a,
        .quick-details strong {
          color: var(--ink);
          font-size: 13px;
          text-decoration: none;
        }

        /* FORM */

        .form-card {
          padding: 40px;
          background: white;
          border: 1px solid #e5e9e1;
          border-radius: 22px;
          box-shadow: 0 15px 50px #29372e0c;
        }

        .form-card h3 {
          font-size: 25px;
          margin: 0 0 10px;
        }

        .form-card > p {
          color: var(--muted);
          font-size: 12px;
          margin-bottom: 28px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-grid label {
          display: flex;
          flex-direction: column;
          gap: 9px;
          font-size: 11px;
          font-weight: 800;
          color: #59675d;
        }

        .form-grid .full {
          grid-column: 1 / -1;
        }

        .form-grid input,
        .form-grid select,
        .form-grid textarea {
          width: 100%;
          padding: 14px;
          border: 1px solid #e2e7df;
          border-radius: 10px;
          background: #fbfcf9;
          font: inherit;
          font-size: 13px;
          color: var(--ink);
          outline: none;
        }

        .form-grid input:focus,
        .form-grid select:focus,
        .form-grid textarea:focus {
          border-color: var(--olive);
          box-shadow: 0 0 0 3px #697d6020;
        }

        .form-grid textarea {
          resize: vertical;
        }

        .submit-button {
          display: inline-flex;
          gap: 20px;
          border: 0;
          border-radius: 40px;
          padding: 16px 26px;
          margin-top: 25px;
          background: var(--olive);
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: .3s;
        }

        .submit-button:hover {
          background: #40533f;
          transform: translateY(-3px);
        }

        .success-message {
          padding: 14px;
          background: #edf4e9;
          color: #405b3e;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
          margin-top: 16px;
        }

        /* HERO ANIMATION */

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* MOBILE RESPONSIVE */

        @media (max-width: 800px) {
          .intro,
          .enquiry {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .details {
            grid-template-columns: 1fr;
          }

          .map-heading {
            display: block;
          }

          .map-heading p {
            margin-top: 20px;
          }

          .enquiry {
            gap: 45px;
          }
        }

        @media (max-width: 520px) {
          .container {
            width: calc(100% - 32px);
          }

          .hero {
            min-height: 590px;
          }

          .hero h1 {
            font-size: 55px;
            letter-spacing: -3px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-grid .full {
            grid-column: auto;
          }

          .form-card {
            padding: 24px;
          }

          .uae-zoom-map {
            height: 350px;
          }

          .zoom-caption {
            top: 16px;
            left: 16px;
            font-size: 9px;
          }

          .map-bottom {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-page *,
          .contact-page *::before,
          .contact-page *::after {
            animation: none !important;
            transition: none !important;
          }
        }

      `}</style>
    </main>
  );
}