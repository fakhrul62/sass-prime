"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import SignalCursor from "./signal-cursor";

type Notice = {
  kind: "idle" | "success" | "error";
  text: string;
};

const nav = [
  ["Home", "/"],
  ["Features", "/features"],
  ["About", "/about"],
  ["Process", "/how-it-works"],
  ["Resources", "/resources"],
];

const capabilities = [
  {
    number: "01",
    title: "Listen beyond the survey.",
    copy: "Prime reads the changing shape of work through lightweight check-ins, sentiment signals, and team-level context.",
    meta: ["Pulse capture", "Open feedback", "Signal mapping"],
    tone: "coral",
  },
  {
    number: "02",
    title: "See pressure before it spreads.",
    copy: "Burnout, disengagement, and communication friction become visible while there is still time to act.",
    meta: ["Risk radar", "Trend shifts", "Team patterns"],
    tone: "blue",
  },
  {
    number: "03",
    title: "Turn insight into momentum.",
    copy: "Every signal is translated into a clear next move for people leaders, managers, and operating teams.",
    meta: ["Action briefs", "Priority cues", "Progress loops"],
    tone: "acid",
  },
];

const steps = [
  ["01", "Connect", "Bring in the signals your team already creates."],
  ["02", "Interpret", "Prime identifies meaningful movement, not noise."],
  ["03", "Decide", "Leaders receive focused actions with context."],
  ["04", "Improve", "Track whether the workplace is actually getting better."],
];

const metrics = [
  ["95%", "signal clarity"],
  ["42%", "faster action"],
  ["3.5×", "wider coverage"],
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={diagonal ? "M5 19 19 5M9 5h10v10" : "M4 12h16m-6-6 6 6-6 6"} />
    </svg>
  );
}

