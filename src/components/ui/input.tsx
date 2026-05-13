import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-sm border border-black/20 bg-white px-2 py-1 text-base text-black transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-white file:text-sm file:font-medium file:text-foreground placeholder:text-black/40 focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-white dark:disabled:bg-white dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
