import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ml-[2px] rounded-md border px-3 py-1.5"

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-muted",
    ghost: "hover:bg-muted text-foreground",
  }

  return <button className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`} ref={ref} {...props} />
})

Button.displayName = "Button"

export { Button }
