import { SchedulerComponent } from "./SchedulerComponent";
import { useStore } from "./store";
import { Scheduler as SchedulerProps } from "./types";
import { useScheduler } from "./hooks/useScheduler";

const Scheduler = (props: SchedulerProps) => {
  useStore(props);

  return <SchedulerComponent />;
};

export { Scheduler, useScheduler };
