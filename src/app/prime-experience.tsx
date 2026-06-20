"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import InnerPageContent from "./inner-pages";
import { RevealText, ScrambleText, SignalClock } from "./motion-text";
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

const pageConfig: Record<string, { kicker: string; intro: string; action: string; href: string }> = {
  home: {
    kicker: "AI workplace intelligence / 2026",
    intro: "Prime turns the emotional pulse of work into decisions leaders can use—before pressure becomes damage.",
    action: "Read your signals",
    href: "/demo",
  },
  features: {
    kicker: "Prime intelligence system / 03 layers",
    intro: "Capture the signal, understand the movement, and give leaders a clear next action.",
    action: "See Prime live",
    href: "/demo",
  },
  about: {
    kicker: "Our point of view / Human work",
    intro: "We believe earlier listening, clearer context, and accountable action can make work meaningfully better.",
    action: "Explore our principles",
    href: "#principles",
  },
  "how-it-works": {
    kicker: "The Prime operating loop / 04 stages",
    intro: "A continuous system for listening, interpreting, acting, and learning what actually improved.",
    action: "Walk through the process",
    href: "#process-detail",
  },
  resources: {
    kicker: "Prime field library / Practical intelligence",
    intro: "Research, guides, and operating tools for people who want to shape healthier workplaces.",
    action: "Browse the library",
    href: "#library",
  },
  demo: {
    kicker: "Guided walkthrough / Built around your team",
    intro: "See how Prime turns the workplace question you cannot answer into a signal you can act on.",
    action: "Request your demo",
    href: "#demo-form",
  },
  checkout: {
    kicker: "Prime early access / Lifetime plan",
    intro: "Get the complete Prime signal system for macOS with one payment and lifetime updates.",
    action: "Get Prime",
    href: "#buy-prime",
  },
};

const tickerItems = ["Sentiment intelligence", "Burnout detection", "Clearer decisions", "Healthier teams"];

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

