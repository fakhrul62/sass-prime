"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { RevealText, ScrambleText } from "./motion-text";

type Notice = {
  kind: "idle" | "success" | "error";
  text: string;
};

type InnerPageContentProps = {
  pageMode: string;
  demoNotice: Notice;
  checkoutNotice: Notice;
  onDemo: (event: FormEvent<HTMLFormElement>) => void;
  onCheckout: () => void;
};

const featureGroups = [
  {
    number: "01",
    title: "Pulse intelligence",
    copy: "Capture lightweight, recurring signals without turning work into another survey campaign.",
    items: ["Adaptive check-ins", "Open-text sentiment", "Participation health", "Team-level trends"],
    tone: "coral",
  },
  {
    number: "02",
    title: "Pressure radar",
    copy: "Spot changes in energy, trust, clarity, and workload while leaders still have room to respond.",
    items: ["Burnout indicators", "Change detection", "Risk clusters", "Early-warning briefs"],
    tone: "blue",
  },
  {
    number: "03",
    title: "Action intelligence",
    copy: "Translate signal movement into specific, contextual next steps instead of generic recommendations.",
    items: ["Priority actions", "Manager prompts", "Decision context", "Progress loops"],
    tone: "acid",
  },
];

const resourceItems = [
  ["Guide", "The early language of burnout", "How pressure appears in team behavior before it becomes attrition.", "8 min"],
  ["Field note", "What psychological safety sounds like", "A practical signal map for trust, candor, and belonging.", "6 min"],
  ["Playbook", "From pulse score to manager action", "A repeatable operating rhythm for turning feedback into visible change.", "12 min"],
  ["Research", "The cost of delayed listening", "Why annual engagement snapshots miss the moments that matter.", "10 min"],
  ["Template", "Team signal review", "A focused agenda for reviewing patterns without exposing individuals.", "4 min"],
  ["Brief", "Clarity during change", "Five questions that reveal whether transformation is landing cleanly.", "5 min"],
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M9 5h10v10" />
    </svg>
  );
}

function PageLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="page-link" href={href} data-cursor-label={String(children)}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

