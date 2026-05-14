import type { PropsWithChildren, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import ZoomSchedulerModal from "@/components/shared/ZoomSchedulerModal";
import { ZOOM_SCHEDULER_URL } from "@/constants/scheduling";
import {
  SchedulerModalContext,
  type SchedulerModalContextValue,
} from "@/contexts/schedulerModalContext";

export function SchedulerModalProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const openScheduler = useCallback(() => setIsOpen(true), []);
  const closeScheduler = useCallback(() => setIsOpen(false), []);

  const value = useMemo<SchedulerModalContextValue>(
    () => ({ openScheduler, closeScheduler, isOpen }),
    [openScheduler, closeScheduler, isOpen],
  );

  return (
    <SchedulerModalContext.Provider value={value}>
      {children}
      <ZoomSchedulerModal
        isOpen={isOpen}
        onClose={closeScheduler}
        schedulerUrl={ZOOM_SCHEDULER_URL}
      />
    </SchedulerModalContext.Provider>
  );
}
