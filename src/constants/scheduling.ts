import { publicEnv } from "@/utils/env";

export const ZOOM_SCHEDULER_URL =
  publicEnv.zoomSchedulerUrl;

export function getZoomSchedulerEmbedSrc(
  pageUrl: string = ZOOM_SCHEDULER_URL,
): string {
  const u = new URL(pageUrl);
  u.searchParams.set("embed", "true");
  return u.toString();
}
