"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Hace aparecer su contenido (fade + subida) cuando entra en pantalla.
 *
 * Usa IntersectionObserver: una API nativa del navegador que avisa
 * cuando un elemento se vuelve visible en el viewport. Así no hace
 * falta escuchar el evento scroll (más costoso) ni instalar una
 * librería de animación. La animación en sí vive en CSS (.cec-reveal).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms, para que varios elementos entren en cascada. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect(); // solo anima la primera vez
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // El cast es necesario porque el ref es genérico para varios tags.
      ref={ref as React.Ref<never>}
      className={cn("cec-reveal", className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