function MotionLink({
  href,
  label,
  className,
  cursorLabel,
  diagonal = false,
}: {
  href: string;
  label: string;
  className: string;
  cursorLabel: string;
  diagonal?: boolean;
}) {
  return (
    <Link href={href} className={`motion-link ${className}`} data-cursor-label={cursorLabel}>
      <span className="motion-link-content">
        <span className="motion-link-label">{label}</span>
        <span className="motion-link-label-hover" aria-hidden="true">{label}</span>
      </span>
      <span className="motion-link-arrows">
        <span className="motion-link-arrow"><Arrow diagonal={diagonal} /></span>
        <span className="motion-link-arrow-hover" aria-hidden="true"><Arrow diagonal={diagonal} /></span>
      </span>
    </Link>
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
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState("dark");
  const [activeContext, setActiveContext] = useState({
    label: "Signals become decisions",
    action: "Book a demo",
    href: "/demo",
  });
  const [demoNotice, setDemoNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [subNotice, setSubNotice] = useState<Notice>({ kind: "idle", text: "" });
  const [checkoutNotice, setCheckoutNotice] = useState<Notice>({ kind: "idle", text: "" });
  const config = pageConfig[pageMode] || pageConfig.home;
  const isHome = pageMode === "home";

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
    let cancelled = false;
    const started = performance.now();

    const finish = async () => {
      await document.fonts.ready;
      const remaining = Math.max(0, 900 - (performance.now() - started));
      window.setTimeout(() => {
        if (!cancelled) setLoading(false);
      }, remaining);
    };

    finish();
    return () => {
      cancelled = true;
    };
  }, []);

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
    let frame = 0;

    const update = () => {
      const sampleY = window.innerWidth < 800 ? 66 : 78;
      const target = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom > sampleY;
      });

      if (target) {
        setActiveTheme(target.dataset.theme || "dark");
        setActiveContext({
          label: target.dataset.railLabel || "Signals become decisions",
          action: target.dataset.railAction || "Book a demo",
          href: target.dataset.railHref || "/demo",
        });
      }

      document.querySelector(".site-header")?.toggleAttribute("data-scrolled", window.scrollY > 12);
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setVideoOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
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
      <div className={`site-preloader ${loading ? "is-loading" : "is-ready"}`} aria-hidden={!loading}>
        <div className="preloader-mark">PRIME<span>°</span></div>
        <div className="preloader-status"><ScrambleText text="Calibrating workplace signals" /></div>
        <div className="preloader-line"><i /></div>
      </div>
      <SignalCursor />
      <header className="site-header" data-active-theme={activeTheme}>
        <Link className="wordmark" href="/" aria-label="Prime home">
          PRIME<span>°</span>
        </Link>
        <div className="header-signal">
          <i />
          <ScrambleText text="Workplace signal: live" />
        </div>
        <nav className="header-nav" aria-label="Primary navigation">
          {nav.slice(1, 4).map(([label, href]) => (
            <Link href={href} key={href} aria-current={href.includes(pageMode) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <MotionLink href="/demo" className="header-cta" label="Book a demo" cursorLabel="Open demo request" diagonal />
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          Menu <MenuMark open={menuOpen} />
        </button>
      </header>

      <aside className="context-rail" data-active-theme={activeTheme} aria-label="Current section action">
        <div className="context-rail-line" />
        <div className="context-rail-message">
          <ScrambleText key={activeContext.label} text={activeContext.label} />
        </div>
        <SignalClock />
        <Link href={activeContext.href} data-cursor-label={activeContext.action}>
          <ScrambleText key={activeContext.action} text={activeContext.action} />
          <Arrow diagonal />
        </Link>
      </aside>

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

      <section className={`hero theme-section ${isHome ? "" : "inner-hero"}`} data-theme="dark" data-rail-label="The workplace is speaking" data-rail-action={config.action} data-rail-href={config.href}>
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
          <p className="micro-label"><ScrambleText text={config.kicker} /></p>
          <RevealText as="h1">{headline}</RevealText>
          <p className="hero-intro">{config.intro}</p>
        </div>
        <div className="hero-actions">
          <MotionLink href={config.href} className="primary-action" label={config.action} cursorLabel={config.action} />
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

      <section className="ticker theme-section" data-theme="acid" data-rail-label="Live signal stream" data-rail-action="Explore features" data-rail-href="/features" aria-label="Prime capabilities">
        <div className="ticker-track">
          {[0, 1].map((group) => (
            <div className="ticker-group" aria-hidden={group === 1} key={group}>
              {tickerItems.map((item) => <span key={item}>{item}<i>✦</i></span>)}
            </div>
          ))}
        </div>
      </section>

      {isHome ? (
        <>
      <section className="manifesto theme-section" data-theme="light" data-rail-label="Quiet signals matter" data-rail-action="See how it works" data-rail-href="/how-it-works">
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

      <section className="capabilities theme-section" data-theme="dark" data-rail-label="Three connected capabilities" data-rail-action="Open features" data-rail-href="/features">
        <div className="section-intro" data-reveal>
          <p className="micro-label">Three parts / one clearer picture</p>
          <RevealText>Intelligence with a human pulse.</RevealText>
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

      <section className="signal-lab theme-section" data-theme="deep" data-rail-label="Signal shift detected" data-rail-action="View intelligence" data-rail-href="/features">
        <div className="lab-copy" data-reveal>
          <p className="micro-label"><ScrambleText text="Live signal lab / No vanity metrics" /></p>
          <RevealText>A workplace has a rhythm. Prime learns when it changes.</RevealText>
          <p>
            See pressure, trust, energy, and belonging as connected signals—not isolated survey scores.
          </p>
          <MotionLink href="/features" className="outline-action" label="Explore the intelligence layer" cursorLabel="Open intelligence layer" diagonal />
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

      <section className="process theme-section" data-theme="blue" data-rail-label="Connect to improve" data-rail-action="See the process" data-rail-href="/how-it-works">
        <div className="process-head" data-reveal>
          <p className="micro-label dark">How Prime moves</p>
          <RevealText>Listen. Understand. Act. Repeat.</RevealText>
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

      <section className="proof theme-section" data-theme="light" data-rail-label="People, not percentages" data-rail-action="Read resources" data-rail-href="/resources">
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

      <section className="offer theme-section" data-theme="acid" data-rail-label="Early access is open" data-rail-action="Get Prime" data-rail-href="/checkout">
        <div className="offer-title" data-reveal>
          <p className="micro-label dark">Early access / One clear plan</p>
          <RevealText>Less guessing. More signal.</RevealText>
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

      <section className="demo-block theme-section" data-theme="coral" data-rail-label="Your team, your signal" data-rail-action="Request a demo" data-rail-href="/demo">
        <div className="demo-copy" data-reveal>
          <p className="micro-label">Your team / Your signal</p>
          <RevealText>Let’s hear what work feels like.</RevealText>
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
        </>
      ) : (
        <InnerPageContent
          pageMode={pageMode}
          demoNotice={demoNotice}
          checkoutNotice={checkoutNotice}
          onDemo={handleDemo}
          onCheckout={handleCheckout}
        />
      )}

      <footer className="site-footer theme-section" data-theme="dark" data-rail-label="Better listening starts here" data-rail-action="Make the first move" data-rail-href="/demo">
        <div className="footer-main">
          <Link className="wordmark footer-mark" href="/">PRIME<span>°</span></Link>
          <RevealText>Better work starts with better listening.</RevealText>
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
            <RevealText>Listen to the change beneath the numbers.</RevealText>
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
