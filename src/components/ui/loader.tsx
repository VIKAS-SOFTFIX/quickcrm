"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
  text?: string;
  className?: string;
  type?: "default" | "pulse" | "ai";
}

export function Loader({
  size = "md",
  color = "primary",
  text,
  className,
  type = "default"
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const colorClasses = {
    primary: "text-teal-600",
    white: "text-white"
  };

  // AI-themed loader with dots
  if (type === "ai") {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn("flex items-center gap-1", sizeClasses[size])}>
          <div className={cn(
            "animate-pulse rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            color === "primary" ? "bg-teal-600" : "bg-white",
            "animation-delay-0"
          )}></div>
          <div className={cn(
            "animate-pulse rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            color === "primary" ? "bg-teal-500" : "bg-white/90",
            "animation-delay-150"
          )}></div>
          <div className={cn(
            "animate-pulse rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            color === "primary" ? "bg-teal-400" : "bg-white/80",
            "animation-delay-300"
          )}></div>
          <div className={cn(
            "animate-pulse rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            color === "primary" ? "bg-teal-300" : "bg-white/70",
            "animation-delay-450"
          )}></div>
          <div className={cn(
            "animate-pulse rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            color === "primary" ? "bg-teal-200" : "bg-white/60",
            "animation-delay-600"
          )}></div>
        </div>
        {text && (
          <p className={cn("mt-2 text-sm", color === "white" ? "text-white" : "text-gray-600")}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Pulse loader
  if (type === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn(
          "relative",
          sizeClasses[size]
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full",
            color === "primary" ? "bg-teal-600" : "bg-white",
            "animate-ping opacity-75"
          )}></div>
          <div className={cn(
            "absolute inset-0 rounded-full",
            color === "primary" ? "bg-teal-600" : "bg-white",
            "opacity-90"
          )}></div>
        </div>
        {text && (
          <p className={cn("mt-2 text-sm", color === "white" ? "text-white" : "text-gray-600")}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent border-solid",
          sizeClasses[size],
          color === "primary" ? "border-teal-200 border-t-transparent" : "border-white/30 border-t-transparent"
        )}
      />
      {text && (
        <p className={cn("mt-2 text-sm", color === "white" ? "text-white" : "text-gray-600")}>
          {text}
        </p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = "Loading...", type = "ai" }: { text?: string, type?: "default" | "pulse" | "ai" }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader size="lg" text={text} type={type} />
      </div>
    </div>
  );
}

export function AIProcessingLoader({ text = "AI is processing..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-teal-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-md animate-pulse"></div>
          </div>
        </div>
        <p className="text-gray-800 font-medium">{text}</p>
        <p className="text-gray-500 text-sm mt-2 text-center">This may take a few moments</p>
      </div>
    </div>
  );
}

export function ContentLoader({ text, className, type = "ai" }: { text?: string; className?: string; type?: "default" | "pulse" | "ai" }) {
  return (
    <div className={cn("w-full py-8 flex justify-center", className)}>
      <Loader text={text} type={type} />
    </div>
  );
}

export function ButtonLoader({ className, type = "default" }: { className?: string; type?: "default" | "pulse" | "ai" }) {
  return (
    <Loader size="sm" color="white" className={className} type={type} />
  );
} 