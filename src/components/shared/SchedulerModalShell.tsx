import { useCallback, useEffect, useState } from "react";
import ZoomSchedulerModal from "@/components/shared/ZoomSchedulerModal";
import { ZOOM_SCHEDULER_URL } from "@/constants/scheduling";
import {
  onSchedulerClose,
  onSchedulerOpen,
} from "@/contexts/schedulerModalGlobals";

const SchedulerModalShell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const unsubOpen = onSchedulerOpen(() => setIsOpen(true));
    const unsubClose = onSchedulerClose(() => setIsOpen(false));
    return () => {
      unsubOpen();
      unsubClose();
    };
  }, []);

  return (
    <ZoomSchedulerModal
      isOpen={isOpen}
      onClose={handleClose}
      schedulerUrl={ZOOM_SCHEDULER_URL}
    />
  );
};

export default SchedulerModalShell;
