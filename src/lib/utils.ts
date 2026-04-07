import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple unique ID generator
export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 6)
  );
}
