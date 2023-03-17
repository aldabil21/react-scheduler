import { SchedulerComponent } from "./SchedulerComponent";
import { useStore } from "./store";
import { Scheduler as SchedulerProps } from "./types";
import { useScheduler } from "./hooks/useScheduler";
import { useEffect } from "react";

const Scheduler = (props: SchedulerProps) => {
  const { setProps } = useStore(props);

  useEffect(() => {
    setProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props.renderDeps || []);

  return <SchedulerComponent />;
};

export { Scheduler, useScheduler };
