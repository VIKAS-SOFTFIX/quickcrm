"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ButtonLoader } from "./loader"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500":
              variant === "default",
            "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500":
              variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-400":
              variant === "outline",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400":
              variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400":
              variant === "ghost",
            "text-teal-600 underline-offset-4 hover:underline focus-visible:ring-teal-500":
              variant === "link",
          },
          {
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
            "h-10 w-10": size === "icon",
    },
          className
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <ButtonLoader className="mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
