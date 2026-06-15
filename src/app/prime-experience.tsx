"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Notice = {
  kind: "idle" | "success" | "error";
  text: string;
};

const nav = [
  ["Home", "/"],
  ["Features", "/features"],
  ["About Us", "/about"],
  ["How it works", "/how-it-works"],
  ["Resources", "/resources"],
];

const features = [
  {
    title: "Workforce Listening",
    copy: "Gather real-time signals from your workplace.",
  },
  {
    title: "Workplace Intelligence",
    copy: "Make sharper decisions with AI-powered insights.",
  },
  {
    title: "Build A Better Workplace",
    copy: "Transform insight into durable organizational growth.",
  },
];

const insights = [
  {
    title: "Proactive Stress & Burnout Detection",
    copy: "Leverage sentiment analysis to uncover early signs of stress, burnout, and disengagement.",
    tag: "Risk radar",
  },
  {
    title: "Real-Time Employee Sentiment Monitoring",
    copy: "Capture and analyze employee sentiment instantly with AI-powered insight designed to improve engagement.",
    tag: "AI listening",
  },
];

const steps = [
  ["01", "Launch & Customize", "Set up your platform and customize it to match your culture."],
  ["02", "Workforce Listening", "Gather real-time insights from your workforce."],
  ["03", "Workplace Intelligence", "Make smarter decisions with AI-powered insight."],
  ["04", "Build A Better Workplace", "Transform insight into lasting organizational growth."],
];

const metrics = [
  ["95%", "response clarity"],
  ["42%", "faster culture actions"],
  ["3.5x", "signal coverage"],
];

function Icon({ name }: { name: "arrow" | "play" | "apple" | "spark" | "check" | "send" | "menu" | "close" }) {
  const common = "h-5 w-5";
  if (name === "play") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "apple") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16.6 12.5c0-2 1.7-3 1.8-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.7 0-1.7-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.1-2.4 1.1-2.5-.1 0-2.9-1.1-2.9-3.4ZM14.7 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m12 2 2.4 6.7L21 11l-6.6 2.3L12 20l-2.4-6.7L3 11l6.6-2.3L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "send") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m4 12 16-8-5 16-3-7-8-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "menu" || name === "close") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {name === "menu" ? (
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CornerLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="corner-label">
      <span />
      <p>{children}</p>
      <span />
    </div>
  );
}

