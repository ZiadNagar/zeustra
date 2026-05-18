const SCHEDULER_OPEN_EVENT = "zeustra:open-scheduler";
const SCHEDULER_CLOSE_EVENT = "zeustra:close-scheduler";

export function openScheduler(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCHEDULER_OPEN_EVENT));
}

export function closeScheduler(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCHEDULER_CLOSE_EVENT));
}

export function onSchedulerOpen(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SCHEDULER_OPEN_EVENT, callback);
  return () => window.removeEventListener(SCHEDULER_OPEN_EVENT, callback);
}

export function onSchedulerClose(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SCHEDULER_CLOSE_EVENT, callback);
  return () => window.removeEventListener(SCHEDULER_CLOSE_EVENT, callback);
}
