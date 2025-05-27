// This file has been migrated to TypeScript as utils.ts. Please use that file instead.
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}