function Marquee() {
  const items = ["Foundrlist", "Findly.tools", "Listed On", "Featured On Startup Fame", "twelve.tools"];
  return (
    <div className="press-strip" aria-label="Press mentions">
      <div className="press-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

async function submitApi(path: string, payload: Record<string, string>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Request failed");
  }

  return response.json();
}

export default function PrimeExperience({ pageMode = "home" }: { pageMode?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [demoNotice, setDemoNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [subNotice, setSubNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [checkoutNotice, setCheckoutNotice] = useState<Notice>({ kind: "idle", text: "" });

  const headline = useMemo(() => {
    if (pageMode === "features") return "Smarter Insights For A More Engaged Workforce";
    if (pageMode === "about") return "Built For Better Workplace Decisions";
    if (pageMode === "how-it-works") return "From Listening To Action In One Flow";
    if (pageMode === "resources") return "Resources For Stronger Team Culture";
    if (pageMode === "demo") return "See Prime In Motion";
    if (pageMode === "checkout") return "Everything You Need, All In One Place";
    return "The Future Of Employee Happiness Starts With AI";
  }, [pageMode]);

  async function handleDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
    };
    setDemoNotice({ kind: "idle", text: "Sending..." });
    try {
      await submitApi("/api/contact", payload);
      setDemoNotice({ kind: "success", text: "Demo request received. We will reply with a tailored walkthrough." });
      event.currentTarget.reset();
    } catch (error) {
      setDemoNotice({ kind: "error", text: error instanceof Error ? error.message : "Could not submit request." });
    }
  }

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubNotice({ kind: "idle", text: "Joining..." });
    try {
      await submitApi("/api/subscribe", { email: String(form.get("email") || "") });
      setSubNotice({ kind: "success", text: "You are on the Prime resources list." });
      event.currentTarget.reset();
    } catch (error) {
      setSubNotice({ kind: "error", text: error instanceof Error ? error.message : "Subscription failed." });
    }
  }

  async function handleCheckout() {
    setCheckoutNotice({ kind: "idle", text: "Preparing secure checkout..." });
    try {
      const result = await submitApi("/api/checkout", { plan: "macos-lifetime" });
      setCheckoutNotice({ kind: "success", text: result.message });
    } catch (error) {
      setCheckoutNotice({ kind: "error", text: error instanceof Error ? error.message : "Checkout failed." });
    }
  }

  return (
    <main className="site-shell">
      <header className="nav-frame" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label="SaaS Prime home">
          <span>SaaS</span> Prime
        </Link>
        <nav className="desktop-nav">
          {nav.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/demo" onClick={() => setMenuOpen(false)}>
            Book Demo
          </Link>
        </nav>
      )}

      <section className="hero-section page-panel">
        <div className="hero-copy">
          <div className="eyebrow">SaaS Prime</div>
          <h1>{headline}</h1>
          <p>Unlock workforce potential through AI-powered happiness intelligence, sentiment analysis, and culture action tools.</p>
          <div className="hero-actions">
            <Link href="/demo" className="glass-button">
              Get Started <Icon name="send" />
            </Link>
            <button className="text-button" onClick={() => setVideoOpen(true)}>
              Watch Video <Icon name="play" />
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-label="Animated workplace intelligence preview">
          <Image src="/assets/prime-hero.png" alt="AI workplace analytics dashboard viewed by a team leader" fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <div className="hero-overlay hero-overlay-one">Strategy & Execution</div>
          <div className="hero-overlay hero-overlay-two">Breakpoint Diagnosis</div>
          <div className="orbital-copy">Performance Scaling</div>
          <div className="large-watermark">PRIME</div>
          <div className="scan-line" />
        </div>
      </section>

      <Marquee />

      <section className="feature-rail">
        {features.map((feature, index) => (
          <article className="feature-tile" key={feature.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{feature.title}</h2>
            <p>{feature.copy}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <CornerLabel>All Insights</CornerLabel>
        <div className="section-heading">
          <h2>Smarter Insights For A More Engaged Workforce</h2>
          <p>Gain real-time visibility into employee sentiment, engagement, and well-being to foster a healthier, more productive workplace.</p>
        </div>
        <div className="insight-grid">
          {insights.map((item) => (
            <article className="insight-card" key={item.title}>
              <div className="doodle-panel">
                <span className="mood mood-one" />
                <span className="mood mood-two" />
                <span className="mood mood-three" />
                <span className="mood-line" />
              </div>
              <div className="pill">{item.tag}</div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <Link href="/features">
                Explore Insights <Icon name="arrow" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="video-section">
        <div className="video-card">
          <Image src="/assets/prime-hero.png" alt="Workplace analytics video preview" fill sizes="(max-width: 900px) 100vw, 54vw" />
          <button onClick={() => setVideoOpen(true)} className="video-button">
            Watch Video <Icon name="play" />
          </button>
          <div className="chat-bubble bubble-one">Did you review the metrics?</div>
          <div className="chat-bubble bubble-two">What if we re-evaluate the core parameters?</div>
          <div className="chat-bubble bubble-three">Final decision: proceed with the engagement plan.</div>
        </div>
        <div className="section-heading side">
          <CornerLabel>Step By Step</CornerLabel>
          <h2>Great Workplace Culture Isn&apos;t Built Overnight</h2>
          <p>Workplace happiness and motivation are built through continuous insight and action.</p>
        </div>
      </section>

      <section className="timeline-section">
        <div className="timeline-line" />
        {steps.map(([number, title, copy]) => (
          <article key={number} className="timeline-step">
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="pricing-section">
        <CornerLabel>Pricing Plan</CornerLabel>
        <div className="pricing-copy">
          <h2>Everything You Need, All In One Place</h2>
          <p>Empower your organization with AI-driven insights designed for sustainable growth.</p>
        </div>
        <div className="pricing-card">
          <div className="price-ribbon">Exclusive Pricing For Early Adopters</div>
          <div className="price">$59.99</div>
          <button onClick={handleCheckout} className="download-button">
            <Icon name="apple" /> Download for macOS
          </button>
          <div className="price-foot">
            <span>No Subscription Required</span>
            <span><Icon name="check" /> Free Lifetime Updates</span>
          </div>
          {checkoutNotice.text && <p className={`notice ${checkoutNotice.kind}`}>{checkoutNotice.text}</p>}
        </div>
      </section>

      <section className="testimonial-section">
        <div className="quote-panel">
          <p>
            The stress and burnout detection capabilities changed how we approach employee well-being. Prime helps us identify
            potential concerns before they become larger issues, allowing us to take proactive measures that support our teams.
          </p>
          <div>
            <strong>Michael Carter</strong>
            <span>VP of Human Resources, GrowthLabs</span>
          </div>
          <div className="rating" aria-label="Rated 4.5 out of 5">4.5</div>
        </div>
        <div className="testimonial-image">
          <Image
            src="/assets/prime-testimonial.png"
            alt="Executive customer portrait"
            fill
            loading="eager"
            sizes="(max-width: 900px) 100vw, 48vw"
            style={{ objectPosition: "right center" }}
          />
        </div>
        <div className="section-heading side">
          <CornerLabel>Testimonials</CornerLabel>
          <h2>What Our Customers Say</h2>
          <p>Organizations use Prime to improve engagement, well-being, and workplace culture.</p>
        </div>
      </section>

      <section className="demo-section">
        <div className="section-heading">
          <CornerLabel>Book Demo</CornerLabel>
          <h2>Explore Prime With A Guided Walkthrough</h2>
          <p>Tell us where your culture program stands, and we will tailor the product walkthrough around your team.</p>
        </div>
        <form className="demo-form" onSubmit={handleDemo}>
          <label>
            Name
            <input name="name" required placeholder="Your name" />
          </label>
          <label>
            Work email
            <input name="email" type="email" required placeholder="you@company.com" />
          </label>
          <label>
            Company
            <input name="company" required placeholder="Company name" />
          </label>
          <button type="submit">Request Demo <Icon name="arrow" /></button>
          {demoNotice.text && <p className={`notice ${demoNotice.kind}`}>{demoNotice.text}</p>}
        </form>
      </section>

      <footer className="footer-panel">
        <div>
          <Link href="/" className="brand">
            <span>SaaS</span> Prime
          </Link>
          <h2>The Ultimate Guide To Successful Late-Night Team Collaboration</h2>
          <div className="socials" aria-label="Social links">
            <Link href="/resources">in</Link>
            <Link href="/resources">ig</Link>
            <Link href="/resources">x</Link>
          </div>
        </div>
        <form className="newsletter" onSubmit={handleSubscribe}>
          <label>
            Resources
            <input type="email" name="email" placeholder="Email for updates" required />
          </label>
          <button type="submit">Join <Icon name="arrow" /></button>
          {subNotice.text && <p className={`notice ${subNotice.kind}`}>{subNotice.text}</p>}
        </form>
        <nav>
          <strong>Company</strong>
          {nav.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <p className="copyright">© 2026 SaaS Prime. All Rights Reserved.</p>
      </footer>

      {videoOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Prime product video">
          <div className="modal-card">
            <button className="icon-button modal-close" onClick={() => setVideoOpen(false)} aria-label="Close video">
              <Icon name="close" />
            </button>
            <div className="video-sim">
              <div className="video-pulse"><Icon name="play" /></div>
              <h2>Prime listens, detects, and recommends.</h2>
              <p>Live sentiment streams are translated into clear actions for HR, operations, and leadership teams.</p>
              <div className="metric-row">
                {metrics.map(([value, label]) => (
                  <span key={label}><strong>{value}</strong>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
