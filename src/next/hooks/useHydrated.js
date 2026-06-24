"use client";

import { useEffect, useState } from "react";

/**
 * Returns true after client hydration. Framer Motion viewport triggers
 * (useInView / whileInView) are unreliable during SSR — gate animations on this.
 */
export default function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
