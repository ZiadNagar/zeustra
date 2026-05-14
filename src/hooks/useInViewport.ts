import type { RefObject } from "react";
import { useEffect, useState } from "react";

export default function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = {},
): boolean {
  const [isInViewport, setIsInViewport] = useState(true);
  const { threshold = 0.1, root = null, rootMargin = "0px" } = options;

  useEffect(() => {
    const target = ref?.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        setIsInViewport(entry.isIntersecting);
      },
      { threshold, root, rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [ref, threshold, root, rootMargin]);

  return isInViewport;
}
