import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#2c2118]">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6f5a47]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
