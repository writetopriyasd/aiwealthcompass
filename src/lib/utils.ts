import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: "INR" | "USD" = "INR", compact = true) {
  const opts: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    maximumFractionDigits: compact && Math.abs(value) >= 1000 ? 1 : 2,
    notation: compact && Math.abs(value) >= 100_000 ? "compact" : "standard",
  };
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", opts).format(value);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function changeTone(value: number): "gain" | "loss" | "flat" {
  if (value > 0.001) return "gain";
  if (value < -0.001) return "loss";
  return "flat";
}