function MenuMark({ open }: { open: boolean }) {
  return (
    <span className={`menu-mark ${open ? "is-open" : ""}`} aria-hidden="true">
      <i />
      <i />
    </span>
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
  const [activeTheme, setActiveTheme] = useState("dark");
  const [demoNotice, setDemoNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [subNotice, setSubNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [checkoutNotice, setCheckoutNotice] = useState<Notice>({ kind: "idle", text: "" });

  const headline = useMemo(() => {
    if (pageMode === "features") return "Read the room. Before the room breaks.";
    if (pageMode === "about") return "Work should feel human. Data can help.";
    if (pageMode === "how-it-works") return "From quiet signal to clear action.";
    if (pageMode === "resources") return "Better questions build better teams.";
    if (pageMode === "demo") return "See what your workplace is saying.";
    if (pageMode === "checkout") return "One system. A clearer workplace.";
    return "Your people are already telling you everything.";
  }, [pageMode]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen || videoOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen, videoOpen]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry) {
          setActiveTheme(activeEntry.target.getAttribute("data-theme") || "dark");
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  async function handleDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setDemoNotice({ kind: "idle", text: "Sending your signal…" });
    try {
      await submitApi("/api/contact", {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        company: String(form.get("company") || ""),
      });
      setDemoNotice({ kind: "success", text: "Received. We’ll shape the walkthrough around your team." });
      event.currentTarget.reset();
    } catch (error) {
      setDemoNotice({ kind: "error", text: error instanceof Error ? error.message : "Could not submit request." });
    }
  }

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubNotice({ kind: "idle", text: "Joining…" });
    try {
      await submitApi("/api/subscribe", { email: String(form.get("email") || "") });
      setSubNotice({ kind: "success", text: "You’re on the list." });
      event.currentTarget.reset();
    } catch (error) {
      setSubNotice({ kind: "error", text: error instanceof Error ? error.message : "Subscription failed." });
    }
  }

  async function handleCheckout() {
    setCheckoutNotice({ kind: "idle", text: "Preparing secure checkout…" });
    try {
      const result = await submitApi("/api/checkout", { plan: "macos-lifetime" });
      setCheckoutNotice({ kind: "success", text: result.message });
    } catch (error) {
      setCheckoutNotice({ kind: "error", text: error instanceof Error ? error.message : "Checkout failed." });
    }
  }

  return (
    <main className="prime-site">
      <SignalCursor />
      <header className="site-header" data-active-theme={activeTheme}>
        <Link className="wordmark" href="/" aria-label="Prime home">
          PRIME<span>°</span>
        </Link>
        <div className="header-signal">
          <i />
          Workplace signal: live
        </div>
        <nav className="header-nav" aria-label="Primary navigation">
          {nav.slice(1, 4).map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <Link href="/demo" className="header-cta" data-cursor-label="Open demo request">Book a demo <Arrow diagonal /></Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          Menu <MenuMark open={menuOpen} />
        </button>
      </header>

      <div className={`menu-layer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-noise" />
        <div className="menu-inner">
          <p className="micro-label">Navigate / Prime intelligence</p>
          <nav>
            {nav.map(([label, href], index) => (
              <Link href={href} key={href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{label}<Arrow diagonal />
              </Link>
            ))}
          </nav>
          <div className="menu-footer">
            <p>Make work feel better—on purpose.</p>
            <Link href="/demo" onClick={() => setMenuOpen(false)}>Start a conversation <Arrow /></Link>
          </div>
        </div>
      </div>

      <section className="hero theme-section" data-theme="dark">
        <Image
          src="/assets/prime-signal-hero.png"
          alt="Abstract human profile composed of workplace signal data"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="hero-content">
          <p className="micro-label">AI workplace intelligence / 2026</p>
          <h1>{headline}</h1>
          <p className="hero-intro">
            Prime turns the emotional pulse of work into decisions leaders can use—before pressure becomes damage.
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/demo" className="primary-action" data-cursor-label="Start with Prime">Read your signals <Arrow /></Link>
          <button onClick={() => setVideoOpen(true)} className="play-action" data-cursor-label="Play product story"><span>▶</span> 01:24 / See Prime in motion</button>
        </div>
        <div className="hero-index">
          <span>Live index</span>
          <strong>78.4</strong>
          <i><b style={{ width: "78.4%" }} /></i>
          <small>+ 4.8 this month</small>
        </div>
        <div className="scroll-cue">Scroll to decode <span>↓</span></div>
      </section>

      <section className="ticker theme-section" data-theme="acid" aria-label="Prime capabilities">
        <div>
          <span>Sentiment intelligence</span><i>✦</i>
          <span>Burnout detection</span><i>✦</i>
          <span>Clearer decisions</span><i>✦</i>
          <span>Healthier teams</span><i>✦</i>
          <span>Sentiment intelligence</span><i>✦</i>
          <span>Burnout detection</span><i>✦</i>
        </div>
      </section>

      <section className="manifesto theme-section" data-theme="light">
        <div className="manifesto-top" data-reveal>
          <p className="micro-label dark">The invisible layer of work</p>
          <p>Most workplace problems whisper before they shout.</p>
        </div>
        <h2 data-reveal>
          WE MAKE THE <em>QUIET SIGNALS</em> IMPOSSIBLE TO MISS.
        </h2>
        <div className="manifesto-bottom" data-reveal>
          <p>Not another dashboard full of noise.</p>
          <p>Prime shows what changed, why it matters, and where to move next.</p>
        </div>
      </section>

      <section className="capabilities theme-section" data-theme="dark">
        <div className="section-intro" data-reveal>
          <p className="micro-label">Three parts / one clearer picture</p>
          <h2>Intelligence with a human pulse.</h2>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article className={`capability-row ${item.tone}`} key={item.number} data-reveal data-cursor-label={`Explore signal ${item.number}`}>
              <span className="cap-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="cap-tags">
                {item.meta.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <Link href="/features" aria-label={`Explore ${item.title}`}><Arrow diagonal /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-lab theme-section" data-theme="deep">
        <div className="lab-copy" data-reveal>
          <p className="micro-label">Live signal lab / No vanity metrics</p>
          <h2>A workplace has a rhythm. Prime learns when it changes.</h2>
          <p>
            See pressure, trust, energy, and belonging as connected signals—not isolated survey scores.
          </p>
          <Link href="/features" className="outline-action" data-cursor-label="Open intelligence layer">Explore the intelligence layer <Arrow diagonal /></Link>
        </div>
        <div className="signal-console" data-reveal>
          <div className="console-head">
            <span>Team pulse / Product</span>
            <span className="live-dot">Live</span>
          </div>
          <div className="radar">
            <div className="radar-rings" />
            <div className="radar-shape" />
            <span className="point p1">Trust <b>84</b></span>
            <span className="point p2">Energy <b>71</b></span>
            <span className="point p3">Clarity <b>66</b></span>
            <span className="point p4">Belonging <b>89</b></span>
          </div>
          <div className="console-alert">
            <span>Signal shift detected</span>
            <strong>Meeting load is affecting clarity across two teams.</strong>
            <small>Recommended action ready →</small>
          </div>
        </div>
      </section>

      <section className="process theme-section" data-theme="blue">
        <div className="process-head" data-reveal>
          <p className="micro-label dark">How Prime moves</p>
          <h2>Listen. Understand. Act. Repeat.</h2>
        </div>
        <div className="process-list">
          {steps.map(([number, title, copy]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="proof theme-section" data-theme="light">
        <div className="proof-image" data-reveal data-cursor-label="People, not percentages">
          <Image
            src="/assets/prime-people-leader.png"
            alt="People operations leader reviewing a workplace report"
            fill
            sizes="(max-width: 800px) 100vw, 48vw"
          />
          <span>People, not percentages.</span>
        </div>
        <blockquote data-reveal>
          <p className="micro-label">Field note / GrowthLabs</p>
          <q>Prime helped us move from “something feels off” to a specific action in the same week.</q>
          <footer>
            <strong>Maya Carter</strong>
            <span>VP, People Operations</span>
          </footer>
          <div className="proof-metrics">
            {metrics.map(([value, label]) => (
              <span key={label}><strong>{value}</strong>{label}</span>
            ))}
          </div>
        </blockquote>
      </section>

      <section className="offer theme-section" data-theme="acid">
        <div className="offer-title" data-reveal>
          <p className="micro-label dark">Early access / One clear plan</p>
          <h2>Less guessing. More signal.</h2>
          <p>Everything you need to hear your workforce and move with confidence.</p>
        </div>
        <div className="offer-card" data-reveal data-cursor-label="Prime lifetime access">
          <div className="offer-price">
            <span>Lifetime access</span>
            <strong><sup>$</sup>59.99</strong>
          </div>
          <ul>
            <li>Unlimited pulse check-ins</li>
            <li>AI sentiment and risk analysis</li>
            <li>Action briefs for leaders</li>
            <li>Free lifetime updates</li>
          </ul>
          <button onClick={handleCheckout}>Get Prime for macOS <Arrow /></button>
          {checkoutNotice.text && <p className={`notice ${checkoutNotice.kind}`}>{checkoutNotice.text}</p>}
        </div>
      </section>

      <section className="demo-block theme-section" data-theme="coral">
        <div className="demo-copy" data-reveal>
          <p className="micro-label">Your team / Your signal</p>
          <h2>Let’s hear what work feels like.</h2>
          <p>Tell us a little about your organization. We’ll tailor the walkthrough to the questions you need answered.</p>
        </div>
        <form onSubmit={handleDemo} className="demo-form" data-reveal>
          <label><span>01 / Name</span><input name="name" required placeholder="Your name" /></label>
          <label><span>02 / Work email</span><input name="email" type="email" required placeholder="you@company.com" /></label>
          <label><span>03 / Company</span><input name="company" required placeholder="Company name" /></label>
          <button type="submit">Request a guided demo <Arrow diagonal /></button>
          {demoNotice.text && <p className={`notice ${demoNotice.kind}`}>{demoNotice.text}</p>}
        </form>
      </section>

      <footer className="site-footer theme-section" data-theme="dark">
        <div className="footer-main">
          <Link className="wordmark footer-mark" href="/">PRIME<span>°</span></Link>
          <h2>Better work starts with better listening.</h2>
          <Link href="/demo" className="footer-circle" data-cursor-label="Make the first move"><span>Start now</span><Arrow diagonal /></Link>
        </div>
        <div className="footer-grid">
          <div>
            <span className="footer-label">Navigate</span>
            {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
          <form onSubmit={handleSubscribe}>
            <span className="footer-label">Signals worth reading</span>
            <label><input name="email" type="email" required placeholder="Your email address" /><button aria-label="Subscribe"><Arrow /></button></label>
            {subNotice.text && <p className={`notice ${subNotice.kind}`}>{subNotice.text}</p>}
          </form>
          <div>
            <span className="footer-label">Status</span>
            <p><i className="status-dot" /> All systems listening</p>
            <p>Built for human workplaces.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Prime Intelligence</span>
          <span>Privacy / Terms</span>
          <span>Dhaka — Everywhere</span>
        </div>
      </footer>

      {videoOpen && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label="Prime product overview">
          <button className="video-close" onClick={() => setVideoOpen(false)}>Close <MenuMark open /></button>
          <div className="video-story">
            <p className="micro-label">Prime in motion / 01:24</p>
            <h2>Listen to the change beneath the numbers.</h2>
            <div className="story-wave">
              {Array.from({ length: 36 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 76)}%` }} />)}
            </div>
            <p>Prime captures signals, finds meaningful shifts, and gives leaders a clear next action.</p>
            <button onClick={() => setVideoOpen(false)}>Continue exploring <Arrow /></button>
          </div>
        </div>
      )}
    </main>
  );
}
