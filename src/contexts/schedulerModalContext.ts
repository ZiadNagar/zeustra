import { createContext, useContext } from "react";

export type SchedulerModalContextValue = {
  isOpen: boolean;
  openScheduler: () => void;
  closeScheduler: () => void;
};

export const SchedulerModalContext =
  createContext<SchedulerModalContextValue | null>(null);

const defaultValue: SchedulerModalContextValue = {
  isOpen: false,
  openScheduler: () => {},
  closeScheduler: () => {},
};

export function useSchedulerModal(): SchedulerModalContextValue {
  const ctx = useContext(SchedulerModalContext);
  return ctx ?? defaultValue;
}