function FeaturesPage() {
  return (
    <>
      <section className="page-intro theme-section" data-theme="light" data-rail-label="One connected intelligence layer" data-rail-action="See the process" data-rail-href="/how-it-works">
        <div data-reveal>
          <p className="micro-label dark">The Prime intelligence system</p>
          <RevealText>One signal is a moment. Connected signals reveal the system.</RevealText>
        </div>
        <p data-reveal>
          Prime combines direct employee input, behavioral context, and change over time. The result is a clearer
          operating picture for leaders without reducing people to a score.
        </p>
      </section>

      <section className="feature-system theme-section" data-theme="dark" data-rail-label="Three layers, one picture" data-rail-action="Request a walkthrough" data-rail-href="/demo">
        {featureGroups.map((group) => (
          <article className={`feature-system-row ${group.tone}`} key={group.number} data-reveal data-cursor-label={`Explore ${group.title}`}>
            <span>{group.number}</span>
            <div>
              <h2>{group.title}</h2>
              <p>{group.copy}</p>
            </div>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Arrow />
          </article>
        ))}
      </section>

      <section className="intelligence-preview theme-section" data-theme="deep" data-rail-label="The signal, interpreted" data-rail-action="See Prime live" data-rail-href="/demo">
        <div className="preview-copy" data-reveal>
          <p className="micro-label">Signal brief / Product team</p>
          <RevealText>Prime tells you what moved and what to do next.</RevealText>
          <p>Every brief connects the pattern, likely cause, affected teams, confidence level, and recommended action.</p>
          <PageLink href="/demo">See a guided signal review</PageLink>
        </div>
        <div className="brief-card" data-reveal data-cursor-label="Open signal brief">
          <div className="brief-head"><span>PRM / 042</span><span className="live-dot">High confidence</span></div>
          <div className="brief-score"><strong>-18</strong><span>Clarity shift<br />14 days</span></div>
          <div className="brief-chart">
            {[62, 66, 64, 59, 61, 53, 48, 50, 44, 46, 42, 39].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="brief-action">
            <span>Recommended move</span>
            <p>Reset decision ownership before the next delivery cycle.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  const principles = [
    ["01", "People are not percentages.", "We use data to reveal context, never to flatten a person into a number."],
    ["02", "Earlier is kinder.", "The best workplace intervention happens before frustration hardens into damage."],
    ["03", "Insight must move.", "A finding without a clear next action is just another dashboard notification."],
    ["04", "Trust is infrastructure.", "Privacy, transparency, and team-level protection are product requirements."],
  ];

  return (
    <>
      <section className="about-statement theme-section" data-theme="coral" data-rail-label="Built for better work" data-rail-action="Explore our principles" data-rail-href="#principles">
        <p className="micro-label" data-reveal>Why Prime exists</p>
        <RevealText>Work shapes a large part of life. It should not take a crisis to make it better.</RevealText>
        <div className="about-columns" data-reveal>
          <p>Prime began with a simple observation: most workplace problems become visible long after people first feel them.</p>
          <p>We are building the listening layer that helps responsible leaders notice sooner, understand deeply, and act with care.</p>
        </div>
      </section>

      <section id="principles" className="principles theme-section" data-theme="light" data-rail-label="The principles behind Prime" data-rail-action="Meet the product" data-rail-href="/features">
        <div className="section-intro" data-reveal>
          <p className="micro-label dark">Operating principles / 04</p>
          <RevealText>Human judgment, made clearer.</RevealText>
        </div>
        <div className="principle-list">
          {principles.map(([number, title, copy]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-image-panel theme-section" data-theme="blue" data-rail-label="A clearer view of work" data-rail-action="Start a conversation" data-rail-href="/demo">
        <div className="about-image" data-reveal data-cursor-label="Human intelligence, amplified">
          <Image src="/assets/prime-people-leader.png" alt="A people leader reviewing workplace insights" fill sizes="(max-width: 900px) 100vw, 52vw" />
        </div>
        <div data-reveal>
          <p className="micro-label dark">Our point of view</p>
          <RevealText>AI should help leaders pay better attention.</RevealText>
          <p>Prime is not an autonomous manager. It is an intelligence partner that gives people the context to make more thoughtful decisions.</p>
          <PageLink href="/demo">Talk with the Prime team</PageLink>
        </div>
      </section>
    </>
  );
}

function ProcessPage() {
  const stages = [
    ["01", "Connect the signal layer", "Choose lightweight check-ins and connect the context your team already creates.", "Minutes, not months"],
    ["02", "Establish the baseline", "Prime learns the healthy rhythm of each team so meaningful change stands out.", "Team-aware patterns"],
    ["03", "Interpret movement", "Signals are clustered, compared over time, and translated into plain-language findings.", "Context over noise"],
    ["04", "Close the loop", "Leaders act, communicate, and track whether the workplace response actually improves.", "Visible accountability"],
  ];

  return (
    <>
      <section id="process-detail" className="process-detail theme-section" data-theme="blue" data-rail-label="Four stages to clearer action" data-rail-action="See Prime live" data-rail-href="/demo">
        <div className="process-detail-head" data-reveal>
          <p className="micro-label dark">The operating loop</p>
          <RevealText>A continuous listening system, not another annual event.</RevealText>
        </div>
        <div className="process-detail-list">
          {stages.map(([number, title, copy, meta]) => (
            <article key={number} data-reveal data-cursor-label={title}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
              <small>{meta}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="integration-strip theme-section" data-theme="acid" data-rail-label="Fits the way teams work" data-rail-action="Discuss your setup" data-rail-href="/demo">
        <span>Slack</span><i>+</i><span>Teams</span><i>+</i><span>Email</span><i>+</i><span>HRIS</span><i>+</i><span>Prime</span>
      </section>

      <section className="trust-section theme-section" data-theme="dark" data-rail-label="Trust is part of the product" data-rail-action="Ask about security" data-rail-href="/demo">
        <div data-reveal>
          <p className="micro-label">Privacy / Protection / Clarity</p>
          <RevealText>Useful to leaders. Safe for teams.</RevealText>
        </div>
        <div className="trust-grid">
          {[
            ["Team-level protection", "Prime highlights collective patterns and avoids exposing individual responses."],
            ["Transparent methodology", "Every insight includes the contributing signals and confidence behind it."],
            ["Controlled access", "Roles and permissions keep sensitive workplace context with the right people."],
          ].map(([title, copy], index) => (
            <article key={title} data-reveal>
              <span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ResourcesPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Guide", "Field note", "Playbook", "Research", "Template", "Brief"];
  const visibleItems = filter === "All" ? resourceItems : resourceItems.filter(([type]) => type === filter);

  return (
    <>
      <section className="resource-library theme-section" data-theme="light" data-rail-label="Ideas for healthier work" data-rail-action="Read the library" data-rail-href="#library">
        <div className="resource-head" data-reveal>
          <p className="micro-label dark">Prime field library / 2026</p>
          <RevealText>Practical intelligence for people who shape work.</RevealText>
        </div>
        <div id="library" className="resource-filters" aria-label="Filter resources">
          {filters.map((item) => (
            <button className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
        <div className="resource-grid">
          {visibleItems.map(([type, title, copy, time], index) => (
            <article key={title} data-reveal data-cursor-label={`Read ${title}`}>
              <div><span>{type}</span><span>0{index + 1}</span></div>
              <h2>{title}</h2>
              <p>{copy}</p>
              <footer><span>{time} read</span><Arrow /></footer>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-newsletter theme-section" data-theme="acid" data-rail-label="One useful signal at a time" data-rail-action="Book a demo" data-rail-href="/demo">
        <p className="micro-label dark">The signal note</p>
        <RevealText>A short field note for building healthier teams.</RevealText>
        <p>No trend reports. No empty thought leadership. Just one useful workplace signal and one practical response.</p>
      </section>
    </>
  );
}

function DemoPage({ notice, onDemo }: { notice: Notice; onDemo: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <>
      <section className="demo-page theme-section" data-theme="coral" data-rail-label="A walkthrough shaped around you" data-rail-action="Complete the form" data-rail-href="#demo-form">
        <div className="demo-page-copy" data-reveal>
          <p className="micro-label">Guided walkthrough / 30 minutes</p>
          <RevealText>Bring the workplace question you cannot answer clearly.</RevealText>
          <p>We will show how Prime captures signals, interprets movement, protects employee trust, and turns findings into action.</p>
          <ul>
            <li>See the complete signal workflow</li>
            <li>Review a realistic team scenario</li>
            <li>Discuss your data and rollout model</li>
          </ul>
        </div>
        <form id="demo-form" onSubmit={onDemo} className="demo-form demo-page-form" data-reveal>
          <div className="form-status"><span>PRM / DEMO</span><span className="live-dot">Requests open</span></div>
          <label><span>01 / Name</span><input name="name" required placeholder="Your name" /></label>
          <label><span>02 / Work email</span><input name="email" type="email" required placeholder="you@company.com" /></label>
          <label><span>03 / Company</span><input name="company" required placeholder="Company name" /></label>
          <button type="submit">Request a guided demo <Arrow /></button>
          {notice.text && <p className={`notice ${notice.kind}`}>{notice.text}</p>}
        </form>
      </section>

      <section className="demo-expect theme-section" data-theme="dark" data-rail-label="What happens next" data-rail-action="Explore features" data-rail-href="/features">
        {[
          ["01", "We read your context", "Your answers shape the scenario and workflow we prepare."],
          ["02", "We show the signal", "The session stays focused on your team, not a generic product tour."],
          ["03", "You leave with clarity", "We map fit, rollout considerations, and the most useful next step."],
        ].map(([number, title, copy]) => (
          <article key={number} data-reveal><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>
        ))}
      </section>
    </>
  );
}

function CheckoutPage({ notice, onCheckout }: { notice: Notice; onCheckout: () => void }) {
  return (
    <>
      <section className="checkout-page theme-section" data-theme="acid" data-rail-label="One plan, full access" data-rail-action="Get Prime" data-rail-href="#buy-prime">
        <div className="checkout-copy" data-reveal>
          <p className="micro-label dark">Prime early access / macOS</p>
          <RevealText>Start listening with the complete Prime system.</RevealText>
          <p>Designed for teams that want a focused signal practice without a long implementation cycle.</p>
          <div className="checkout-meta"><span>Lifetime updates</span><span>Secure checkout</span><span>Early access pricing</span></div>
        </div>
        <div id="buy-prime" className="checkout-card" data-reveal data-cursor-label="Get Prime lifetime access">
          <div className="checkout-card-head"><span>Prime / Lifetime</span><span>01 seat</span></div>
          <strong><sup>$</sup>59.99</strong>
          <p>One payment. Full Prime early access for macOS.</p>
          <ul>
            <li>Unlimited pulse check-ins</li>
            <li>AI sentiment and risk analysis</li>
            <li>Contextual action briefs</li>
            <li>All future early-access updates</li>
          </ul>
          <button onClick={onCheckout}>Continue to secure checkout <Arrow /></button>
          {notice.text && <p className={`notice ${notice.kind}`}>{notice.text}</p>}
        </div>
      </section>

      <section className="checkout-faq theme-section" data-theme="light" data-rail-label="Straight answers before checkout" data-rail-action="Ask a question" data-rail-href="/demo">
        <p className="micro-label dark">Common questions</p>
        {[
          ["Is this a subscription?", "No. The early-access offer is a one-time purchase with lifetime product updates."],
          ["Which platform is included?", "This release is for macOS. Windows availability will be announced separately."],
          ["Can I use it with a team?", "The early-access license starts with one workspace. Team rollout options are discussed during onboarding."],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>{question}<span>+</span></summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}

export default function InnerPageContent(props: InnerPageContentProps) {
  if (props.pageMode === "features") return <FeaturesPage />;
  if (props.pageMode === "about") return <AboutPage />;
  if (props.pageMode === "how-it-works") return <ProcessPage />;
  if (props.pageMode === "resources") return <ResourcesPage />;
  if (props.pageMode === "demo") return <DemoPage notice={props.demoNotice} onDemo={props.onDemo} />;
  if (props.pageMode === "checkout") return <CheckoutPage notice={props.checkoutNotice} onCheckout={props.onCheckout} />;

  return (
    <section className="page-intro theme-section" data-theme="light">
      <p className="micro-label dark"><ScrambleText text="Prime intelligence" /></p>
      <RevealText>The signal you requested is still being mapped.</RevealText>
      <PageLink href="/">Return home</PageLink>
    </section>
  );
}
