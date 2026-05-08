import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  meta,
  children,
}: {
  eyebrow?: string;
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/35">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-0.5 truncate text-lg font-semibold leading-none text-white sm:text-xl">
          {title}
        </h1>
        {meta ? <p className="mt-1 truncate text-xs text-white/45">{meta}</p> : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
