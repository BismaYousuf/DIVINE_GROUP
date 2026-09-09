import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const ROUTES = [
  "",
  "/our-difference",
  "/services",
  "/services/trucking-insurance",
  "/get-a-quote",
  "/contact-us",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
