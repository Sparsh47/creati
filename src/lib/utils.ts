import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {toast} from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy to clipboard");
  }
};