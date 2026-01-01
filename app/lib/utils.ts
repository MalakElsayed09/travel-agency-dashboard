import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  return dayjs(date).format("MMMM D, YYYY");
};

export const formatKey = (key: string) => {
  return key
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getFirstWord = (text: string) => {
  return text.trim().split(/\s+/)[0];
};

export const calculateTrendPercentage = (
  countThisMonth: number,
  countLastMonth: number
) => {
  if (countLastMonth === 0) {
    return { trend: "no-change", percentage: 0 };
  }

  const change = countThisMonth - countLastMonth;
  const percentage = (Math.abs(change) / countLastMonth) * 100;

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no-change", percentage: 0 };
  }
};

export const parseMarkdownToJSON = (markdown: string) => {
  try {
    const cleanedMarkdown = markdown.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanedMarkdown);
  } catch (error) {
    console.error("Error parsing markdown to JSON:", error);
    return null;
  }
};