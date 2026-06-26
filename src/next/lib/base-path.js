export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/warrantywallet";

/** Full path for routes still served by the legacy Express/Vite app. */
export function legacyPath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
