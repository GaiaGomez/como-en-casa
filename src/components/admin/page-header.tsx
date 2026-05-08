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
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        {description ? (
          <p className="mt-0.5 max-w-2xl text-sm font-medium text-white/50">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
