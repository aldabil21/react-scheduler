import { View } from "../components/nav/Navigation";
import {
  DefaultRecourse,
  ProcessedEvent,
  ResourceFields,
  SchedulerProps,
} from "../Scheduler";

export const getOneView = (state: SchedulerProps): View => {
  if (state.month) {
    return "month";
  } else if (state.week) {
    return "week";
  } else if (state.day) {
    return "day";
  }
  throw new Error("No views were selected");
};

export const getAvailableViews = (state: SchedulerProps) => {
  let views: View[] = [];
  if (state.month) {
    views.push("month");
  }
  if (state.week) {
    views.push("week");
  }
  if (state.day) {
    views.push("day");
  }
  return views;
};

export const getResourcedEvents = (
  events: ProcessedEvent[],
  resource: DefaultRecourse,
  resourceFields: ResourceFields
): ProcessedEvent[] => {
  let recousedEvents = [];
  for (const event of events) {
    if (event[resourceFields.idField] === resource[resourceFields.idField]) {
      recousedEvents.push({
        ...event,
        color: resource[resourceFields.colorField || ""],
      });
    }
  }

  return recousedEvents;
};
