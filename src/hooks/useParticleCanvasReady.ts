import { useLayoutEffect, useState } from "react";
import { PARTICLE_CANVAS_BG } from "@/components/effects/presets";

export default function useParticleCanvasReady(): boolean {
  const [imageReady, setImageReady] = useState(false);

  useLayoutEffect(() => {
    const existing = document.querySelector(
      `link[rel=preload][href='${PARTICLE_CANVAS_BG}']`,
    );

    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = PARTICLE_CANVAS_BG;
      link.setAttribute("data-injected", "particle-canvas-preload");
      document.head.appendChild(link);
    }

    const image = new Image();
    image.onload = () => setImageReady(true);
    image.src = PARTICLE_CANVAS_BG;

    if (image.complete) {
      setImageReady(true);
    }
  }, []);

  return imageReady;
}
