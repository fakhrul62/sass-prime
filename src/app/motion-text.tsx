"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

const scrambleCharacters = ["#", "#", "#", "#", "$", "*", "@", "(", "0", "%", "1", ">"];

function randomCharacter(character: string) {
  if (character === " ") return "_";
  if (character === "[" || character === "]") return character;
  return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
}

export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let frame = 0;
    let start = 0;
    let hasPlayed = false;

    const play = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      const duration = 280 + text.length * 8;

      const animate = (time: number) => {
        if (!start) start = time;
        const progress = Math.min(1, (time - start) / duration);
        const resolved = Math.floor(text.length * progress);
        setDisplayed(
          text
            .split("")
            .map((character, index) => (index < resolved ? character : randomCharacter(character)))
            .join(""),
        );

        if (progress < 1) frame = window.requestAnimationFrame(animate);
        else setDisplayed(text);
      };

      frame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [text]);

  return (
    <span ref={elementRef} className={`scramble-text ${className}`} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
    </span>
  );
}

export function RevealText({
  as: Tag = "h2",
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3" | "p";
  children: string;
  className?: string;
}) {
  const elementRef = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);
  const words = children.split(/\s+/);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={elementRef as never}
      className={`word-reveal ${visible ? "is-visible" : ""} ${className}`}
      aria-label={children}
    >
      {words.map((word, index) => (
        <span className="word-reveal-clip" aria-hidden="true" key={`${word}-${index}`}>
          <span
            className="word-reveal-word"
            style={{ "--word-index": index } as CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
