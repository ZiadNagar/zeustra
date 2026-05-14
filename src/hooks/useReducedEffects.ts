import { useEffect, useState } from "react";

type NavigatorHints = {
  lowPower: boolean;
  saveData: boolean;
};

function getNavigatorHints(): NavigatorHints {
  if (typeof navigator === "undefined") {
    return { lowPower: false, saveData: false };
  }

  const cores = navigator.hardwareConcurrency || 8;
  const connection =
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection ?? null;
  const saveData = Boolean(connection?.saveData);
  const lowPower = cores <= 4;

  return { lowPower, saveData };
}

const mediaQuery = "(prefers-reduced-motion: reduce)";

export default function useReducedEffects(): boolean {
  const [reducedEffects, setReducedEffects] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mql = window.matchMedia(mediaQuery);
    const apply = () => {
      const hints = getNavigatorHints();
      setReducedEffects(mql.matches || hints.lowPower || hints.saveData);
    };

    apply();

    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return reducedEffects;
}
