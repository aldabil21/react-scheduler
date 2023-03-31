import {
  addMinutes,
  differenceInDays,
  endOfDay,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { View } from "../components/nav/Navigation";
import {
  DefaultRecourse,
  FieldProps,
  ProcessedEvent,
  ResourceFields,
  SchedulerProps,
} from "../types";
import { StateEvent } from "../views/Editor";

export const getOneView = (state: Partial<SchedulerProps>): View => {
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
  const views: View[] = [];
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

export const arraytizeFieldVal = (field: FieldProps, val: any, event?: StateEvent) => {
  const arrytize = field.config?.multiple && !Array.isArray(event?.[field.name] || field.default);
  const value = arrytize ? (val ? [val] : []) : val;
  const validity = arrytize ? value.length : value;
  return { value, validity };
};

export const getResourcedEvents = (
  events: ProcessedEvent[],
  resource: DefaultRecourse,
  resourceFields: ResourceFields,
  fields: FieldProps[]
): ProcessedEvent[] => {
  const keyName = resourceFields.idField;
  const resourceField = fields.find((f) => f.name === keyName);
  const isMultiple = !!resourceField?.config?.multiple;

  const recousedEvents = [];

  for (const event of events) {
    // Handle single select & multiple select accordingly
    const arrytize = isMultiple && !Array.isArray(event[keyName]);
    const eventVal = arrytize ? [event[keyName]] : event[keyName];

    const isThisResource =
      isMultiple || Array.isArray(eventVal)
        ? eventVal.includes(resource[keyName])
        : eventVal === resource[keyName];

    if (isThisResource) {
      recousedEvents.push({
        ...event,
        color: event.color || resource[resourceFields.colorField || ""],
      });
    }
  }

  return recousedEvents;
};

export const traversCrossingEvents = (
  todayEvents: ProcessedEvent[],
  event: ProcessedEvent
): ProcessedEvent[] => {
  return todayEvents.filter(
    (e) =>
      e.event_id !== event.event_id &&
      (isWithinInterval(addMinutes(event.start, 1), {
        start: e.start,
        end: e.end,
      }) ||
        isWithinInterval(addMinutes(event.end, -1), {
          start: e.start,
          end: e.end,
        }) ||
        isWithinInterval(addMinutes(e.start, 1), {
          start: event.start,
          end: event.end,
        }) ||
        isWithinInterval(addMinutes(e.end, -1), {
          start: event.start,
          end: event.end,
        }))
  );
};

export const calcMinuteHeight = (cellHeight: number, step: number) => {
  return Math.ceil(cellHeight) / step;
};

export const calcCellHeight = (tableHeight: number, hoursLength: number) => {
  return Math.max(tableHeight / hoursLength, 60);
};

export const differenceInDaysOmitTime = (start: Date, end: Date) => {
  return differenceInDays(endOfDay(end), startOfDay(start));
};

export const filterTodayEvents = (events: ProcessedEvent[], today: Date, timeZone?: string) => {
  const list: ProcessedEvent[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = convertEventTimeZone(events[i], timeZone);
    if (
      !event.allDay &&
      isSameDay(today, event.start) &&
      !differenceInDaysOmitTime(event.start, event.end)
    ) {
      list.push(event);
    }
  }

  // Sort by the length est event
  return sortEventsByTheLengthest(list);
};

export const sortEventsByTheLengthest = (events: ProcessedEvent[]) => {
  return events.sort((a, b) => {
    const aDiff = a.end.getTime() - a.start.getTime();
    const bDiff = b.end.getTime() - b.start.getTime();
    return bDiff - aDiff;
  });
};

export const filterMultiDaySlot = (
  events: ProcessedEvent[],
  date: Date | Date[],
  timeZone?: string
) => {
  const list: ProcessedEvent[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = convertEventTimeZone(events[i], timeZone);
    let withinSlot = event.allDay || differenceInDaysOmitTime(event.start, event.end) > 0;
    if (!withinSlot) continue;
    if (Array.isArray(date)) {
      withinSlot = date.some((weekday) =>
        isWithinInterval(weekday, {
          start: startOfDay(event.start),
          end: endOfDay(event.end),
        })
      );
    } else {
      withinSlot = isWithinInterval(date, {
        start: startOfDay(event.start),
        end: endOfDay(event.end),
      });
    }

    if (withinSlot) {
      list.push(event);
    }
  }

  return list;
};

export const convertEventTimeZone = (event: ProcessedEvent, timeZone?: string) => {
  return {
    ...event,
    start: getTimeZonedDate(event.start, timeZone),
    end: getTimeZonedDate(event.end, timeZone),
  };
};

export const getTimeZonedDate = (date: Date, timeZone?: string) => {
  return new Date(
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone,
    }).format(date)
  );
};
