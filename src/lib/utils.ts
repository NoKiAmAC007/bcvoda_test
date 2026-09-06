import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatContent(htmlOrText: string): string {
  if (!htmlOrText) return "";
  // If already contains HTML tags — render as is
  if (/<\s*(p|br|div|ul|ol|li|h[1-6]|strong|em|b|i|u|s|strike|blockquote|a|img|iframe)\b/i.test(htmlOrText)) {
    return htmlOrText;
  }
  // Plain text — escape and convert line breaks to paragraphs
  const escaped = htmlOrText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const paragraphs = escaped.split(/\r?\n\s*\r?\n/).filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs.map((p) => `<p>${p.replace(/\r?\n/g, "<br>")}</p>`).join("");
  }
  return `<p>${escaped.replace(/\r?\n/g, "<br>")}</p>`;
}
