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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-0.5 truncate text-base font-medium leading-none text-white">
          {title}
        </h1>
        {meta ? <p className="mt-1 truncate text-sm font-normal text-neutral-400">{meta}</p> : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
