import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { seoConfig } from "../seoConfig";

function MetaTags() {
  const location = useLocation();

  // Normalize path and handle dynamic routes
  const currentPath = useMemo(() => {
    const path = location.pathname.toLowerCase().replace(/\/$/, "") || "/";

    // Check for dynamic paths
    if (path.startsWith("/warranties/details/"))
      return "/warranties/details/:id";
    if (path.startsWith("/warranties/delete/")) return "/warranties/delete/:id";

    return path;
  }, [location.pathname]);

  const config = seoConfig[currentPath] || seoConfig["/"];

  useEffect(() => {
    if (!config) return;

    // 1. Update <title>
    document.title = config.title;

    // 2. Manage <meta> tags
    const head = document.head;

    // Remove old dynamic tags (description, keywords, og:*)
    head
      .querySelectorAll(
        'meta[name="description"], meta[name="keywords"], meta[property^="og:"]'
      )
      .forEach((tag) => {
        tag.remove();
      });

    // Add new tags
    config.meta.forEach((metaProps) => {
      const meta = document.createElement("meta");
      Object.entries(metaProps).forEach(([key, value]) => {
        meta.setAttribute(key, value);
      });
      head.appendChild(meta);
    });
  }, [config]);

  // The component does not render any visible HTML; it only executes side effects.
  return null;
}

export default MetaTags;
