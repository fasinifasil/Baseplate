
import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/">
            <img
              src="/images/design.jpeg"
              alt="Baseplate Group"
            />
          </Link>

          <p>
            Creative exhibition, interior and event space design.
            We bring ideas to life through thoughtful design and execution.
          </p>

          <Link href="/contact" className="footer-cta">
            Start a Project ↗
          </Link>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/exhibition">Exhibition</Link>
          <Link href="/interior">Interior</Link>
          <Link href="/our-projects">Projects</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-column">
          <h3>Our Services</h3>
          <Link href="/exhibition">Exhibition Stands</Link>
          <Link href="/interior">Interior Solutions</Link>
          <Link href="/services">Event Spaces</Link>
          <Link href="/services">Design & Build</Link>
        </div>

        <div className="footer-column footer-contact">
          <h3>Get in Touch</h3>
          <p>Have a project in mind?</p>
          <Link href="/contact">Contact our team ↗</Link>
          <a href="mailto:info@baseplateuae.com">
            info@baseplateuae.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
         © 2026 Baseplate Group. All rights reserved.
        </span>
        <span>DESIGNED TO BRING IDEAS TO LIFE</span>
      </div>
    </footer>
  );
}
