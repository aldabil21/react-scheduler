import { useEffect } from "react";
import { SchedulerComponent } from "./SchedulerComponent";
import { useStore } from "./store";
import { Scheduler as SchedulerProps } from "./types";
import { useScheduler } from "./hooks/useScheduler";

const Scheduler = (props: SchedulerProps) => {
  const { initiateProps } = useStore();

  useEffect(() => {
    initiateProps(props);
    // eslint-disable-next-line
  }, []);

  return <SchedulerComponent />;
};

export { Scheduler, useScheduler };
