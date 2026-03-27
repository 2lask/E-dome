import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input type={type} ref={ref}
      className={cn("flex h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm text-white placeholder:text-white/25 transition-all focus:outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props} />
  )
)
Input.displayName = "Input"
export { Input }
