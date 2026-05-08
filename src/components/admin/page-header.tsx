import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm font-medium text-[#a8a09a]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
