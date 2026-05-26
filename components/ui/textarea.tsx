import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5",
        "text-sm text-gray-900 placeholder:text-gray-400",
        "shadow-sm transition-all duration-200 resize-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400",
        "hover:border-gray-300",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
